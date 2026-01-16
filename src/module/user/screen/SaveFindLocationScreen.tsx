import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { H4, P } from '@components/atoms/Typhography/variants';
import { FakeButtonSearchInput } from '@components/atoms/Button/FakeButtonSearchInput';
import { relativeWidth, relativeHeight } from '@core/util/Theme/layout';
import AuthHeader from '@components/organisms/header/AuthHeader';
import { useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IIcon from "react-native-vector-icons/Ionicons";
import { ButtonV1 } from '@components/atoms/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchLocationModal from '@components/organisms/SearchLocationModal';
import { RegisteredLocation } from '@core/models/firebase/UserFB';

const { width } = Dimensions.get('window');

// const sampleLocations = [
//     { id: 'home', label: 'Home', address: '123 Maple Street, Apt 4B\nSan Francisco, CA 94110' },
//     { id: 'office', label: 'Office', address: 'Tech Plaza, 500 Market St\nSan Francisco, CA 94104' },
//     { id: 'gym', label: 'The Daily Gym', address: '88 Fitness Blvd\nSan Francisco, CA 94103' },
// ];

const Separator = () => <View style={styles.separator} />;

const SaveFindLocationScreen: React.FC = () => {
    const theme: any = useTheme();
    const { t } = useTranslation();
    const navigation: any = useNavigation();
    const [selectedId, setSelectedId] = useState<string>('home');
    const [searchModalVisible, setSearchModalVisible] = useState(false);
    const [locations, setLocations] = useState<RegisteredLocation[]>([]);

    const themed = StyleSheet.create({
        container: { backgroundColor: theme.background02 ? theme.background02(100) : '#071018' },
        card: { backgroundColor: theme.background01 ? theme.background01(100) : '#0B1220' },
        actionBtn: { backgroundColor: theme.primary01 ? theme.primary01(100) : '#3467a5ff' },
        actionText: { color: '#fff' },
        outlineBtnBorder: { borderColor: theme.primary01 ? theme.primary01(100) : '#5c88e7ff' },
        selectedBorder: { borderColor: theme.primary01 ? theme.primary01(100) : '#5c81e7ff' },
        confirmBtnBg: { backgroundColor: theme.primaryGradientStart ? theme.primaryGradientStart(100) : '#5c7ae7ff' },
    });

    const onOpenSearch = () => {
        setSearchModalVisible(true);
    };

    const handleLocationSelect = (location: RegisteredLocation, label?: string): void => {
        // Add the new location to the list and select it
        const newLocation: RegisteredLocation = {
            id: location.id,
            label: label || '',
            address: typeof location.address === 'string' ? { streetAddress: location.address, city: '', state: '', country: '', postalCode: '' } : location.address,
        };
        setLocations(prev => [newLocation, ...prev]);
        setSelectedId(newLocation.id);
        setSearchModalVisible(false);
    };


    const renderLocation = ({ item }: any) => {
        const selected = selectedId === item.id;
        return (
            <TouchableOpacity onPress={() => setSelectedId(item.id)} activeOpacity={0.9}>
                <View style={[styles.locationRow, themed.card, selected ? styles.selectedLocation : null, selected ? themed.selectedBorder : null]}>
                    <View style={styles.locationMeta}>
                        <View style={[styles.radioOuter, { borderColor: selected ? theme.button02(100) : theme.primary01(25) }]}>{selected ? <View style={[styles.radioInner, { backgroundColor: selected ? theme.button02(100) : theme.primary01(25) }]} /> : null}</View>
                        <View style={styles.locationTextBlock}>
                            <H4 style={styles.textAlignLeft} themeToken="text01">{item.label}</H4>
                            <P style={styles.textAlignLeft} themeToken="text02">{typeof item.address === 'string' ? item.address : item.address.streetAddress}</P>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.trashBtn}>
                        <Icon name="delete" size={20} color={typeof theme.text02 === 'function' ? theme.text02(75) : '#9aa6b6'} />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, themed.container]}>
            <SafeAreaView >

                <AuthHeader
                    title={t('select_location') || 'Select Location'}
                    centerContainerStyle={styles.centerLeft}
                    onBack={() => { }}
                />

                <View style={styles.searchWrap}>
                    <FakeButtonSearchInput onPressWhenDisabled={onOpenSearch} placeholder={t('search_location_placeholder') || 'Search for an address...'} width={relativeWidth(340)} />
                </View>
                <SearchLocationModal
                    visible={searchModalVisible}
                    onClose={() => setSearchModalVisible(false)}
                    onSelect={handleLocationSelect}
                />

                <View style={styles.sectionHeader}>
                    <H4 themeToken="text01">{t('my_saved_locations') || 'My Saved Locations'}</H4>
                    {/* <TouchableOpacity>
                    <P themeToken="text02">{t('add_location') || 'Add'}</P>
                </TouchableOpacity> */}
                </View>

                <FlatList
                    data={locations}
                    keyExtractor={(i) => i.id}
                    renderItem={renderLocation}
                    ItemSeparatorComponent={Separator}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />

                <View style={styles.addSection}>
                    <TouchableOpacity style={[styles.mapCard, themed.card]}>
                        <View style={[styles.mapIcon, { backgroundColor: theme.light }]} >
                            <IIcon name="map" size={20} color={theme.primary01(100)} />
                        </View>
                        <View style={styles.mapTextBlock}>
                            <H4 style={styles.textAlignLeft} themeToken="text01">{t('pick_from_map') || 'Pick from Map'}</H4>
                            <P style={styles.textAlignLeft} themeToken="text02">{t('pick_from_map_sub') || 'Pin your exact location visually'}</P>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onOpenSearch} style={[styles.manualRow, themed.card]}>
                        <View style={[styles.manualLeftIcon, { backgroundColor: theme.light }]} >
                            <IIcon name="location" size={20} color={theme.primary01(100)} />
                        </View>
                        <View style={styles.manualTextBlock}>
                            <H4 style={styles.textAlignLeft} themeToken="text01">{t('input_address_manually') || 'Input Address Manually'}</H4>
                            <P style={styles.textAlignLeft} themeToken="text02">{t('input_address_manually_sub') || 'Enter postcode, street, or building'}</P>
                        </View>
                        <P themeToken="text02">›</P>
                    </TouchableOpacity>
                </View>

                <View style={styles.confirmRow}>
                    <ButtonV1 text={t('confirm_location') || 'Confirm Location'} onPress={() => navigation.goBack()} containerStyle={styles.confirmBtn} />
                </View>

            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: relativeWidth(16) },
    centerLeft: { alignItems: 'flex-start' },
    header: { marginTop: relativeHeight(12), marginBottom: 12 },
    headerAddress: { marginTop: 6 },
    searchWrap: { marginVertical: relativeHeight(12), alignItems: 'center' },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    listContent: { paddingBottom: 24 },
    separator: { height: 12 },
    locationRow: { width: '100%', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    selectedLocation: { borderWidth: 1.5 },
    radioOuter: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, marginRight: 20, alignItems: 'center', justifyContent: 'center' },
    radioInner: { width: 10, height: 10, borderRadius: 5, },
    trashBtn: { padding: 8 },
    addSection: { marginTop: 12 },
    mapCard: { width: '100%', borderRadius: 12, padding: 18, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    mapIcon: { width: 34, height: 34, borderRadius: 24, marginRight: 12, justifyContent: 'center', alignItems: 'center' },
    mapTextBlock: { flex: 1 },
    manualRow: { width: '100%', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', },
    manualLeftIcon: { width: 34, height: 34, borderRadius: 10, marginRight: 12, justifyContent: 'center', alignItems: 'center' },
    manualTextBlock: { flex: 1, marginRight: 8 },
    confirmRow: { paddingVertical: 16 },
    confirmBtn: { width: '100%', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
    locationMeta: { flexDirection: 'row', alignItems: 'center' },
    locationIcon: { width: 46, height: 46, borderRadius: 12, marginRight: 12 },
    locationTextBlock: { maxWidth: width - 180 },
    addressText: { marginTop: 4 },
    locationActions: { alignItems: 'flex-end' },
    actionBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
    saveRow: { paddingVertical: 12, alignItems: 'center' },
    saveBtn: { width: '100%', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
    textAlignLeft: { textAlign: 'left' },
});

export default SaveFindLocationScreen;
