import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { AuthHeader } from '@components/organisms/header';
import BookingCard from '../../../component/molecules/ServiceCard/BookingCard';
import FlexibleToggleButtonList from '../../../component/molecules/Toggle/FlexibleToggleButtonList';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const TABS = ['Confirmed', 'Waiting', 'In Progress', 'Completed'];

const mockData: any[] = [
    { id: '1', title: 'Deep Home Cleaning', datetime: 'Oct 24, 10:00 AM', provider: 'Sarah Jenkins', rating: '4.8', status: 'confirmed' },
    { id: '2', title: 'Pipe Repair', datetime: 'Pending Confirmation', provider: '', rating: '', status: 'waiting' },
    { id: '3', title: 'Electrical Maintenance', datetime: 'Started 15 mins ago', provider: 'Mike Ross', rating: '4.9', status: 'inprogress' },
    { id: '4', title: 'Garden Trimming', datetime: 'Oct 28, 02:00 PM', provider: 'Emma Wilson', rating: '4.7', status: 'confirmed' },
    { id: '5', title: 'AC Service', datetime: 'Completed Oct 12', provider: 'John Doe', rating: '', status: 'done' },
];

const AllUserBookingScreen: React.FC = () => {
    const theme: any = useTheme();
    const { t } = useTranslation();
    const [selected, setSelected] = useState('Confirmed');
    const navigation: any = useNavigation();

    const themed = StyleSheet.create({
        screenBg: { backgroundColor: theme.background02 ? theme.background02(100) : '#0f1724' },
        listPadding: { padding: 16 },
        toggleWrap: { paddingHorizontal: 16, paddingTop: 8 },
    });

    const filtered = mockData.filter((i) => {
        if (selected === 'Confirmed') return i.status === 'confirmed';
        if (selected === 'Waiting') return i.status === 'waiting';
        if (selected === 'In Progress') return i.status === 'inprogress';
        if (selected === 'Completed') return i.status === 'done';
        return true;
    });

    return (
        <SafeAreaView style={[styles.container, themed.screenBg]}>
            <AuthHeader title={t('my_bookings') || 'My Bookings'} />

            {/* Use the reusable ToggleButtonList for the tabs */}
            <View style={themed.toggleWrap}>
                <FlexibleToggleButtonList
                    options={TABS.map((tab) => ({ key: tab, label: t(tab.toLowerCase().replace(/ /g, '_')) || tab }))}
                    selectedKey={selected}
                    onChange={(k) => setSelected(k)}
                    spacing={12}
                />
            </View>

            <FlatList
                data={filtered}
                keyExtractor={(i) => i.id}
                contentContainerStyle={themed.listPadding}
                renderItem={({ item }) => <BookingCard
                    item={{ ...item, image: undefined }}
                    onPress={() => { navigation.navigate("BookingDetailScreen"); }} />}
                ItemSeparatorComponent={() => null}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
});

export default AllUserBookingScreen;
