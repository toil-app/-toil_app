import {
  Alert,
  AlertButton,
  AlertOptions,
  Platform,
  ToastAndroid,
} from 'react-native';

export const showAlert = (
  title: string,
  message?: string,
  buttons?: AlertButton[],
  options?: AlertOptions,
) => {
  Alert.alert(title, message, buttons, options);
};

export type ToastStyle = {
  backgroundColor?: string;
  textColor?: string;
};

export type ToastOptions = {
  duration?: 'short' | 'long';
  position?: 'top' | 'center' | 'bottom';
  style?: ToastStyle;
};

export const showToast = (
  message: string,
  options?: ToastOptions & { title?: string },
) => {
  if (Platform.OS === 'android') {
    const duration =
      options?.duration === 'long' ? ToastAndroid.LONG : ToastAndroid.SHORT;

    const gravity =
      options?.position === 'top'
        ? ToastAndroid.TOP
        : options?.position === 'center'
        ? ToastAndroid.CENTER
        : ToastAndroid.BOTTOM;

    ToastAndroid.showWithGravity(message, duration, gravity);
    return;
  }

  // iOS / other platforms fallback
  Alert.alert(options?.title ?? '', message, [{ text: 'OK' }], {
    cancelable: true,
  });
};
