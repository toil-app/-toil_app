module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          // common aliases used in the project — update paths as needed
          '@core': './src/core',
          '@components': './src/component',
          '@assets': './src/assets',
          '@module': './src/module',
          '@module/*': './src/module/*',
          '@src': './src',
          '@utils/*': './src/core/util/*',
          // bare '@module' -> resolve to module barrel for Metro runtime resolution
             // bare '@module' -> resolve to the module barrel for Metro runtime resolution
        },
        extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
      },
    ],
  ],
};
