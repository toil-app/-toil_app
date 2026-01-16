import React, { useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    FlatList,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { ButtonV1, H5, } from '@components/atoms';
import { TeamStatCard } from '@components/molecules/card/TeamStatCard';
import { TeamMemberCard } from '@components/molecules/card/TeamMemberCard';
import { SearchTextInput } from '@components/atoms/TextInput/SearchTextInput';
import { AuthHeader } from '@components/organisms/header';
import { useNavigation } from '@react-navigation/native';

const TeamScreen: React.FC = () => {
    const theme: any = useTheme();
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const insets = useSafeAreaInsets();
    const navigation: any = useNavigation();

    const teamMembers = [
        {
            id: '1',
            name: 'Sarah Jenkins',
            role: 'Senior Technician',
            avatar: require('@assets/images/avatar-placeholder.png'),
            status: 'online' as const,
        },
        {
            id: '2',
            name: 'Mike Ross',
            role: 'Junior Associate',
            avatar: require('@assets/images/avatar-placeholder.png'),
            status: 'online' as const,
        },
        {
            id: '3',
            name: 'David Kim',
            role: 'Trainee',
            avatar: require('@assets/images/avatar-placeholder.png'),
            status: 'offline' as const,
        },
        {
            id: '4',
            name: 'Amanda Lee',
            role: 'Project Manager',
            avatarText: 'AL',
            status: 'busy' as const,
        },
        {
            id: '5',
            name: 'Marcus Johnson',
            role: 'Field Expert',
            avatar: require('@assets/images/avatar-placeholder.png'),
            status: 'offline' as const,
        },
        {
            id: '6',
            name: 'Elena K.',
            role: 'Support Staff',
            avatarText: 'EK',
            status: 'online' as const,
        },
    ];

    const filteredMembers = teamMembers.filter(
        (member) =>
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeCount = teamMembers.filter((m) => m.status === 'online').length;

    const themed = StyleSheet.create({
        container: {
            backgroundColor: theme.background02 ? theme.background02(100) : '#0B1220',
        },
        addButton: {
            backgroundColor: theme.primary01 ? theme.primary01(100) : '#3B82F6',
        },
    });

    const renderMemberSeparator = () => <View style={styles.memberSeparator} />;

    return (
        <SafeAreaView style={[styles.safe, themed.container]} edges={['top']}>
            <View style={[styles.container, themed.container]}>
                {/* Header */}
                <View style={styles.header}>
                    <AuthHeader
                        title={t('my_team')}
                        onBack={() => { }}
                    />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Stats Cards */}
                    <View style={styles.statsContainer}>
                        <TeamStatCard
                            icon="account-group"
                            iconColor="#3B82F6"
                            label={t('total_members')}
                            value={teamMembers.length}
                            style={styles.statCard}
                        />
                        <TeamStatCard
                            icon="circle"
                            iconColor="#10B981"
                            label={t('active_members_now')}
                            value={activeCount}
                            style={styles.statCard}
                        />
                    </View>

                    {/* Search Bar */}
                    <View style={styles.searchContainer}>
                        <SearchTextInput
                            placeholder={t('search_by_name_or_role')}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            containerStyle={styles.searchBar}
                        />
                        {/* <TouchableOpacity style={styles.filterButton}>
                            <Icon
                                name="filter-variant"
                                size={24}
                                color={theme.text01 ? theme.text01(100) : '#FFFFFF'}
                            />
                        </TouchableOpacity> */}
                    </View>

                    {/* Members List */}
                    <View style={styles.membersSection}>
                        <H5 themeToken="text02" themeShade={75} style={styles.sectionLabel}>
                            {t('members_list')}
                        </H5>
                        <FlatList
                            data={filteredMembers}
                            scrollEnabled={false}
                            keyExtractor={(item) => item.id}
                            ItemSeparatorComponent={renderMemberSeparator}
                            renderItem={({ item }) => (
                                <TeamMemberCard
                                    id={item.id}
                                    name={item.name}
                                    role={item.role}
                                    avatar={item.avatar}
                                    avatarText={item.avatarText}
                                    status={item.status}
                                    onPress={() => {
                                        navigation.navigate('EditTeamMemberScreen', { memberId: item.id });
                                    }}
                                    onMenuPress={() => {
                                        navigation.navigate('MemberScheduleScreen', { memberId: item.id });
                                    }}
                                />
                            )}
                        />
                    </View>
                    <View style={[styles.bottomContainer, { paddingBottom: insets.bottom }]}>
                        <ButtonV1
                            containerStyle={styles.addButton}
                            onPress={() => { navigation.navigate('InviteMemberScreen'); }}
                            text={t('add_new_member')}
                            testID='add_new_member' />
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingBottom: 140,
        paddingHorizontal: 20,
    },
    header: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    headerSpacer: {
        width: 40,
    },
    statsContainer: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    statCard: {
        marginRight: 12,
    },
    searchContainer: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    searchBar: {
        flex: 1,
        marginRight: 12,
    },
    filterButton: {
        width: 52,
        height: 52,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2D3748',
    },

    sectionLabel: {
        fontWeight: '600',
        letterSpacing: 1,
        marginBottom: 16,
        textTransform: 'uppercase',
        textAlign: 'left',
    },
    memberSeparator: {
        height: 0,
    },
    membersSection: {
        // marginBottom: 20,
    },
    bottomContainer: {
        marginBottom: 20,
        // paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'transparent',
    },
    addButton: {
        width: '100%',
        alignSelf: 'center',
    },
    addButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        marginLeft: 8,
    },
});

export default TeamScreen;
