import React from "react";
import { View, StyleSheet, Text } from "react-native";
// import { Header } from "../../../component";
// import { useTheme } from '@react-navigation/native';

const AbouUs = ({ }) => {
    // const schema = useTheme();
    return (
        <View style={styles.Container}>

            <Text style={{ color: '#000' }}>
                Abou Us
            </Text>
        </View>
    )
}

export default AbouUs;

const styles = StyleSheet.create({
    Container: {
        flex: 1,
    }
});