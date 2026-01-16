import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BookingScreen, BookingDetailScreen, AllUserBookingScreen } from '../../module';

const Stack = createNativeStackNavigator();

const UserBookingStack: React.FC = () => {
    return (
        <Stack.Navigator
            initialRouteName="AllUserBookingScreen"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="BookingScreen" component={BookingScreen} />
            <Stack.Screen name="BookingDetailScreen" component={BookingDetailScreen} />
            <Stack.Screen name="AllUserBookingScreen" component={AllUserBookingScreen} />
        </Stack.Navigator>
    );
}
export default UserBookingStack;