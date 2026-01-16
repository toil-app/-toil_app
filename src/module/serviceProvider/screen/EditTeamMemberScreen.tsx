import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import {
    H2, H5, P,
    // ButtonV1,
    TextArea, H6
} from '@components/atoms';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DropDownWithLabel from '@components/atoms/Dropdown/DropDownWithLabel';
import { AuthHeader } from '@components/organisms/header';
import { DropdownItem } from '@components/atoms/Dropdown/Dropdown';
import TextInputLable from '@components/atoms/label/TextInputLable';

interface EditTeamMemberScreenProps {
    memberId?: string;
    memberName?: string;
    memberRole?: string;
    memberEmail?: string;
    memberPhone?: string;
    joinDate?: string;
    memberAvatar?: any;
}

const EditTeamMemberScreen: React.FC<EditTeamMemberScreenProps> = ({
    // memberId = '1',
    memberName = 'Sarah Jenkins',
    memberRole = '1',
    memberEmail = 'sarah.jenkins@example.com',
    memberPhone = '+1 (555) 123-4567',
    joinDate = 'Oct 2023',
    memberAvatar = require('@assets/images/avatar-placeholder.png'),
}) => {
    const theme: any = useTheme();
    const { t } = useTranslation();
    const [selectedRole, setSelectedRole] = useState(memberRole);
    const [internalNotes, setInternalNotes] = useState('');
    const [_hasChanges, setHasChanges] = useState(false);

    const roleItems: DropdownItem[] = [
        { id: '1', label: t('role_worker') },
        { id: '2', label: t('role_manager') },
        { id: '3', label: t('role_admin') },
    ];

    const handleRoleChange = (item: DropdownItem) => {
        setSelectedRole(item.id as string);
        setHasChanges(true);
    };

    const handleNotesChange = (text: string) => {
        setInternalNotes(text);
        setHasChanges(true);
    };

    const handleDeleteMember = () => {
        Alert.alert(
            t('delete_member'),
            t('delete_member_confirmation'),
            [
                { text: t('cancel'), onPress: () => { }, style: 'cancel' },
                {
                    text: t('delete'),
                    onPress: () => { },
                    style: 'destructive',
                },
            ]
        );
    };

    // const handleSaveChanges = () => {
    //     Alert.alert(t('success'), t('member_updated_successfully'));
    //     setHasChanges(false);
    // };

    const themed = StyleSheet.create({
        container: {
            backgroundColor: theme.background02 ? theme.background02(100) : '#0B1220',
        },
        avatarCircle: {
            backgroundColor: theme.background01 ? theme.background01(75) : '#1E2936',
        },
        cameraButton: {
            backgroundColor: theme.primary01 ? theme.primary01(100) : '#3B82F6',
        },
        rolesDropdown: {
            backgroundColor: theme.background01 ? theme.background01(100) : '#1E2936',
        },
        infoField: {
            backgroundColor: theme.background01 ? theme.background01(100) : '#1E2936',
        },
        notesField: {
            backgroundColor: theme.background01 ? theme.background01(100) : '#1E2936',
        },
        dangerZone: {
            backgroundColor: theme.negative ? theme.negative(50) : '#7F1D1D',
            borderColor: theme.negative ? theme.negative(75) : '#B91C1C',
        },
        deleteButton: {
            borderColor: theme.negative ? theme.negative(100) : '#EF4444',
        },
        deleteButtonText: {
            color: theme.negative ? theme.negative(100) : '#EF4444',
        },
        cancelButton: {
            backgroundColor: theme.background01 ? theme.background01(100) : '#2D3748',
        },
        saveButton: {
            backgroundColor: theme.primary01 ? theme.primary01(100) : '#3B82F6',
        },
    });

    return (
        <SafeAreaView style={[styles.safe, themed.container]} >
            <View style={[styles.container, themed.container]}>
                {/* Header */}
                <View style={styles.header}>
                    <AuthHeader
                        title={t('edit_team_member')}
                        onBack={() => { }}
                    />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Avatar Section */}
                    <View style={styles.avatarSection}>
                        <View style={[styles.avatarCircle, themed.avatarCircle]}>
                            <Image
                                source={memberAvatar}
                                style={styles.avatar}
                            />
                            {/* <TouchableOpacity
                                style={[styles.cameraButton, themed.cameraButton]}
                            >
                                <Icon name="camera" size={20} color="#FFFFFF" />
                            </TouchableOpacity> */}
                        </View>

                        {/* Member Info */}
                        <H2 style={styles.memberName}>{memberName}</H2>
                        <H6 style={styles.memberSubtitle} themeToken="text02" themeShade={75}>
                            {selectedRole === '1' ? t('role_worker') : selectedRole === '2' ? t('role_manager') : t('role_admin')} • {t('joined')} {joinDate}
                        </H6>
                    </View>

                    {/* Role Section */}
                    <View style={styles.section}>
                        <DropDownWithLabel
                            items={roleItems}
                            value={selectedRole}
                            onChange={handleRoleChange}
                            containerStyle={styles.dropdownContainer}
                            disabled={true}
                            label={t('role')}
                        />
                    </View>

                    {/* Contact Email Section */}
                    <View style={styles.section}>
                        <TextInputLable label={t('contact_email')} />
                        <View style={[styles.infoField, themed.infoField]}>
                            <Icon
                                name="email"
                                size={20}
                                color={theme.text02 ? theme.text02(75) : '#9CA3AF'}
                                style={styles.fieldIcon}
                            />
                            <P style={styles.infoFieldText}>{memberEmail}</P>
                        </View>
                    </View>

                    {/* Phone Number Section */}
                    <View style={styles.section}>
                        <TextInputLable label={t('phone_number')} />
                        <View style={[styles.infoField, themed.infoField]}>
                            <Icon
                                name="phone"
                                size={20}
                                color={theme.text02 ? theme.text02(75) : '#9CA3AF'}
                                style={styles.fieldIcon}
                            />
                            <P style={styles.infoFieldText}>{memberPhone}</P>
                        </View>
                    </View>

                    {/* Internal Notes Section */}
                    <View style={styles.section}>
                        <TextInputLable label={t('internal_notes')}
                            optionalLabel={t('optional')}
                            optional={true}
                        />
                        <TextArea
                            placeholder={t('add_private_notes')}
                            value={internalNotes}
                            onChangeText={handleNotesChange}
                            rows={5}
                            width="100%"
                            containerStyle={styles.textAreaContainer}
                            inputStyle={[styles.textAreaInput, themed.notesField]}
                        />
                    </View>

                    {/* Danger Zone */}
                    <View style={[styles.dangerZone, themed.dangerZone]}>
                        <H5 style={styles.dangerZoneTitle}>{t('danger_zone')}</H5>
                        <P style={styles.dangerZoneText} themeToken="text02" themeShade={75}>
                            {t('delete_member_warning')}
                        </P>
                        <TouchableOpacity
                            style={[styles.deleteButton, themed.deleteButton]}
                            onPress={handleDeleteMember}
                        >
                            <Icon
                                name="trash-can-outline"
                                size={20}
                                color={theme.negative ? theme.negative(100) : '#EF4444'}
                            />
                            <P style={[styles.deleteButtonText, themed.deleteButtonText]}>
                                {t('delete_member')}
                            </P>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {/* Bottom Buttons */}
                {/* <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.cancelButton, themed.cancelButton]}
                        onPress={() => { }}
                    >
                        <P style={styles.cancelButtonText}>{t('cancel')}</P>
                    </TouchableOpacity>
                    <ButtonV1
                        text={t('save_changes')}
                        onPress={handleSaveChanges}
                        containerStyle={[styles.saveButton, themed.saveButton]}
                        testID="save_changes"
                    />
                </View> */}
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
    header: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 140,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        position: 'relative',
    },
    avatar: {
        width: 140,
        height: 140,
        borderRadius: 70,
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#0B1220',
    },
    memberName: {
        fontWeight: 'bold',
        marginBottom: 6,
        textAlign: 'center',
    },
    memberSubtitle: {
        textAlign: 'center',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {

        fontWeight: '600',
        marginBottom: 12,
        textAlign: 'left',
    },
    optional: {
        fontWeight: '400',
    },
    dropdownContainer: {
        width: '100%',
    },
    infoField: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        height: 56,
    },
    fieldIcon: {
        marginRight: 12,
    },
    infoFieldText: {
        flex: 1,
        // fontSize: 16,
        textAlign: 'left',
    },
    textAreaContainer: {
        width: '100%',
    },
    textAreaInput: {
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    dangerZone: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 20,
        marginBottom: 24,
    },
    dangerZoneTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    dangerZoneText: {
        lineHeight: 20,
        marginBottom: 16,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        borderWidth: 1.5,
        paddingVertical: 12,
    },
    deleteButtonText: {
        fontWeight: '600',
        marginLeft: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 12,
    },
    cancelButton: {
        flex: 0.4,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    saveButton: {
        flex: 0.6,
    },
});

export default EditTeamMemberScreen;
