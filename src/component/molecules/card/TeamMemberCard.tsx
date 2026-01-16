import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { H5, P } from '@components/atoms';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export interface TeamMemberCardProps {
    id: string;
    name: string;
    role: string;
    avatar?: any;
    avatarText?: string;
    status: 'online' | 'busy' | 'offline';
    onPress?: () => void;
    onMenuPress?: () => void;
    style?: ViewStyle;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
    name,
    role,
    avatar,
    avatarText,
    status,
    onPress,
    onMenuPress,
    style,
}) => {
    const theme: any = useTheme();

    const themed = StyleSheet.create({
        card: {
            backgroundColor: theme.background01 ? theme.background01(100) : '#1E2936',
        },
    });

    const getStatusColor = () => {
        switch (status) {
            case 'online':
                return '#10B981';
            case 'busy':
                return '#F59E0B';
            default:
                return '#6B7280';
        }
    };

    const getAvatarBg = () => {
        const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'];
        const index = (avatarText?.charCodeAt(0) || 0) % colors.length;
        return colors[index];
    };

    const Container = onPress ? TouchableOpacity : View;

    return (
        <Container
            style={[styles.card, themed.card, style]}
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
        >
            <View style={styles.content}>
                <View style={styles.avatarContainer}>
                    {avatar ? (
                        <Image source={avatar} style={styles.avatar} />
                    ) : (
                        <View style={[styles.avatarPlaceholder, { backgroundColor: getAvatarBg() }]}>
                            <P style={styles.avatarText}>{avatarText}</P>
                        </View>
                    )}
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
                </View>
                <View>
                    <H5 themeToken="text01" style={styles.name}>
                        {name}
                    </H5>
                    <P themeShade={75}>
                        {role}
                    </P>
                </View>
            </View>
            <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
                <Icon
                    name="dots-vertical"
                    size={24}
                    color={theme.light ? theme.light : '#9CA3AF'}
                />
            </TouchableOpacity>
        </Container>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 12,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    avatarPlaceholder: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    statusDot: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 2,
        borderColor: '#1E2936',
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    menuButton: {
        padding: 8,
    },
});
