import React from 'react';
import { TouchableOpacity, View, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { SearchTextInput } from '../TextInput/SearchTextInput';

interface FakeButtonSearchInputProps {
    placeholder?: string;
    iconNode?: React.ReactNode;
    onPressWhenDisabled?: () => void;
    containerStyle?: StyleProp<ViewStyle>;
    testID?: string;
    width?: number;
    height?: number;
    value?: string;
}

export const FakeButtonSearchInput: React.FC<FakeButtonSearchInputProps> = ({
    placeholder,
    iconNode,
    onPressWhenDisabled,
    containerStyle,
    testID,
    width,
    height,
    value,
}) => {
    const theme = useTheme();
    const background = theme.background02 ? theme.background02(100) : '#F3F6F8';
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPressWhenDisabled}
            style={[
                {
                    width: width ?? '100%',
                    height: height ?? 48,
                    borderRadius: 12,
                    backgroundColor: background,
                    borderWidth: 0,
                    flexDirection: 'row',
                    alignItems: 'center',
                    // paddingHorizontal: 12,
                } as StyleProp<ViewStyle>,
                containerStyle,
            ]}
            {...(testID ? { testID } : {})}
        >
            {iconNode}
            <View style={{ flex: 1, marginLeft: 8 }}>
                <SearchTextInput
                    value={value}
                    editable={false}
                    pointerEvents="none"
                    placeholder={placeholder}
                    leftIcon={null}
                    clearable={false}
                    containerStyle={{ backgroundColor: 'transparent', borderWidth: 0, padding: 0, margin: 0 }}
                    inputStyle={{ color: theme.text01 ? theme.text01(50) : '#888', fontSize: 16, paddingVertical: 0, backgroundColor: 'transparent' }}
                />
            </View>
        </TouchableOpacity>
    );
};