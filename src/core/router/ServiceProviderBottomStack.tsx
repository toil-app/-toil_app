import React, { useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import SettingStack from './SettingStack';
import { useTheme } from '@core/util/Theme';
import { useTranslation } from 'react-i18next';
import { ServiceProviderMasterScheduleScreen } from "../../module"
import ServiceProviderStack from './ServiceProviderStack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ServiceProviderAppointmentStack from './ServicePrividerAppointmentStack';

const Tab = createBottomTabNavigator();

function ServiceProviderBottomTabs() {
    const theme: any = useTheme();
    const { t } = useTranslation();

    const tabBarStyle = useMemo(
        () => ({
            position: 'absolute' as const,
            backgroundColor: theme.background02 ? theme.background02(100) : '#0b1216',
            borderTopWidth: 0,
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            height: 65,
            paddingBottom: 8,
            paddingTop: 8,
            borderRadius: 24,
            marginHorizontal: 16,
            marginBottom: 16,
        }),
        [theme]
    );

    const commonOptions = useMemo(
        () => ({
            headerShown: false,
            tabBarActiveTintColor: theme.text02 ? theme.text02(100) : '#3B82F6',
            tabBarInactiveTintColor: theme.text02 ? theme.text02(75) : '#9CA3AF',
            tabBarStyle,
            tabBarLabelStyle: {
                fontSize: 11,
                fontWeight: 600 as const,
                marginTop: 2,
            },
            tabBarIconStyle: {
                marginTop: 2,
            },
        }),
        [theme, tabBarStyle]
    );

    const screenOptions: any = ({ route }: { route: RouteProp<any, string> }) => {
        const getIconName = (name: string, focused: boolean) => {
            switch (name) {
                case 'Appointments':
                    return focused ? 'calendar-check' : 'calendar-check-outline';
                case 'Home':
                    return focused ? 'home' : 'home-outline';
                case 'Calendar':
                    return focused ? 'calendar-month' : 'calendar-month-outline';
                case 'Settings':
                    return focused ? 'cog' : 'cog-outline';
                default:
                    return 'circle';
            }
        };

        return {
            ...commonOptions,
            tabBarIcon: ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
                <Icon name={getIconName(route.name, focused)} size={size} color={color} />
            ),
        };
    };

    return (
        <Tab.Navigator screenOptions={screenOptions} initialRouteName="Home">
            <Tab.Screen
                name="Appointments"
                component={ServiceProviderAppointmentStack}
                options={{
                    tabBarLabel: t('appointments'),
                    tabBarBadge: 2,
                }}
            />
            <Tab.Screen
                name="Home"
                component={ServiceProviderStack}
                options={{
                    tabBarLabel: t('home'),
                }}
            />
            <Tab.Screen
                name="Calendar"
                component={ServiceProviderMasterScheduleScreen}
                options={{
                    tabBarLabel: t('calendar'),
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingStack}
                options={{
                    tabBarLabel: t('settings'),
                }}
            />
        </Tab.Navigator>
    );
}

export default React.memo(ServiceProviderBottomTabs);