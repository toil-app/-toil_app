import { StyleSheet, PixelRatio } from 'react-native';
import { getScaledValue, relativeWidth } from '@core/util/Theme/layout';
import { getHeightPercent } from './ratio';

// Styles intentionally avoid hard-coded color / font-family values so the
// component can apply theme tokens and font families at render-time (via
// ThemeContext / FontContext). This keeps the StyleSheet static while letting
// dynamic values come from the current theme/font provider.
const styles = StyleSheet.create({
  container: {},
  modalContainer: {
    // background is applied at render time from theme
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    height: 48,
    width: '70%',
    fontWeight: 'bold',
    fontStyle: 'normal',
  },
  inputOnly: {
    marginLeft: '15%',
  },
  touchFlag: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 19,
  },
  imgStyle: {
    resizeMode: 'contain',
    width: 25,
    height: 19,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: '#eee',
    opacity: 0.8,
  },
  emojiFlag: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 30,
    width: 30,
    height: 30,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  itemCountry: {
    flexDirection: 'row',
    height: getHeightPercent(7),
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  itemCountryFlag: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '7%',
    width: '15%',
  },
  itemCountryName: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    borderBottomWidth: 2 / PixelRatio.get(),
    borderBottomColor: '#ccc',
    height: 22,
  },
  countryName: {
    fontSize: getScaledValue(16),
  },
  countryCode: {
    textAlign: 'right',
  },
  scrollView: {
    flex: 1,
  },
  letters: {
    marginRight: 10,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  letter: {
    height: 25,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterText: {
    textAlign: 'center',
    fontSize: getHeightPercent(2.2),
  },
  closeButton: {
    height: relativeWidth(48),
    width: relativeWidth(48),
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonImage: {
    height: 24,
    width: 24,
    resizeMode: 'contain',
  },
});

export default styles;
