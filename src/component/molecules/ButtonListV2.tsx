import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ListRenderItem,
} from 'react-native';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { P } from '@components/atoms';

export interface TabItem {
    key: string;
    label: string;
    count?: number;
}

interface ButtonListV2Props {
    tabs: TabItem[];
    selectedTab: string;
    onTabSelect: (tabKey: string) => void;
    horizontal?: boolean;
    showBadge?: boolean;
    containerStyle?: any;
    gap?: number;
    paddingHorizontal?: number;
    paddingVertical?: number;
}

const ButtonListV2: React.FC<ButtonListV2Props> = ({
    tabs,
    selectedTab,
    onTabSelect,
    horizontal = true,
    showBadge = true,
    containerStyle,
    gap = 12,
    paddingHorizontal = 20,
    paddingVertical = 0,
}) => {
    const theme: any = useTheme();

    const themed = StyleSheet.create({
        tabInactive: {
            backgroundColor: theme.background01 ? theme.background01(60) : '#2D3748',
        },
        tabActive: {
            backgroundColor: theme.primary01 ? theme.primary01(100) : '#3B82F6',
        },
    });

    const renderTabItem: ListRenderItem<TabItem> = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.tab,
                selectedTab === item.key ? themed.tabActive : themed.tabInactive,
            ]}
            onPress={() => onTabSelect(item.key)}
            activeOpacity={0.7}
        >
            <P
                themeToken={selectedTab === item.key ? undefined : 'text01'}
                themeShade={selectedTab === item.key ? undefined : 75}
                style={[
                    styles.tabText,
                    selectedTab === item.key && styles.tabTextActive,
                ]}
            >
                {item.label}
            </P>
            {showBadge && item.count !== undefined && item.count > 0 && (
                <View style={styles.tabBadge}>
                    <P size={12} style={styles.tabBadgeText}>
                        {String(item.count)}
                    </P>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <View
            style={[
                styles.container,
                {
                    paddingHorizontal,
                    paddingVertical,
                    marginBottom: 24,
                },
                containerStyle,
            ]}
        >
            <FlatList
                data={tabs}
                renderItem={renderTabItem}
                keyExtractor={(item) => item.key}
                horizontal={horizontal}
                scrollEnabled={horizontal}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    gap,
                }}
                scrollEventThrottle={16}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 24,
        gap: 8,
    },
    tabText: {
        fontSize: 15,
        fontWeight: '600',
    },
    tabTextActive: {
        color: '#FFFFFF',
    },
    tabBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        minWidth: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabBadgeText: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
});

export default ButtonListV2;
