import React from 'react'
import { ThemeProvider } from '../../context/ThemeContext'
import WeatherScreen from '../weather'
import { LogLevel, OneSignal } from 'react-native-onesignal';


const index = () => {

  OneSignal.Debug.setLogLevel(LogLevel.Verbose);

  // OneSignal Initialization
  OneSignal.initialize("eb8ea0a3-05aa-4cb3-9073-9f624ae6301b");

  // requestPermission will show the native iOS or Android notification permission prompt.
  // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
  OneSignal.Notifications.requestPermission(true);

  // Method for listening for notification clicks
  OneSignal.Notifications.addEventListener('click', (event) => {
    console.log('OneSignal: notification clicked:', event);});

      


    

  return (
    <ThemeProvider>
      <WeatherScreen />
    </ThemeProvider>
  );
};

export default index;