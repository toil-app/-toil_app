import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserDashboardScreen, SaveFindLocationScreen, MakeABookingScreen, BookingSummaryScreen } from '../../module';

const Stack = createNativeStackNavigator();

const UserStack: React.FC = () => {
    return (
        <Stack.Navigator
            initialRouteName="UserDashboardScreen"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="UserDashboardScreen" component={UserDashboardScreen} />
            <Stack.Screen name="SaveFindLocationScreen" component={SaveFindLocationScreen} />
            <Stack.Screen name="MakeABookingScreen" component={MakeABookingScreen} />
            <Stack.Screen name="BookingSummaryScreen" component={BookingSummaryScreen} />
        </Stack.Navigator>
    );
}
export default UserStack;