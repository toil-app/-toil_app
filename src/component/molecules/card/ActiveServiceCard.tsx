import React from 'react';
import { View, Image, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { H5, P } from '@components/atoms';
import { Switch } from '@components/atoms/Switch/Switch';

export interface ActiveServiceCardProps {
  image: any;
  title: string;
  price: string;
  bookings: number;
  isActive: boolean;
  onToggle: (value: boolean) => void;
  style?: ViewStyle;
}

export const ActiveServiceCard: React.FC<ActiveServiceCardProps> = ({
  image,
  title,
  price,
  bookings,
  isActive,
  onToggle,
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
    <View style={[styles.card, themed.card, style]}>
      <Image source={image} style={styles.image} />
      <View style={styles.content}>
        <H5 themeToken="text01" style={styles.title}>
          {title}
        </H5>
        <P>
          {price} • {bookings} Bookings
        </P>
      </View>
      <Switch value={isActive} onChange={onToggle} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    marginBottom: 4,
  },

});
