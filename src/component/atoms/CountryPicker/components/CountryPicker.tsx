import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    Modal,
    Text,
    FlatList,
    ScrollView,
    Platform,
} from 'react-native';


import Fuse from 'fuse.js';

import cca2List from '../data/cca2.json';
import { getHeightPercent } from './ratio';
import countryPickerStyles from './CountryPicker.style';
import KeyboardAvoidingView from './KeyboardAvoidingView';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { relativeWidth } from '@core/util/Theme/layout';
import { SearchTextInput } from '@components/atoms/TextInput';
import { ButtonV1 } from '@components/atoms/Button';
import { H5, P } from '@components/atoms/Typhography/variants';

let countries: any = null;
let Emoji: any = null;
let styles: any = {};

let isEmojiable = Platform.OS === 'ios';

const FLAG_TYPES = {
    flat: 'flat',
    emoji: 'emoji',
};

const setCountries = (flagType?: any) => {
    if (typeof flagType !== 'undefined') {
        isEmojiable = flagType === FLAG_TYPES.emoji;
    }

    if (isEmojiable) {
        countries = require('../data/countries-emoji.json');
        Emoji = require('./emoji').default;
    } else {
        countries = require('../data/countries.json');
        Emoji = View; // use View component when emoji not used
    }
};

setCountries();

export const getAllCountries = (): any[] => cca2List.map((cca2: string) => ({ ...countries[cca2], cca2 }));

// Helper static-style flag renderers so other modules can still call CountryPicker.renderFlag(...)
function renderEmojiFlag(cca2: string, emojiStyle?: any) {
    const EmojiComp = Emoji;

    return (
        <Text style={[countryPickerStyles.emojiFlag, emojiStyle]} allowFontScaling={false}>
            {cca2 !== '' && countries[cca2.toUpperCase()] ? <EmojiComp name={countries[cca2.toUpperCase()].flag} /> : null}
            <Text>{countries[cca2.toUpperCase()].flag}</Text>
        </Text>
    );
}

function renderImageFlag(cca2: string, imageStyle?: any) {
    return cca2 !== '' ? <Image style={[countryPickerStyles.imgStyle, imageStyle]} source={{ uri: countries[cca2].flag }} /> : null;
}

function renderFlag(cca2: string, itemStyle?: any, emojiStyle?: any, imageStyle?: any) {
    return <View style={[countryPickerStyles.itemCountryFlag, itemStyle]}>{isEmojiable ? renderEmojiFlag(cca2, emojiStyle) : renderImageFlag(cca2, imageStyle)}</View>;
}

function renderFlagWithName(cca2: string, countryName: string, itemStyle?: any, emojiStyle?: any, imageStyle?: any) {
    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
            <View style={[countryPickerStyles.itemCountryFlag, itemStyle]}>{isEmojiable ? renderEmojiFlag(cca2, emojiStyle) : renderImageFlag(cca2, imageStyle)}</View>
            <Text style={{ marginLeft: 15, fontSize: 16 }}>{countryName}</Text>
        </View>
    );
}

function renderFlagWithCountryCode(cca2: string, countryName: string, itemStyle?: any, emojiStyle?: any, imageStyle?: any) {
    const d = countries[cca2];
    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
            <View style={[countryPickerStyles.itemCountryFlag, itemStyle]}>{isEmojiable ? renderEmojiFlag(cca2, emojiStyle) : renderImageFlag(cca2, imageStyle)}</View>
            <P themeToken='text01' style={{ marginLeft: 15, fontSize: 16 }}>{`+${d.callingCode}`}</P>
        </View>
    );
}

