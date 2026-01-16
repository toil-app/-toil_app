import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { relativeHeight, relativeWidth } from '@core/util/Theme/layout';
import { H2, H5, P } from '@components/atoms/Typhography/variants';
import { ButtonV1, PhoneNumberInput } from '@components/atoms';
import { AuthHeader } from '@components/organisms/header';
import { useNavigation, useRoute } from '@react-navigation/native';
import TextInputLable from '@components/atoms/label/TextInputLable';
import { PHONE_REGEX } from '@core/util/constant/constant';
import { UserRole } from '@core/models';
import { connect } from 'react-redux';
import { Actions } from '@core/modules/Actions';

type PhoneNumberEntryScreenProps = {
    logIn: (data: any) => void;
};

const PhoneNumberEntryScreen: React.FC<PhoneNumberEntryScreenProps> = ({ logIn }) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();
    const route = useRoute<any>();
    const navigation: any = useNavigation();
    const [international, setInternational] = useState<string>('');
    const [local, setLocal] = useState<string>('');
    const [phoneError, setPhoneError] = useState<string>('');
    const [userType, setUserType] = useState<UserRole>(route.params?.userType || UserRole.CLIENT);

    useEffect(() => {
        setUserType(route.params?.userType || UserRole.CLIENT);
    }, [route.params?.userType]);

    const backgroundColor =
        typeof theme.background02 === 'function' ? theme.background02(100) : (theme.background02 as any) || '#0F1720';

    const onChangePhone = (intl: string, localNum: string) => {
        setInternational(intl);
        setLocal(localNum);
        // Clear error when user changes phone
        if (phoneError) {
            setPhoneError('');
        }
    };

    const onContinue = () => {
        const fullPhoneNumber = international;

        if (!PHONE_REGEX.test(fullPhoneNumber)) {
            setPhoneError(t('phone_number_invalid') || 'Phone number is invalid');
            return;
        }
        logIn({ phoneNumber: fullPhoneNumber, userType });
        // navigation.navigate('PhoneNumberVerificationScreen', { phoneNumber: international, userType });
    };

    const goToSignup = () => {
        const path = userType === UserRole.PROVIDER ? 'SignupScreenOne' : 'UserSignupScreen';
        navigation.navigate(path, { userType });
    };

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor }]}>
            <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
                <AuthHeader
                    title={t('login')}
                    onBack={() => { }}
                />
            </View>

            <View style={styles.container}>
                <H2 themeToken="text01" style={styles.title}>{t('whats_your_number')}</H2>
                <H5 themeShade={50} themeToken="text02" style={styles.subtitle}>{t('enter_mobile_subtitle')}</H5>

                <View style={styles.inputRow}>
                    <TextInputLable
                        label={t('phone_number_label')}
                        required={true}
                        error={Boolean(phoneError)}
                        editable={true}
                    />
                    <PhoneNumberInput
                        value={local}
                        onChangeText={onChangePhone}
                        placeholder={t('phone_placeholder')}
                        showCountrySelector={true}
                        maxLength={15}
                        error={phoneError}
                    />
                </View>

                <H5 themeShade={50} themeToken="text02" style={styles.note}>{t('privacy_note')}</H5>
            </View>

            <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                <ButtonV1 text={t('continue')} onPress={onContinue} containerStyle={styles.nextButton} />

                <View style={styles.promptWrap}>
                    <P themeShade={50} style={styles.promptText}>{t("dont_have_account") || "If you don't have an account?"} </P>
                    <TouchableOpacity style={{ marginLeft: 10 }} onPress={goToSignup}>
                        <H5 style={styles.createText}>{t('create_account') || 'Create Account'}</H5>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default connect(
    (state: any) => ({
        userType: state.auth.get('userType'),
    }),
    {
        logIn: Actions.auth.logIn,
    }
)(PhoneNumberEntryScreen);

const styles = StyleSheet.create({
    safe: { flex: 1 },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        paddingHorizontal: relativeWidth(16),
    },
    back: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backText: {
        fontSize: 20,
    },
    container: {
        flex: 1,
        paddingHorizontal: relativeWidth(24),
        paddingTop: relativeHeight(80),
        alignItems: 'flex-start',
    },
    title: {
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'left',
    },
    subtitle: {
        marginBottom: 24,
        textAlign: 'left',
    },
    inputRow: {
        width: '100%',
        marginBottom: 16,
    },
    label: {
        marginBottom: 8,
        fontSize: 14,
    },
    note: {
        fontSize: 12,
        marginTop: 12,
        lineHeight: 18,
        textAlign: 'left',
    },
    footer: { alignItems: 'center', justifyContent: 'center', flex: 1, paddingHorizontal: relativeWidth(24) },
    nextButton: { width: '100%', height: 56, borderRadius: 12, alignSelf: 'center', },
    promptWrap: { flexDirection: 'row', alignItems: 'center', marginTop: relativeHeight(20), },
    promptText: { fontSize: 16 },
    createText: { fontWeight: '700' },
});
