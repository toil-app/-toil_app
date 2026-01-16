import React from 'react';
import { View, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { H4 } from '@components/atoms/Typhography/variants';
import { useNavigation } from '@react-navigation/native';

type Props = {
    title?: string;
    titleComponent?: React.ReactNode;
    onBack?: () => void;
    leftIconName?: string;
    containerStyle?: StyleProp<ViewStyle>;
    leftContainerStyle?: StyleProp<ViewStyle>;
    centerContainerStyle?: StyleProp<ViewStyle>;
    rightContainerStyle?: StyleProp<ViewStyle>;
    rightIconName?: string;
    onRightPress?: () => void;
    rightComponent?: React.ReactNode;
};

const HeaderCard: React.FC<Props> = ({
    title,
    titleComponent,
    onBack,
    leftIconName = 'arrow-back',
    containerStyle,
    leftContainerStyle,
    centerContainerStyle,
    rightContainerStyle,
    rightIconName,
    onRightPress,
    rightComponent,
}) => {
    const theme: any = useTheme();
    const navigation: any = useNavigation();
    const textPrimary = typeof theme.text01 === 'function' ? theme.text01(100) : (theme.text01 || '#000');

    const onPress = () => {
        navigation.pop();
        if (onBack) {
            onBack();
        }
    };

    return (
        <View style={[styles.container, containerStyle]}>
            <View style={[styles.left, leftContainerStyle]}>
                {onBack ? (
                    <TouchableOpacity onPress={onPress} style={styles.backBtn} activeOpacity={0.7}>
                        <Icon name={leftIconName} size={22} color={textPrimary} />
                    </TouchableOpacity>
                ) : null}
            </View>

            <View style={[styles.center, centerContainerStyle]}>
                {titleComponent ? (
                    titleComponent
                ) : (
                    <H4 themeToken="text01" style={styles.title}>{title}</H4>
                )}
            </View>

            <View style={[styles.right, rightContainerStyle]}>
                {rightComponent ? (
                    rightComponent
                ) : rightIconName && onRightPress ? (
                    <TouchableOpacity onPress={onRightPress} style={styles.rightBtn} activeOpacity={0.7}>
                        <Icon name={rightIconName} size={22} color={textPrimary} />
                    </TouchableOpacity>
                ) : null}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
    left: { width: 60, alignItems: 'flex-start', justifyContent: 'center' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    title: { textAlign: 'center', lineHeight: 24, fontWeight: '700' },
    right: { width: 60, alignItems: 'flex-end', justifyContent: 'center' },
    backBtn: { padding: 8, marginRight: 8 },
    rightBtn: { padding: 8, marginLeft: 8 },
});

export default HeaderCard;