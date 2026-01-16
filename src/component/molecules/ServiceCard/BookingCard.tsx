import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import StatusPill from '../../atoms/StatusPill';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { H4, P } from '@components/atoms';

type BookingItem = {
    id: string;
    title: string;
    datetime?: string;
    meta?: string;
    provider?: string;
    rating?: string | number;
    status: 'confirmed' | 'waiting' | 'inprogress' | 'done' | 'searching';
    image?: any;
};

const BookingCard: React.FC<{ item: BookingItem; onPress?: () => void }> = ({ item, onPress }) => {
    const theme: any = useTheme();

    const themed = StyleSheet.create({
        cardStyle: { backgroundColor: theme.background01 ? theme.background01(100) : '#0b1220', borderColor: theme.background01 ? theme.background01(25) : '#0b1220' },

    });

    return (
        <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.card, themed.cardStyle]}>
            <View style={styles.row}>
                <Image source={item.image || require('@assets/images/avatar-placeholder.png')} style={styles.thumb} />
                <View style={styles.content}>
                    <View style={styles.titleRow}>
                        <H4 style={[styles.title]} numberOfLines={2}>{item.title}</H4>
                        <View style={styles.pillWrap}>
                            <StatusPill status={item.status}>{item.status === 'confirmed' ? 'Confirmed' : item.status === 'waiting' ? 'Waiting' : item.status === 'inprogress' ? 'In Progress' : item.status === 'done' ? 'Done' : 'Searching'}</StatusPill>
                        </View>
                    </View>

                    {item.datetime ? (
                        <View style={styles.metaRow}>
                            <P themeToken='text02' themeShade={50} style={[styles.meta]}>{item.datetime}</P>
                        </View>
                    ) : null}

                    {item.provider ? (
                        <View style={styles.providerRow}>
                            <Image source={require('@assets/images/avatar-placeholder.png')} style={styles.providerAvatar} />
                            <P themeToken='text02' themeShade={50} style={[styles.providerText]}>{item.provider}  ⭐ {item.rating}</P>
                        </View>
                    ) : null}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: { borderRadius: 12, padding: 12, borderWidth: 1, marginVertical: 10 },
    row: { flexDirection: 'row', alignItems: 'center' },
    thumb: { width: 64, height: 64, borderRadius: 8, marginRight: 12 },
    content: { flex: 1 },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: 18, fontWeight: '700' },
    pillWrap: { marginLeft: 8 },
    metaRow: { marginTop: 8 },
    meta: { textAlign: 'left', fontSize: 14 },
    providerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    providerAvatar: { width: 28, height: 28, borderRadius: 14, marginRight: 8 },
    providerText: { fontSize: 13 },
});

export default BookingCard;
