import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ServiceProviderAppointmentScreen, ServiceProviderAppointmentViewScreen } from '../../module';

const Stack = createNativeStackNavigator();

const SeviceProviderAppointmentStack: React.FC = () => {
    return (
        <Stack.Navigator
            initialRouteName="ServiceProviderAppointmentScreen"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="ServiceProviderAppointmentScreen" component={ServiceProviderAppointmentScreen} />
            <Stack.Screen name="ServiceProviderAppointmentViewScreen" component={ServiceProviderAppointmentViewScreen} />
        </Stack.Navigator>
    );
}
export default SeviceProviderAppointmentStack;