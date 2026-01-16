import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { H4, H5, P } from '@components/atoms/Typhography/variants';
import { SearchTextInput } from '@components/atoms/TextInput/SearchTextInput';
import { relativeWidth, relativeHeight } from '@core/util/Theme/layout';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IIcon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import { Categery } from '@core/models/Categery';
import { Asset_V3 } from '@components/atoms';
import _ from 'lodash';

const { width } = Dimensions.get('window');

// const categories = [
//     { id: 'cleaning', title: 'Cleaning', icon: null },
//     { id: 'repairs', title: 'Repairs', icon: null },
//     { id: 'plumbing', title: 'Plumbing', icon: null },
//     { id: 'moving', title: 'Moving', icon: null },
//     { id: 'painting', title: 'Painting', icon: null },
//     { id: 'beauty', title: 'Beauty', icon: null },
// ];

const providers = [
    { id: 'p1', name: 'Sparkle Cleaners', service: 'Home Cleaning', distance: '2.5km', rating: 4.9, image: null },
    { id: 'p2', name: "Joe's Plumbing", service: 'Plumbing', distance: '1.2km', rating: 4.7, image: null },
];

// Static separator component (no inline definition in render)
const Separator = () => <View style={baseStyles.separator} />;

type UserDashboardScreenProps = {
    categeries: Array<Categery>;
};

