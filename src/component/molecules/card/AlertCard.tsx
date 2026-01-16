import React from 'react';
import { TouchableOpacity, View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { H6, P } from '@components/atoms';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export interface AlertCardProps {
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  type,
  title,
  message,
  timestamp,
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

  const getTypeConfig = () => {
    switch (type) {
      case 'warning':
        return { icon: 'alert-circle', color: '#F59E0B' };
      case 'success':
        return { icon: 'check-circle', color: '#10B981' };
      case 'error':
        return { icon: 'close-circle', color: '#EF4444' };
      default:
        return { icon: 'information', color: '#3B82F6' };
    }
  };

  const config = getTypeConfig();

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.card, themed.card, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.iconContainer, { backgroundColor: config.color + '20' }]}>
        <Icon name={config.icon} size={20} color={config.color} />
      </View>
      <View style={styles.content}>
        <H6 themeToken="text01" style={styles.title}>
          {title}
        </H6>
        <P style={styles.message} numberOfLines={2}>
          {message}
        </P>
        <P themeShade={50}>
          {timestamp}
        </P>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,

  },
  iconContainer: {
    width: 22,
    height: 22,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    marginBottom: 4,
  },
  message: {
    marginBottom: 6,
    lineHeight: 18,
  },
});