const CountryPicker: React.FC<any> = (props) => {
    const insets = useSafeAreaInsets();
    // apply countries for requested flagType when props change
    useEffect(() => {
        setCountries(props.flagType);
    }, [props.flagType]);

    // compute initial country list from props
    const initialCountryList = useMemo(() => {
        let countryList = [...(props.countryList || cca2List)];
        const excludeCountries = [...(props.excludeCountries || [])];

        excludeCountries.forEach((excludeCountry: any) => {
            const index = countryList.indexOf(excludeCountry);
            if (index !== -1) countryList.splice(index, 1);
        });

        // Sort country list by localized name (inline to avoid hook dependency issues)
        countryList = countryList
            .map((c: any) => [
                c,
                countries && countries[c] && countries[c].name
                    ? (countries[c].name[props.translation || 'eng'] || countries[c].name.common)
                    : '',
            ])
            .sort((a: any, b: any) => {
                if (a[1] < b[1]) return -1;
                if (a[1] > b[1]) return 1;
                return 0;
            })
            .map((c: any) => c[0]);

        return countryList;
    }, [props.countryList, props.excludeCountries, props.translation]);

    const [modalVisible, setModalVisible] = useState(false);
    const [cca2ListState, setCca2ListState] = useState<string[]>(initialCountryList);
    const [flatListMapState, setFlatListMapState] = useState(initialCountryList.map((n: any) => ({ key: n })));
    const [_dataSource, setDataSource] = useState<string[]>(initialCountryList);
    const [filter, setFilter] = useState('');
    const [letters, setLetters] = useState<string[]>(() => getLettersLocal(initialCountryList));

    // styles merge
    const mergedStyles = useMemo(() => {
        if (props.styles) {
            const s: any = {};
            (Object.keys(countryPickerStyles) as Array<keyof typeof countryPickerStyles>).forEach((key) => {
                const propStyles = (props.styles as any)[key];
                s[key] = StyleSheet.flatten([countryPickerStyles[key], propStyles]);
            });
            return StyleSheet.create(s);
        }
        return countryPickerStyles;
    }, [props.styles]);

    styles = mergedStyles;

    // fuse instance
    const fuseRef = useRef<any>(null);
    useEffect(() => {
        const options = Object.assign(
            {
                shouldSort: true,
                threshold: 0.6,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 1,
                keys: ['name'],
                id: 'id',
            },
            props.filterOptions,
        );

        fuseRef.current = new Fuse(
            (initialCountryList || []).reduce((acc: any, item: any) => [
                ...acc,
                {
                    id: item,
                    name:
                        countries && countries[item] && countries[item].name
                            ? countries[item].name[props.translation || 'eng'] || countries[item].name.common
                            : '',
                },
            ], []),
            options,
        );
    }, [initialCountryList, props.filterOptions, props.translation]);

    // update when props.countryList changes
    useEffect(() => {
        const cl = props.countryList || initialCountryList;
        setCca2ListState(cl);
        setDataSource(cl);
        setFlatListMapState(cl.map((n: any) => ({ key: n })));
        // recompute letters inline
        setLetters(
            Object.keys(
                (cl || []).reduce((acc: any, val: string) => {
                    const name = countries && countries[val] && countries[val].name ? (countries[val].name[props.translation || 'eng'] || countries[val].name.common) : '';
                    return { ...acc, [name.slice(0, 1).toUpperCase()]: '' };
                }, {}),
            ).sort(),
        );
    }, [props.countryList, initialCountryList, props.translation]);

    const flatListRef = useRef<any>(null);
    const visibleListHeightRef = useRef<number>(0);

    const itemHeight = getHeightPercent(7);
    const listHeight = (countries && countries.length ? countries.length : 0) * itemHeight;

    function getCountryNameLocal(country: any, optionalTranslation?: string) {
        if (!country) return '';
        const translation = optionalTranslation || props.translation || 'eng';
        return country.name ? country.name[translation] || country.name.common : '';
    }

    function getLettersLocal(list: string[]) {
        return Object.keys(
            list.reduce((acc: any, val: string) => ({ ...acc, [getCountryNameLocal(countries[val]).slice(0, 1).toUpperCase()]: '' }), {}),
        ).sort();
    }

    function openModal() {
        setModalVisible(true);
    }

    function onSelectCountry(cca2: string) {
        setModalVisible(false);
        setFilter('');
        setDataSource(cca2ListState);
        props.onChange && props.onChange({ cca2, ...countries[cca2], flag: undefined, name: getCountryNameLocal(countries[cca2]) });
    }

    function onClose() {
        setModalVisible(false);
        setFilter('');
        setDataSource(cca2ListState);
        props.onClose && props.onClose();
    }

    // (removed unused setVisibleListHeight) - kept visibleListHeightRef for scroll calculations

    function scrollTo(letter: string) {
        const index = cca2ListState.map((country: string) => getCountryNameLocal(countries[country])[0]).indexOf(letter);
        if (index === -1) return;
        let position = index * itemHeight;
        if (position + visibleListHeightRef.current > listHeight) position = listHeight - visibleListHeightRef.current;
        flatListRef.current && flatListRef.current.scrollToIndex({ index });
    }

    function handleFilterChange(value: string) {
        const filteredCountries = value === '' ? cca2ListState : (fuseRef.current ? fuseRef.current.search(value).map((item: any) => item.item.id) : cca2ListState);
        flatListRef.current && flatListRef.current.scrollToOffset({ offset: 0 });
        setFilter(value);
        setDataSource(filteredCountries);
        setFlatListMapState(filteredCountries.map((n: string) => ({ key: n })));
    }

    function renderCountry(country: string, index: number) {
        return (
            <TouchableOpacity key={index} onPress={() => onSelectCountry(country)} activeOpacity={0.99}>
                {renderCountryDetail(country,)}
            </TouchableOpacity>
        );
    }

    function renderLetters(letter: string, index: number) {
        return (
            <TouchableOpacity key={index} onPress={() => scrollTo(letter)} activeOpacity={0.6}>
                <View style={styles.letter}>
                    <Text style={styles.letterText} allowFontScaling={false}>
                        {letter}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    function renderCountryDetail(cca2: string) {
        const country: any = countries[cca2];
        return (
            <View style={styles.itemCountry}>
                {!props.hideCountryFlag && renderFlag(cca2)}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                    <H5 themeToken='text01'>{getCountryNameLocal(country)}</H5>
                    {props.showCallingCode && country.callingCode && <P>{`+${country.callingCode.trim()}`}</P>}
                </View>
            </View>
        );
    }

    function renderFilter() {
        const { renderFilter: renderFilterProp, autoFocusFilter, filterPlaceholder } = props;
        const value = filter;
        const onChange = handleFilterChange;
        const onCloseCb = onClose;
        if (renderFilterProp) return renderFilterProp({ value, onChange, onClose: onCloseCb });

        return (

            <SearchTextInput
                autoFocus={autoFocusFilter}
                autoCorrect={false}
                placeholder={filterPlaceholder}
                onChangeText={onChange}
                value={value}

            />

        );
    }

    // render
    const cList = flatListMapState;
    const theme: any = useTheme();

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => !props.disabled && openModal()} activeOpacity={0.7}>
                {props.children ? (
                    props.children
                ) : (
                    <View style={[styles.touchFlag, { marginTop: isEmojiable ? 0 : 5 }]}>
                        {props.showCountryNameWithFlag && renderFlagWithCountryCode(props.cca2, getCountryNameLocal(countries[props.cca2]), styles.itemCountryFlag, styles.emojiFlag, styles.imgStyle)}
                        {/* {props.showCountryNameWithFlag && renderFlagWithName(props.cca2, getCountryNameLocal(countries[props.cca2]), styles.itemCountryFlag, styles.emojiFlag, styles.imgStyle)} */}
                        {!props.showCountryNameWithFlag && renderFlag(props.cca2, styles.itemCountryFlag, styles.emojiFlag, styles.imgStyle)}
                    </View>
                )}
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={{ flex: 1, marginTop: insets.top }}>
                    <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme ? theme.background02(100) : 'transparent' }]}>

                        <View style={[styles.header, { justifyContent: 'center', alignItems: 'center', marginBottom: insets.bottom }]}>
                            {props.filterable && renderFilter()}

                        </View>
                        <KeyboardAvoidingView behavior="padding">
                            <View style={[styles.contentContainer, { paddingHorizontal: relativeWidth(20) }]}>
                                <FlatList
                                    ref={flatListRef}
                                    data={cList}
                                    initialNumToRender={15}
                                    maxToRenderPerBatch={10}
                                    windowSize={5}
                                    removeClippedSubviews={true}
                                    updateCellsBatchingPeriod={50}
                                    getItemLayout={(data, index) => ({
                                        length: itemHeight,
                                        offset: itemHeight * index,
                                        index,
                                    })}
                                    renderItem={({ item, index }) => renderCountry(item.key, index)}
                                    keyExtractor={(item: { key: string }) => item.key}
                                    contentContainerStyle={{ backgroundColor: theme ? theme.background02(100) : 'transparent' }}
                                />
                                {!props.hideAlphabetFilter && (
                                    <ScrollView contentContainerStyle={styles.letters} keyboardShouldPersistTaps="always">
                                        {filter === '' && letters.map((letter: string, index: number) => renderLetters(letter, index))}
                                    </ScrollView>
                                )}
                            </View>
                        </KeyboardAvoidingView>
                        <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: relativeWidth(20), marginBottom: insets.bottom }}>
                            {props.closeable && <ButtonV1 text="Close" onPress={() => onClose()} />}
                        </View>
                    </SafeAreaView>
                </View>
            </Modal>
        </View>
    );
};

