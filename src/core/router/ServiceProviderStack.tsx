import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EditTeamMemberScreen, InviteMemberScreen, InviteMemberStatusScreen, MemberScheduleScreen, ServiceProviderAppointmentScreen, ServiceProviderDashboardScreen, TeamScreebn } from '../../module';

const Stack = createNativeStackNavigator();

const ServiceProviderStack: React.FC = () => {
    return (
        <Stack.Navigator
            initialRouteName="ServiceProviderDashboardScreen"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="ServiceProviderDashboardScreen" component={ServiceProviderDashboardScreen} />
            <Stack.Screen name="TeamScreen" component={TeamScreebn} />
            <Stack.Screen name="InviteMemberScreen" component={InviteMemberScreen} />
            <Stack.Screen name="InviteMemberStatusScreen" component={InviteMemberStatusScreen} />
            <Stack.Screen name="EditTeamMemberScreen" component={EditTeamMemberScreen} />
            <Stack.Screen name="MemberScheduleScreen" component={MemberScheduleScreen} />
            <Stack.Screen name="ServiceProviderAppointmentScreen" component={ServiceProviderAppointmentScreen} />
        </Stack.Navigator>
    );
}
export default ServiceProviderStack;