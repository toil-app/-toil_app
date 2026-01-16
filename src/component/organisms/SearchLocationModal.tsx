import React, { useState } from 'react';
import { Modal, View, FlatList, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { SearchTextInput } from '../atoms/TextInput/SearchTextInput';
import _ from "lodash"
import { Logger } from '@core/util/AppUtil';

import { P, H5, H6 } from '../atoms/Typhography/variants';
import { RegisteredLocation, Coordinates, Address } from '@core/models/firebase/UserFB';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
    visible: boolean;
    onClose: () => void;
    onSelect: (location: RegisteredLocation, label?: string) => void;
}
export interface LocationResult {
    id: string;
    name: string;
    address: Address | string;
    coordinates?: Coordinates;
    rawFeature?: any;
}

const SearchLocationModal: React.FC<Props> = ({ visible, onClose, onSelect }) => {
    const theme = useTheme();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<LocationResult[]>([]);
    const [label, setLabel] = useState('');
    const [showLabelPrompt, setShowLabelPrompt] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<LocationResult | null>(null);


    // MapTiler API key (replace with your actual key)
    const MAPTILER_API_KEY = '';

    // Call MapTiler geocoding API
    const fetchLocations = React.useCallback(async (searchQuery: string) => {
        if (!searchQuery) {
            setResults([]);
            return;
        }
        try {
            const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(searchQuery)}.json?key=${MAPTILER_API_KEY}&limit=5`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('API error');
            const data = await response.json();
            const features = data.features || [];
            const mapped: LocationResult[] = features.map((f: any) => ({
                id: f.id,
                name: f.text || f.place_name || f.properties?.name || searchQuery,
                address: f.place_name || f.properties?.address || '',
                coordinates: f.geometry && Array.isArray(f.geometry.coordinates)
                    ? { longitude: f.geometry.coordinates[0], latitude: f.geometry.coordinates[1] }
                    : undefined,
                rawFeature: f,
            }));
            setResults(mapped);
        } catch (e: any) {
            Logger('Error fetching locations:', e);
            setResults([]);
        }
    }, []);

    const debouncedFetchLocations = React.useMemo(() => _.debounce(fetchLocations, 400), [fetchLocations]);

    const handleSearch = (text: string) => {
        setQuery(text);
        debouncedFetchLocations(text);
    };

    const handleSelect = (location: LocationResult) => {
        // Convert LocationResult to RegisteredLocation for modal state
        const registeredLocation: RegisteredLocation = {
            id: location.id,
            label: location.name,
            address: typeof location.address === 'string' ? { streetAddress: location.address, city: '', state: '', country: '', postalCode: '' } : location.address,
            coordinates: location.coordinates,
        };
        setSelectedLocation(registeredLocation as any); // For modal state, but will be mapped again on confirm
        setLabel('');
        setShowLabelPrompt(true);
    };

    const handleLabelConfirm = () => {
        if (selectedLocation) {
            const labelToUse = label.trim() ? label.trim() : selectedLocation.name;
            const feature: any = selectedLocation.rawFeature;
            // ...existing code...
            const coordinates = selectedLocation.coordinates;
            const registeredLocation: RegisteredLocation = {
                id: selectedLocation.id,
                label: labelToUse,
                address: {
                    streetAddress: selectedLocation.name,
                    city: _.get(feature, 'context', []).find((c: any) => c.id?.startsWith('place'))?.text || '',
                    state: _.get(feature, 'context', []).find((c: any) => c.id?.startsWith('region'))?.text || '',
                    country: _.get(feature, 'context', []).find((c: any) => c.id?.startsWith('country'))?.text || '',
                    postalCode: _.get(feature, 'context', []).find((c: any) => c.id?.startsWith('postcode'))?.text || '',
                },
                coordinates,
            };
            onSelect(registeredLocation, labelToUse);
            setShowLabelPrompt(false);
            setLabel('');
            setSelectedLocation(null);
            onClose();
        }
    };

    const handleCancelLabel = () => {
        setShowLabelPrompt(false);
        setLabel('');
        setSelectedLocation(null);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
            transparent={false}
        >
            <KeyboardAvoidingView
                style={[styles.container, { backgroundColor: theme.background02 ? theme.background02(100) : '#fff' }]}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <SafeAreaView edges={['top', 'left', 'right']}>

                    <View style={[styles.header, { backgroundColor: theme.background02 ? theme.background02(100) : '#fff' }]}>
                        <SearchTextInput
                            value={query}
                            onChangeText={handleSearch}
                            placeholder="Search for a location..."
                            autoFocus
                            containerStyle={{ flex: 1, marginRight: 8 }}
                        />
                        <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
                            <P style={[styles.cancelText, { color: theme.primary01 ? theme.primary01(100) : '#007AFF' }]}>Cancel</P>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={results}
                        keyExtractor={item => item.id}
                        keyboardShouldPersistTaps="handled"
                        renderItem={({ item }) => (
                            <TouchableOpacity style={[styles.resultItem, { backgroundColor: theme.background01 ? theme.background01(100) : '#fff' }]} onPress={() => handleSelect(item)}>
                                <H5 style={[styles.resultName, { color: theme.text01 ? theme.text01(100) : '#222' }]}>{item.name}</H5>
                                <P style={[styles.resultAddress, { color: theme.text02 ? theme.text02(100) : '#666' }]}>{item.address.toString()}</P>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                            query ? <P style={[styles.emptyText, { color: theme.text02 ? theme.text02(50) : '#aaa' }]}>No results found.</P> : null
                        }
                    />
                    {/* Label prompt modal */}
                    {showLabelPrompt && (
                        <View style={styles.labelPromptOverlay}>
                            <View style={[styles.labelPromptBox, { backgroundColor: theme.background01 ? theme.background01(100) : '#fff' }]}>
                                <H5 style={[styles.labelPromptTitle, { color: theme.text01 ? theme.text01(100) : '#222' }]}>Label this location (optional)</H5>
                                <SearchTextInput
                                    value={label}
                                    onChangeText={setLabel}
                                    placeholder="e.g. Home, Work, Gym"
                                    autoFocus
                                    containerStyle={styles.labelInput}
                                />
                                <View style={styles.labelPromptActions}>
                                    <TouchableOpacity onPress={handleLabelConfirm} style={[styles.labelConfirmBtn, { backgroundColor: theme.primary01 ? theme.primary01(100) : '#007AFF' }]}>
                                        <H6 style={styles.labelConfirmText}>Save</H6>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleCancelLabel} style={[styles.labelCancelBtn, { backgroundColor: theme.background02 ? theme.background02(100) : '#eee' }]}>
                                        <H6 style={styles.labelCancelText}>Cancel</H6>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                </SafeAreaView>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 8,
        backgroundColor: '#fff',
        zIndex: 2,
    },
    searchInput: {
        flex: 1,
        height: 44,
        borderRadius: 8,
        backgroundColor: '#F3F6F8',
        paddingHorizontal: 12,
        fontSize: 16,
    },
    cancelBtn: {
        marginLeft: 12,
        padding: 8,
    },
    cancelText: {
        color: '#007AFF',
        fontSize: 16,
    },
    resultItem: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
    },
    resultName: {
        color: '#222',
    },
    resultAddress: {
        color: '#666',
        marginTop: 2,
    },
    emptyText: {
        textAlign: 'center',
        color: '#aaa',
        marginTop: 32,
    },
    labelPromptOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    labelPromptBox: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    labelPromptTitle: {
        marginBottom: 12,
    },
    labelInput: {
        width: '100%',
        height: 40,
        borderRadius: 8,
        // backgroundColor: '#F3F6F8',
        paddingHorizontal: 10,
        // fontSize: 15,
        marginBottom: 16,
    },
    labelPromptActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    labelConfirmBtn: {
        flex: 1,
        // backgroundColor: '#007AFF',
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
        marginRight: 8,
    },
    labelConfirmText: {
    },
    labelCancelBtn: {
        flex: 1,
        // backgroundColor: '#eee',
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
        marginLeft: 8,
    },
    labelCancelText: {
    },
});

export default SearchLocationModal;