// attach static helpers so older code can still call CountryPicker.renderFlag(...)
(CountryPicker as any).renderEmojiFlag = renderEmojiFlag;
(CountryPicker as any).renderImageFlag = renderImageFlag;
(CountryPicker as any).renderFlag = renderFlag;
(CountryPicker as any).renderFlagWithName = renderFlagWithName;

CountryPicker.propTypes = {
    cca2: PropTypes.string.isRequired,
    translation: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func,
    closeable: PropTypes.bool,
    filterable: PropTypes.bool,
    children: PropTypes.node,
    countryList: PropTypes.array,
    excludeCountries: PropTypes.array,
    styles: PropTypes.object,
    filterPlaceholder: PropTypes.string,
    autoFocusFilter: PropTypes.bool,
    disabled: PropTypes.bool,
    filterPlaceholderTextColor: PropTypes.string,
    closeButtonImage: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    transparent: PropTypes.bool,
    animationType: PropTypes.oneOf(['slide', 'fade', 'none']),
    flagType: PropTypes.oneOf(Object.values(FLAG_TYPES)),
    hideAlphabetFilter: PropTypes.bool,
    hideCountryFlag: PropTypes.bool,
    renderFilter: PropTypes.func,
    showCallingCode: PropTypes.bool,
    filterOptions: PropTypes.object,
    showCountryNameWithFlag: PropTypes.bool,
};

(CountryPicker as any).defaultProps = {
    translation: 'eng',
    countryList: cca2List,
    hideCountryFlag: false,
    excludeCountries: [],
    filterPlaceholder: 'Filter',
    autoFocusFilter: true,
    transparent: false,
    animationType: 'none',
};

export default CountryPicker;
