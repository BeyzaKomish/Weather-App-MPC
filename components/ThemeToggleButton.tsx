import React, { useContext } from "react";
import { Switch, View, Text, StyleSheet } from "react-native";
import { ThemeContext } from "../context/ThemeContext";

const ThemeToggleButton = () => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                {isDarkMode ? "Light Mode    " : "  Dark Mode  "}
            </Text>
            <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                thumbColor={isDarkMode ? "#f4f3f4" : "#f4f3f4"}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
            />
        </View>

        
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        backgroundColor: "#e0e0e0",
        borderRadius: 10,
        margin: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
});

export default ThemeToggleButton;
