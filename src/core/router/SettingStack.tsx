import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AboutScreen, HelpAndSupportScreen, LanguageScreen, PrivacyAndTermsScreen, ProfileDetailsScreen, SettingScreen, TermsOfServiceScreen, ThemeScreen } from '../../module';

const Stack = createNativeStackNavigator();

const UserStack: React.FC = () => {
    return (
        <Stack.Navigator
            initialRouteName="SettingScreen"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="SettingScreen" component={SettingScreen} />
            <Stack.Screen name="ThemeScreen" component={ThemeScreen} />
            <Stack.Screen name="LanguageScreen" component={LanguageScreen} />
            <Stack.Screen name="HelpAndSupportScreen" component={HelpAndSupportScreen} />
            <Stack.Screen name="AboutScreen" component={AboutScreen} />
            <Stack.Screen name="PrivacyAndTermsScreen" component={PrivacyAndTermsScreen} />
            <Stack.Screen name="TermsOfServiceScreen" component={TermsOfServiceScreen} />
            <Stack.Screen name="ProfileDetailsScreen" component={ProfileDetailsScreen} />
        </Stack.Navigator>
    );
}
export default UserStack;