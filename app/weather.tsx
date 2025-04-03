import { Platform,View, Text, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import ThemeToggleButton from '../components/ThemeToggleButton';

import React, { useEffect, useState ,useContext} from 'react';
import * as Location from 'expo-location';
import { FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Searchbar } from 'react-native-paper';


const BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = "2c7c6084ca54754e03a6be878e3742ea";

//http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

// api.openweathermap.org/data/2.5/forecast/daily?lat={lat}&lon={lon}&cnt={cnt}&appid={API key}
type Weather = {
    name: string;
    main: {
        temp: number;
        humidity: number;
        pressure: number;
    };
    wind: {
        speed: number;
        deg: number;
    };
    weather: {
        main: string;
        description: string;
        icon: string;
    }[];

};
type Forecast = {
    dt: number;
    main: {
        temp: number;
        humidity: number;
        pressure: number;
    };

}

const WeatherScreen = () => {
    const { isDarkMode } = useContext(ThemeContext);
    const [searchQuery, setSearchQuery] = useState("");

    const [weather, setWeather] = useState<Weather>();
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [forecast, setForecast] = useState<Forecast[]>(); 


    const units = "metric"; 
    const fetchWeather = async (lat?: number, lon?: number) => {
        try {
            let latitude = lat;
            let longitude = lon;
    
            if (!latitude || !longitude) {
                // Fetch current location if lat & lon are not provided
                if (!location) {
                    console.log("Location is null");
                    return;
                }
                latitude = location.coords.latitude;
                longitude = location.coords.longitude;
            }
    
            console.log(`Fetching weather for lat=${latitude}, lon=${longitude}`);
            
            const results = await fetch(`${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${units}`);
            const data = await results.json();
            setWeather(data);
        } catch (error) {
            console.error("Error fetching weather:", error);
        }
    };
    
    const fetchWeatherByCity = async () => {
        if (!searchQuery.trim()) return;
    
        try {
            console.log("Fetching coordinates for:", searchQuery);
    
            const geoResults = await fetch(
                `http://api.openweathermap.org/geo/1.0/direct?q=${searchQuery}&limit=5&appid=${API_KEY}`
            );
            const geoData = await geoResults.json();
    
            if (!geoData.length) {
                setErrorMsg("City not found!");
                return;
            }
    
            const { lat, lon } = geoData[0]; 
            console.log(`Coordinates for ${searchQuery}: lat=${lat}, lon=${lon}`);
    
            // ✅ Fetch weather for extracted lat/lon
            fetchWeather(lat, lon);
        } catch (error) {
            setErrorMsg("Failed to fetch location.");
        }
    };
    

    const fetchForecast = async () => { 

        // api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
        if(!location) {
            console.log("location is null");
            return;
        }
        const lat = location?.coords.latitude || 0; // default to 0 if location is null
        const lon =location?.coords.longitude || 0; 


        const results = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`);
        const data = await results.json();
        setForecast(data.list);                          

       
    }
    useEffect(() => {
        if(location)//if the location is not null
        {
            fetchWeather();
            fetchForecast();
        }
      
    }, [location]);// fetch the weather only when the location changes

    useEffect(() => {
        async function getCurrentLocation() {
          
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
    
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);
        }
    
        getCurrentLocation();
      }, []);



    if (!weather) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <LinearGradient colors={['#0000FF', '#87CEFA']} style={styles.container}>



        <View style={[
            styles.container,
            { backgroundColor: isDarkMode ? "#000" : "#fff" },
          ]}>

            <View style={{ width: '90%', marginVertical: 20 }}>
                <Searchbar
                    placeholder="Search city..."
                    value={searchQuery}
                    onChangeText={(query) => setSearchQuery(query)}
                    onSubmitEditing={fetchWeatherByCity} // Fetch weather on enter key
                />
            </View>

            <View style={{ position: 'absolute', top: 20, right: 20 }}>
            <ThemeToggleButton />
            </View>

            <View style={styles.container2}>    

            <Text style={styles.text}>Name of Location: {weather.name}</Text>
            <Text style={styles.text}>Current Temperature: </Text>

            <Text style={styles.temp}>
            {Math.floor(weather.main.temp)} {units === "metric" ? "°C" : "°F"}
            </Text>
            <Text style={styles.text}> {weather.weather[0].main}</Text>
            <Text style={styles.text}> {weather.weather[0].description}</Text>
            <Text style={styles.text}>Weather Humidity: {weather.main.humidity}%</Text>
            <Text style={styles.text}>Weather Pressure: {weather.main.pressure} hPa</Text>
            <Text style={styles.text}>Wind Speed: {weather.wind.speed} m/s</Text>


            </View>

            <View style={styles.container4}>

            <FlatList 
            data={forecast}
            horizontal
            contentContainerStyle={{ minWidth :  '100%' }}
            renderItem={({ item }) => (
            <View style={{ margin: 10,padding: 10, backgroundColor: '#BEE4F4', borderRadius: 10 }}> 
                <Text style={styles.text}>
                {new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}, 
                </Text>
                <Text style={styles.text}>
                {new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}

                </Text>
                <Text style={styles.temperature}>
                {Math.floor(item.main.temp)} {units === "metric" ? "°C" : "°F"} 
                </Text>
            </View>
            )}                             
            
            />


            </View>
          
          
        </View>
        </LinearGradient>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container2: {
        top: 0,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 128, 0.55)', // Transparent yellow
        padding: Dimensions.get('window').width * 0.01, // 25% of screen width
        borderRadius: '10%',
    },
    container4: {
       position: 'absolute',
        bottom: 0, // Position at the bottom of the screen
        width: '100%',
        justifyContent: 'center',
    },
    text: {
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 18,
        marginVertical: 5,
        color: '#333',
    },
    temp: {
        fontFamily: 'InterBlack',
        fontWeight: 'bold',
        fontSize: 20,
        color: '#333',
    },
    temperature: {
        fontFamily: 'InterBlack',
        fontWeight: 'bold',
        fontSize: 20,
        color: '#333',
    },
});

export default WeatherScreen;