const UserDashboardScreen: React.FC<UserDashboardScreenProps> = ({ categeries }) => {
    const theme: any = useTheme();
    const { t } = useTranslation();
    const navigation: any = useNavigation(); // Placeholder for navigation prop
    const [serviceCategories, setServiceCategories] = React.useState<Categery[]>([]);
    const [searchText, setSearchText] = React.useState('');

    // Filtered categories based on search
    const filteredCategories = React.useMemo(() => {
        if (!searchText) return serviceCategories;
        return serviceCategories.filter((cat) =>
            cat.name.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [serviceCategories, searchText]);

    // Theme-aware styles created once per render
    const themedStyles = StyleSheet.create({
        container: { backgroundColor: theme.background02 ? theme.background02(100) : '#071018' },
        categoryCard: { backgroundColor: theme.background01 ? theme.background01(100) : '#0F1720' },
        providerCard: { backgroundColor: theme.background01 ? theme.background01(100) : '#0B1220' },
        bookBtn: { backgroundColor: theme.primary01 ? theme.primary01(100) : '#1E90FF' },
        bookBtnText: { color: '#fff' },
        promoCard: { backgroundColor: theme.primaryGradientStart ? theme.primaryGradientStart(100) : '#5B9BFF' },
        promoText: { color: '#fff', marginBottom: 8 },
        promoTitle: { color: '#fff', marginBottom: 8 },
        listContent: { paddingTop: 12 },
    });

    const onSelectLocation = () => {
        // Handle location selection
        navigation.navigate('SaveFindLocationScreen');
    }

    useEffect(() => {
        setServiceCategories(categeries);
    }, [categeries]);

    return (
        <SafeAreaView style={[styles.container, themedStyles.container]}>
            <ScrollView style={[styles.container, themedStyles.container]} contentContainerStyle={styles.content}>
                <View style={styles.headerRow}>
                    <TouchableOpacity
                        onPress={onSelectLocation}
                        style={[styles.bellPlaceholder, { backgroundColor: theme.background01 ? theme.background01(100) : '#0B1220' }]}>
                        <IIcon name="location" size={24} color={theme.text01 ? (typeof theme.text01 === 'function' ? theme.text01(100) : theme.text01) : '#fff'} />
                    </TouchableOpacity>
                    <View style={styles.locationBlock}>
                        <P themeToken="text02">Current Location</P>
                        <H5 themeToken="text01" style={styles.locationText}>123 Main St, New York</H5>
                    </View>
                    <TouchableOpacity style={[styles.bellPlaceholder, { backgroundColor: theme.background01 ? theme.background01(100) : '#0B1220' }]} >
                        <Icon name="bell" size={24} color={theme.text01 ? (typeof theme.text01 === 'function' ? theme.text01(100) : theme.text01) : '#fff'} />
                    </TouchableOpacity>
                </View>

                <View style={styles.topRow}>
                    <SearchTextInput
                        placeholder={t('search_placeholder') || 'Search for plumbers, cleaners...'}
                        width={relativeWidth(340)}
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>

                <View style={styles.section}>
                    <H4 themeToken="text01">{t('what_service_need') || 'What service do you need today?'}</H4>
                    <P themeToken="text02" style={styles.serviceSelection}>{t('service_selection') || ''}</P>
                </View>

                <View style={[styles.section, styles.sectionNoPadding]}>
                    <View style={styles.sectionHeader}>
                        <H5 themeToken="text01" style={styles.sectionTitle}>{t('categories') || 'Categories'}</H5>
                        <TouchableOpacity>
                            <H5 themeToken="text02">{t('view_all') || 'View All'}</H5>
                        </TouchableOpacity>
                    </View>

                    <View style={themedStyles.listContent}>
                        <View style={[styles.categoryGrid, styles.categoryRow]}>
                            {_.map(
                                _.filter(filteredCategories, (category) => category.isActive),
                                (item: Categery, index: number) => {
                                    if (index >= 6) return null; // Limit to first 6 categories
                                    return (
                                        <TouchableOpacity
                                            key={item.categoryId}
                                            onPress={() => navigation.navigate('MakeABookingScreen', { category: item })}
                                        >
                                            <Asset_V3
                                                imageStyle={styles.categeryStyle}
                                                style={[styles.categoryCard, themedStyles.categoryCard]}
                                                source={{ uri: item.imageUrl }} >
                                                <View style={styles.categoryIconPlaceholder} >
                                                    <View style={styles.categeryBottom}>
                                                        <P numberOfLines={2} color='#ffffff' style={styles.categoryTitle} themeToken="text01">{item.name}</P>
                                                    </View>
                                                </View>
                                            </Asset_V3>
                                        </TouchableOpacity>
                                    )
                                }
                            )}
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <H5 themeToken="text01" style={styles.sectionTitle}>{t('top_service_providers') || 'Top Service Providers'}</H5>
                        <TouchableOpacity>
                            <H5 themeToken="text02">{t('view_all') || 'View All'}</H5>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={providers}
                        keyExtractor={(i) => i.id}
                        horizontal
                        ItemSeparatorComponent={Separator}
                        renderItem={({ item }) => {
                            console.log('Rendering provider item:', item);
                            return (
                                <View style={[styles.providerCard, themedStyles.providerCard]}>
                                    <View style={styles.providerImageWrap}>
                                        <View style={styles.providerImagePlaceholder} />
                                        <View style={styles.ratingBadge}><P themeToken="text01">{item.rating}</P></View>
                                    </View>
                                    <View style={styles.providerBody}>
                                        <H4 themeToken="text01" style={styles.providerName}>{item.name}</H4>
                                        <P
                                            style={{ fontSize: 16, textAlign: 'left' }}
                                            themeShade={50} themeToken="text02">{item.service} • {item.distance} away</P>
                                        <TouchableOpacity style={[styles.bookBtn, themedStyles.bookBtn]}>
                                            <P themeToken="text01" style={themedStyles.bookBtnText}>{t('book_now') || 'Book Now'}</P>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        }}
                        contentContainerStyle={themedStyles.listContent}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>

                <View style={[styles.promoCard, themedStyles.promoCard]}>
                    <H4 themeToken="text01" style={themedStyles.promoText}>{t('special_offer') || 'SPECIAL OFFER'}</H4>
                    <H5 themeToken="text01" style={themedStyles.promoTitle}>{t('first_cleaning_offer') || 'Get 20% off your first home cleaning!'}</H5>
                    <TouchableOpacity style={styles.claimBtn}>
                        <H5 themeToken="text01">{t('claim_offer') || 'Claim Offer'}</H5>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: relativeWidth(16), paddingBottom: 40 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    locationBlock: { flex: 1 },
    locationText: { marginTop: 4 },
    bellPlaceholder: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    topRow: { marginTop: relativeHeight(12), marginBottom: 16, alignItems: 'center' },
    section: { marginBottom: 12 },
    sectionNoPadding: { paddingBottom: 0 },
    serviceSelection: { marginTop: 8, textAlign: 'left' },
    sectionTitle: { fontWeight: '700' },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    categoryRow: { justifyContent: 'space-between', marginBottom: 12 },
    categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    categoryCard: { width: (width - relativeWidth(16) * 2 - 24) / 3, height: 120, borderRadius: 12, alignItems: 'center', justifyContent: 'flex-end', marginBottom: 12, overflow: 'hidden' },
    categoryIconPlaceholder: { width: (width - relativeWidth(16) * 2 - 24) / 3, height: 120, borderRadius: 12, justifyContent: 'flex-end', alignItems: 'center' },
    categoryTitle: { marginTop: 8 },
    providerCard: { width: width * 0.78, borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center' },
    providerImageWrap: { width: 120, height: 80, borderRadius: 8, overflow: 'hidden', marginRight: 12 },
    providerImagePlaceholder: { flex: 1, borderRadius: 8 },
    ratingBadge: { position: 'absolute', top: 6, right: 6, backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    providerBody: { flex: 1, marginLeft: 12 },
    providerName: { marginBottom: 4, textAlign: 'left' },
    bookBtn: { marginTop: 8, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, alignSelf: 'flex-start' },
    promoCard: { marginTop: 16, borderRadius: 12, padding: 16 },
    claimBtn: { marginTop: 8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, alignSelf: 'flex-start' },
    categeryStyle: { borderRadius: 12, resizeMode: 'cover' },
    categeryBottom: { height: relativeWidth(40), width: '100%', backgroundColor: 'rgba(0,0,0,0.8)' }
});

const baseStyles = StyleSheet.create({
    separator: { width: 12 },
});

export default connect(
    (state: any) => ({
        categeries: state.user.get('categeries'),
    }),
    {
    }
)(UserDashboardScreen);
