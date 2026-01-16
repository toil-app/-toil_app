
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import {
    ServiceProviderAccountCreateOneScreen, ServiceProviderPersonalInfoCollectScreen
    , ServiceProviderMemberCountManageScreen,
    ServiceProviderIdentityVerificationScreen,
    PhoneNumberVerificationScreen,
    PhoneNumberEntryScreen,
    ServiceProviderCollectQulificationAuthScreen,
    InitatieScreen,
    UserCreateAccountScreen as CreateAccountScreen,
} from '../../module';


const Stack = createNativeStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator
            initialRouteName='InitialScreen'
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="InitialScreen" component={InitatieScreen} />
            <Stack.Screen name="SignupScreenOne" component={ServiceProviderAccountCreateOneScreen} />
            <Stack.Screen name="SignupScreenTwo" component={ServiceProviderPersonalInfoCollectScreen} />
            <Stack.Screen name="SignupScreenThree" component={ServiceProviderCollectQulificationAuthScreen} />
            <Stack.Screen name="SignupScreenFour" component={ServiceProviderMemberCountManageScreen} />
            <Stack.Screen name="SignupScreenFive" component={ServiceProviderIdentityVerificationScreen} />
            <Stack.Screen name="IdentityVerificationScreen" component={ServiceProviderIdentityVerificationScreen} />
            <Stack.Screen name="UserSignupScreen" component={CreateAccountScreen} />
            <Stack.Screen name="LoginScreen" component={PhoneNumberEntryScreen} />
            <Stack.Screen name="PhoneNumberVerificationScreen" component={PhoneNumberVerificationScreen} />
        </Stack.Navigator>
    );
};

export default AuthStack;