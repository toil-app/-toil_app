import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './AuthStacks';
import UserBottomStack from './UserBottomStck';
import ServiceProviderBottomTabs from './ServiceProviderBottomStack';

const Stack = createNativeStackNavigator();

const RootStack: React.FC = () => {
    return (
        <Stack.Navigator
            initialRouteName="Auth"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="Auth" children={AuthStack} />
            <Stack.Screen name="User" component={UserBottomStack} />
            <Stack.Screen name="ServiceProvider" component={ServiceProviderBottomTabs} />

        </Stack.Navigator>
    );
}
export default RootStack;