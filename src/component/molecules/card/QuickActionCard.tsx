import React from 'react';
import { TouchableOpacity, View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { P } from '@components/atoms';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export interface QuickActionCardProps {
  icon: string;
  iconColor: string;
  label: string;
  onPress: () => void;
  style?: ViewStyle;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon,
  iconColor,
  label,
  onPress,
  style,
}) => {
  const theme: any = useTheme();

  const themed = StyleSheet.create({
    card: {
      backgroundColor: theme.background01 ? theme.background01(100) : '#0F1720',
      borderWidth: 1,
      borderColor: theme.background01 ? theme.background01(25) : '#1a2332',
    },
  });

  return (
    <TouchableOpacity style={[styles.card, themed.card, style]} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
        <Icon name={icon} size={32} color={iconColor} />
      </View>
      <P themeToken="text01" themeShade={100} style={styles.label}>
        {label}
      </P>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minHeight: 100,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
