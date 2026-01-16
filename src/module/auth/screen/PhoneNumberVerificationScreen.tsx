import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { useFont } from '@core/util/fonts/FontContext';
import { useTranslation } from 'react-i18next';
import { OTPInput } from '@components/atoms/TextInput';
import { ButtonV1 } from '@components/atoms/Button';
import { H2, H4, H5, P } from '@components/atoms';
import { relativeHeight, relativeWidth } from '@core/util/Theme/layout';
import AuthHeader from '@components/organisms/header/AuthHeader';
import { useRoute } from '@react-navigation/native';
import { connect } from 'react-redux';
import { Actions } from '@core/modules/Actions';
import { VerifyOTPAction } from '@core/models/Auth';
import { UserRole } from '@core/models';


type PhoneNumberVerificationScreenProps = {
    onVerifyPhoneCode: (data: VerifyOTPAction) => void;
    logIn: (data: any) => void;
    credentials: any;
};

const PhoneNumberVerificationScreen: React.FC<PhoneNumberVerificationScreenProps> = ({ onVerifyPhoneCode, logIn, credentials }) => {
    const theme: any = useTheme();
    const font: any = useFont();
    // const navigation: any = useNavigation();
    const route = useRoute<any>();
    const otpRef = useRef<any>(null);
    const [code, setCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState<string>(route.params?.phoneNumber || '');
    const [remaining, setRemaining] = useState<number>(60);
    const [userType, setUserType] = useState<UserRole>(UserRole.CLIENT);

    const { t } = useTranslation();

    useEffect(() => {
        setPhoneNumber(route.params?.phoneNumber || '');
    }, [route.params?.phoneNumber]);

    useEffect(() => {
        setUserType(credentials?.userType || UserRole.CLIENT);
    }, [credentials]);

    // Countdown timer
    useEffect(() => {
        if (remaining <= 0) return;
        const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
        return () => clearInterval(id);
    }, [remaining]);

    const onConfirm = () => {
        // handle confirm
        console.log('Confirm code', code);
        // Navigate to the nested screen inside User correctly:
        // navigate to the parent navigator (User) and specify the screen name in `screen`
        // navigation.navigate('User');
        // navigation.navigate('ServiceProvider');
    };

    const onResend = () => {
        if (remaining > 0) return;
        setRemaining(60);
        logIn(credentials);
    };

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // Dynamic styles that depend on theme tokens
    const dynamicStyles = {
        container: { ...styles.container, backgroundColor: theme && typeof theme.background02 === 'function' ? theme.background02(100) : '#0b1216' },
        lockCircle: { ...styles.lockCircle, backgroundColor: theme && typeof theme.background01 === 'function' ? theme.background01(100) : '#123' },
        otpCell: { backgroundColor: theme && typeof theme.background01 === 'function' ? theme.background01(100) : '#1f2a30' },
        otpCellFocused: { ...styles.cellStyleFocused, borderColor: theme && typeof theme.primary01 === 'function' ? theme.primary01(100) : '#2AA3FF' },
        otpText: { color: theme && typeof theme.text01 === 'function' ? theme.text01(100) : '#fff', fontSize: 20 },
        backArrow: { ...styles.backArrow, color: theme && theme.text01 ? theme.text01(100) : '#fff' },
    };

    return (
        <SafeAreaView style={dynamicStyles.container}>
            <AuthHeader
                title={t('login')}
                onBack={() => { }}
                containerStyle={styles.topBack}
            />

            <View style={styles.center}>
                <View style={dynamicStyles.lockCircle}>
                    <Text style={styles.lockIcon}>🔒</Text>
                </View>
                <H2 style={[styles.title, { fontFamily: font?.bold }]}>{t('verification_title')}</H2>
                <P themeToken='text02' style={styles.subtitle}>{t('verification_sent_to')}</P>
                <View style={styles.phoneRow}>
                    <H4 style={[styles.phoneNumber, { fontFamily: font?.regular }]}>{phoneNumber}</H4>
                    <TouchableOpacity>
                        <H4 themeToken='text02' themeShade={125} style={styles.change}>{t('change')}</H4>
                    </TouchableOpacity>
                </View>

                <View style={styles.otpContainer}>
                    <OTPInput
                        ref={otpRef}
                        value={code}
                        onChangeText={setCode}
                        codeLength={6}
                        cellSize={56}
                        cellSpacing={12}
                        cellStyle={dynamicStyles.otpCell}
                        cellStyleFocused={dynamicStyles.otpCellFocused}
                        textStyle={dynamicStyles.otpText}
                        keyboardType="number-pad"
                        autoFocus={true}
                        onFulfill={(code) => {
                            console.log('OTP Fulfilled:', code);
                            onVerifyPhoneCode({ phoneNumber, otp: code, userType: userType });
                        }}
                    />
                </View>

                <Pressable onPress={onResend} disabled={remaining > 0} style={{ opacity: remaining > 0 ? 0.5 : 1 }}>
                    <H5 themeToken='text02' style={styles.resendText}>
                        {remaining > 0
                            ? t('resend_in', { time: formatTime(remaining) })
                            : t('resend_in', { time: formatTime(0) })}
                    </H5>
                </Pressable>
            </View>

            <View style={styles.footer}>
                <ButtonV1 text={t('confirm_code')} containerStyle={styles.continueButton} onPress={onConfirm} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    topBack: { paddingHorizontal: relativeWidth(20) },
    backArrow: { fontSize: 28, },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
    lockCircle: { width: 110, height: 110, borderRadius: 55, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
    lockIcon: { fontSize: 36 },
    title: {},
    subtitle: { fontSize: 14, marginBottom: 8 },
    phoneRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
    phoneNumber: { fontSize: 18, marginRight: 8 },
    change: { fontSize: 16, },
    otpContainer: { marginVertical: 12, paddingHorizontal: relativeWidth(20) },
    resendText: { marginTop: 12 },
    timer: {},
    footer: { paddingHorizontal: relativeWidth(20), paddingBottom: 32, alignItems: 'center', width: '100%' },
    cellStyleFocused: { borderWidth: 2 },
    continueButton: {
        width: '100%',
        borderRadius: 14,
        height: relativeHeight(52),
        alignSelf: 'center',
    }
});

export default connect(
    (state: any) => ({
        credentials: state.auth.get('credentials'),
    }),
    {
        onVerifyPhoneCode: Actions.auth.onVerifyPhoneCode,
        logIn: Actions.auth.logIn,
    }
)(PhoneNumberVerificationScreen);
