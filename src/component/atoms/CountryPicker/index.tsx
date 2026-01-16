import React from 'react';
import { View, } from 'react-native';
import CountryPicker from './components/CountryPicker';
//Todo after npm install country-picker-modal node folder react-native-safe-area-view 's index.js mus be replaced with react-native-safe=area-view index.js
export default ({
  countryCode = 'GB',
  onChange = () => { },
  reference = null,
  disabled = false,
  fontFamily = '',
  fontWeight = 'bold'
}) => {
  return (
    <View>
      <CountryPicker
        ref={reference}
        withAlphaFilter={true}
        withEmoji={false}
        disabled={disabled}
        filterable={true}
        transparent={true}
        closeable={true}
        onChange={onChange}
        cca2={countryCode}
        translation="eng"
        hideAlphabetFilter={true}
        fontWeight={fontWeight}
        fontFamily={fontFamily}
        flatListProps={{
          initialScrollIndex: 50,
          initialNumToRender: 2,
          viewPosition: 0.5,
        }}
      />
    </View>
  );
};
