import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { H4, P, TextInput, ButtonV1 } from '@components/atoms';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DropDownWithLabel from '@components/atoms/Dropdown/DropDownWithLabel';
import { AuthHeader } from '@components/organisms/header';
import { DropdownItem } from '@components/atoms/Dropdown/Dropdown';
import { useNavigation } from '@react-navigation/native';

const InviteMemberScreen: React.FC = () => {
    const theme: any = useTheme();
    const { t } = useTranslation();
    const [contactInput, setContactInput] = useState('');
    const [selectedRole, setSelectedRole] = useState('1');
    const navigation: any = useNavigation();

    const roleItems: DropdownItem[] = [
        { id: '1', label: t('role_worker') },
        { id: '2', label: t('role_manager') },
        { id: '3', label: t('role_admin') },
    ];

    const roleDescMap: Record<string, { title: string; lines: string[] }> = {
        '1': {
            title: t('role_worker_description'),
            lines: [],
        },
        '2': {
            title: t('role_manager_description'),
            lines: [t('role_manager_description_line2')],
        },
        '3': {
            title: t('role_admin_description'),
            lines: [t('role_admin_description_line2'), t('role_admin_description_line3')],
        },
    };

    const themed = StyleSheet.create({
        container: {
            backgroundColor: theme.background02 ? theme.background02(100) : '#0B1220',
        },

        sendButton: {
            backgroundColor: theme.primary01 ? theme.primary01(100) : '#3B82F6',
        },
    });

    return (
        <SafeAreaView style={[styles.safe, themed.container]}>
            <View style={[styles.container, themed.container]}>
                {/* Header */}
                <View style={styles.header}>
                    <AuthHeader
                        title={t('invite_member')}
                        onBack={() => { }}
                    />
                </View>

                <KeyboardAvoidingView
                    style={styles.keyboardAvoid}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Contact Details Section */}
                        <View style={styles.section}>
                            <H4 style={styles.sectionTitleText}>
                                {t('contact_details')}
                            </H4>
                            <TextInput
                                placeholder={t('enter_email_or_phone')}
                                value={contactInput}
                                onChangeText={setContactInput}
                                width="100%"
                                height={56}
                                borderRadius={12}
                                paddingHorizontal={16}
                                containerStyle={styles.inputContainer}
                                rightIcon={
                                    <TouchableOpacity style={styles.iconButton}>
                                        <Icon
                                            name="contacts"
                                            size={24}
                                            color={theme.text02 ? theme.text02(50) : '#9CA3AF'}
                                        />
                                    </TouchableOpacity>
                                }
                            />
                        </View>

                        {/* Access Level Section */}
                        <View style={styles.section}>
                            <H4 style={styles.sectionTitleText}>
                                {t('access_level')}
                            </H4>

                            <DropDownWithLabel
                                label={t('assign_role')}
                                items={roleItems}
                                value={selectedRole}
                                onChange={(item) => setSelectedRole(item.id as string)}
                                containerStyle={styles.dropdownContainer}
                            />

                            {/* Role Information Box */}
                            <View style={styles.infoBox}>
                                <View style={styles.infoHeader}>
                                    <Icon
                                        name="information"
                                        size={20}
                                        color={theme.primary01 ? theme.primary01(100) : '#3B82F6'}
                                    />
                                    <P style={[styles.infoBoxText, styles.marginLeft8]}>
                                        {roleDescMap[selectedRole].title}
                                    </P>
                                </View>

                                {roleDescMap[selectedRole].lines.map((line, index) => (
                                    <P
                                        key={index}
                                        style={[styles.infoBoxText, styles.marginTop8]}
                                    >
                                        {line}
                                    </P>
                                ))}
                            </View>
                        </View>

                        {/* Bottom Information */}
                        <View style={styles.bottomInfo}>
                            <P
                                style={styles.bottomInfoText}
                                themeToken="text02"
                                themeShade={75}
                            >
                                {t('invitation_info')}
                            </P>
                        </View>
                        {/* Send Button */}
                        <View style={styles.buttonContainer}>
                            <ButtonV1
                                text={t('send_invitation')}
                                onPress={() => { navigation.navigate('InviteMemberStatusScreen'); }}
                                containerStyle={[styles.sendButton, themed.sendButton]}
                                testID="send_invitation"
                            />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
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
    keyboardAvoid: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 120,
    },
    header: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitleText: {
        marginBottom: 16,
        fontWeight: '600',
        textAlign: 'left',
    },
    inputContainer: {
        width: '100%',
    },
    iconButton: {
        padding: 8,
    },
    roleLabel: {
        marginBottom: 12,
    },
    dropdownContainer: {
        marginBottom: 16,
    },
    infoBox: {
        borderRadius: 12,
        padding: 16,
        marginTop: 12,
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    infoBoxText: {
        lineHeight: 20,
        textAlign: 'left',
    },
    marginLeft8: {
        marginLeft: 8,
        flex: 1,
    },
    marginTop8: {
        marginTop: 8,
    },
    bottomInfo: {
        marginVertical: 24,
        paddingHorizontal: 8,
    },
    bottomInfoText: {
        textAlign: 'center',
        lineHeight: 20,
    },
    buttonContainer: {
        // position: 'absolute',
        // bottom: 0,
        // left: 0,
        // right: 0,
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'transparent',
    },
    sendButton: {
        width: '100%',
        alignSelf: 'center',
    },
});

export default InviteMemberScreen;
