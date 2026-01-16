import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { H2, H6, P, ButtonV1 } from '@components/atoms';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthHeader } from '@components/organisms/header';

type InvitationStatus = 'pending' | 'accepted' | 'rejected' | 'expired';

interface InviteMemberStatusScreenProps {
    memberName?: string;
    memberEmail?: string;
    status?: InvitationStatus;
}

const InviteMemberStatusScreen: React.FC<InviteMemberStatusScreenProps> = ({
    memberName = 'Sarah Jones',
    memberEmail = 'sarah.jones@example.com',
    status = 'rejected',
}) => {
    const theme: any = useTheme();
    const { t } = useTranslation();

    // Status configuration
    const getStatusConfig = (statusType: InvitationStatus) => {
        switch (statusType) {
            case 'accepted':
                return {
                    backgroundColor: theme.success ? theme.success(20) : '#D1FAE5',
                    textColor: theme.success ? theme.success(100) : '#10B981',
                    dotColor: '#10B981',
                    label: t('status_accepted'),
                };
            case 'rejected':
                return {
                    backgroundColor: theme.negative ? theme.negative(25) : '#FEE2E2',
                    textColor: theme.negative ? theme.negative(100) : '#EF4444',
                    dotColor: '#EF4444',
                    label: t('status_rejected'),
                };
            case 'expired':
                return {
                    backgroundColor: theme.text02 ? theme.text02(20) : '#F3F4F6',
                    textColor: theme.text02 ? theme.text02(100) : '#6B7280',
                    dotColor: '#6B7280',
                    label: t('status_expired'),
                };
            case 'pending':
            default:
                return {
                    backgroundColor: theme.warning ? theme.warning(20) : '#FEF3C7',
                    textColor: theme.warning ? theme.warning(100) : '#F59E0B',
                    dotColor: '#F59E0B',
                    label: t('pending_acceptance'),
                };
        }
    };

    const statusConfig = getStatusConfig(status);

    const themed = StyleSheet.create({
        container: {
            backgroundColor: theme.background02 ? theme.background02(100) : '#0B1220',
        },
        iconCircle: {
            backgroundColor: theme.background01 ? theme.background01(50) : '#1E2936',
            borderColor: theme.background01 ? theme.background01(100) : '#2D3748',
        },
        statusCard: {
            backgroundColor: theme.background01 ? theme.background01(100) : '#1E2936',
        },
        avatar: {
            backgroundColor: theme.accent01 ? theme.accent01(100) : '#F59E0B',
        },
        returnButton: {
            backgroundColor: theme.primary01 ? theme.primary01(100) : '#3B82F6',
        },
        resendButton: {
            color: theme.primary01 ? theme.primary01(100) : '#3B82F6',
        },
    });

    return (
        <SafeAreaView style={[styles.safe, themed.container]} edges={['top']}>
            <View style={[styles.container, themed.container]}>
                {/* Header */}
                <View style={styles.header}>
                    <AuthHeader
                        title={t('invitation_status')}
                        onBack={() => { }}
                    />
                </View>

                {/* Content */}
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Success Icon */}
                    <View style={[styles.iconCircle, themed.iconCircle]}>
                        <Icon
                            name="email-check"
                            size={80}
                            color={theme.primary01 ? theme.primary01(100) : '#3B82F6'}
                        />
                    </View>

                    {/* Title */}
                    <H2 style={styles.title}>{t('invitation_sent')}</H2>

                    {/* Description */}
                    <P style={styles.description} themeToken="text02" themeShade={75}>
                        {t('invitation_sent_message', { name: memberName })}
                    </P>

                    {/* Status Card */}
                    <View style={[styles.statusCard, themed.statusCard]}>
                        {/* Status Header */}
                        <View style={styles.statusHeader}>
                            <P style={styles.statusLabel} themeToken="text02" themeShade={75}>
                                {t('current_status')}
                            </P>
                            <View
                                style={[
                                    styles.statusBadge,
                                    { backgroundColor: statusConfig.backgroundColor },
                                ]}
                            >
                                <View
                                    style={[
                                        styles.statusDot,
                                        { backgroundColor: statusConfig.dotColor },
                                    ]}
                                />
                                <P
                                    style={[
                                        styles.statusText,
                                        { color: statusConfig.textColor },
                                    ]}
                                >
                                    {statusConfig.label}
                                </P>
                            </View>
                        </View>

                        {/* Member Info */}
                        <View style={styles.memberInfo}>
                            <View style={[styles.avatar, themed.avatar]}>
                                <Icon name="account" size={32} color="#FFFFFF" />
                            </View>
                            <View style={styles.memberDetails}>
                                <H6 style={styles.memberName}>{memberName}</H6>
                                <P style={styles.memberEmail} themeToken="text02" themeShade={75}>
                                    {memberEmail}
                                </P>
                            </View>
                        </View>

                        {/* Timestamp */}
                        <View style={styles.timestamp}>
                            <Icon
                                name="clock-outline"
                                size={16}
                                color={theme.text02 ? theme.text02(75) : '#9CA3AF'}
                            />
                            <P style={styles.timestampText} themeToken="text02" themeShade={75}>
                                {t('sent_just_now')}
                            </P>
                        </View>
                    </View>
                </ScrollView>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    <ButtonV1
                        text={t('return_to_team_management')}
                        onPress={() => { }}
                        containerStyle={[styles.returnButton, themed.returnButton]}
                        testID="return_to_team"
                    />
                    <TouchableOpacity
                        style={styles.resendButton}
                        onPress={() => { }}
                    >
                        <P style={[styles.resendButtonText, themed.resendButton]}>
                            {t('resend_invitation')}
                        </P>
                    </TouchableOpacity>
                </View>
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
        paddingTop: 40,
        paddingBottom: 140,
        alignItems: 'center',
    },
    iconCircle: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
        alignSelf: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    description: {
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    statusCard: {
        width: '100%',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        alignSelf: 'center',
    },
    statusHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    statusLabel: {
        fontSize: 14,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
    },
    memberInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    memberDetails: {
        flex: 1,
    },
    memberName: {
        fontWeight: '600',
        marginBottom: 4,
        textAlign: 'left',
    },
    memberEmail: {
        textAlign: 'left',
    },
    timestamp: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timestampText: {
        fontSize: 14,
        marginLeft: 6,
    },
    buttonContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    returnButton: {
        width: '100%',
        marginBottom: 16,
        alignSelf: 'center',
    },
    resendButton: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    resendButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});

export default InviteMemberStatusScreen;
