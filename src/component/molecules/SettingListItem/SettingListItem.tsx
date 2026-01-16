import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { H5, P } from '@components/atoms';

type Props = {
    icon?: string;
    iconColor?: string;
    iconBgStyle?: ViewStyle;
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
    borderBottom?: boolean;
    style?: ViewStyle;
};

const SettingListItem: React.FC<Props> = ({
    icon,
    iconColor,
    iconBgStyle,
    title,
    subtitle,
    onPress,
    rightComponent,
    borderBottom = false,
    style,
}) => {
    const theme: any = useTheme();
    const Wrapper: any = onPress ? TouchableOpacity : View;

    const defaultIconBg = { backgroundColor: theme.background02 ? theme.background02(25) : '#071723' };


    return (
        <Wrapper
            onPress={onPress}
            activeOpacity={0.7}
            style={[styles.row, borderBottom && styles.borderBottom, style]}
        >
            {icon ? (<View style={[styles.iconWrap, iconBgStyle || defaultIconBg]}>

                <Icon name={icon} size={20} color={iconColor || (theme.primary01 ? theme.primary01(100) : '#1e90ff')} />
            </View>) : null}


            <View style={styles.titleWrap}>
                <H5 style={styles.textLeft}>{title}</H5>
                {subtitle ? <P style={[styles.smallMt4, styles.textLeft]} themeShade={75}>{subtitle}</P> : null}
            </View>

            {rightComponent ? (
                rightComponent
            ) : (
                <Icon name="chevron-right" size={24} color={theme.light} />
            )}
        </Wrapper>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 12,
    },
    iconWrap: {
        width: 44,
        height: 44,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    titleWrap: { flex: 1 },
    textLeft: { textAlign: 'left' as const },
    smallMt4: { marginTop: 4 },
    borderBottom: { borderBottomWidth: 1, borderBottomColor: 'transparent' },
});

export default SettingListItem;
