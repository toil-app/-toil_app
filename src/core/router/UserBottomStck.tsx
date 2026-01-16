import React from 'react';
import { createNativeBottomTabNavigator } from '@react-navigation/bottom-tabs/unstable';
import UserStack from './UserStack';
import SettingStack from './SettingStack';
import UserBookingStack from './UserBookingStack';
import { useTheme } from '@core/util/Theme';
import { useTranslation } from 'react-i18next';


const Tab = createNativeBottomTabNavigator();

function UserBottomTabs() {
    const theme: any = useTheme();
    const { t } = useTranslation();
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarBlurEffect: 'dark',
                tabBarActiveTintColor: '#e91e63',
                tabBarInactiveTintColor: '#ffffff',
                tabBarStyle: { backgroundColor: theme.background01 ? theme.background01(100) : '#0b1216' },
                tabBarControllerMode: 'tabSidebar',
                tabBarMinimizeBehavior: 'automatic',
                tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' }
            }}
            initialRouteName='Home'>
            <Tab.Screen
                name="Bookings"
                component={UserBookingStack}
                options={{ tabBarLabel: t('my_bookings') }} />
            <Tab.Screen
                name="Home"
                component={UserStack}
                options={{ tabBarLabel: t('home') }} />
            <Tab.Screen
                name="Settings"
                component={SettingStack}
                options={{ tabBarLabel: t('settings') }} />
        </Tab.Navigator>
    );
}
export default UserBottomTabs;