import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { H1, H6, P } from '@components/atoms';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export interface RatingCardProps {
    rating: number;
    maxRating?: number;
    totalReviews: number;
    title: string;
    style?: ViewStyle;
}

export const RatingCard: React.FC<RatingCardProps> = ({
    rating,
    maxRating = 5.0,
    totalReviews,
    title,
    style,
}) => {
    const theme: any = useTheme();

    const themed = StyleSheet.create({
        card: {
            backgroundColor: theme.primary01 ? theme.primary01(100) : '#3B82F6',
        },
    });

    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(
                    <Icon key={i} name="star" size={20} color="#FCD34D" />
                );
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <Icon key={i} name="star-half-full" size={20} color="#FCD34D" />
                );
            } else {
                stars.push(
                    <Icon key={i} name="star-outline" size={20} color="#FCD34D" />
                );
            }
        }
        return stars;
    };

    return (
        <View style={[styles.card, themed.card, style]}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <H6 style={styles.title}>{title}</H6>
                </View>
                <View style={styles.iconContainer}>
                    <Icon name="trophy" size={32} color="#FCD34D" />
                </View>
            </View>
            <View style={styles.ratingContainer}>
                <H1 style={styles.rating}>{rating.toFixed(1)}</H1>
                <P style={styles.maxRating}>/ {maxRating.toFixed(1)}</P>
            </View>
            <View style={styles.starsContainer}>
                {renderStars()}
                <P style={styles.reviews}>({totalReviews} Reviews)</P>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontWeight: '600',
        textAlign: 'left',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(252, 211, 77, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 8,
    },
    rating: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    maxRating: {
        fontSize: 20,
        color: '#FFFFFF',
        opacity: 0.8,
        marginLeft: 4,
    },
    starsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reviews: {
        fontSize: 14,
        color: '#FFFFFF',
        marginLeft: 8,
        opacity: 0.9,
    },
});
