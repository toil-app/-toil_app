import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { useFont } from '@core/util/fonts/FontContext';
import { useTranslation } from 'react-i18next';
import { TextInput as AppTextInput, PhoneNumberInput } from '@components/atoms/TextInput';
import { ButtonV1 } from '@components/atoms/Button';
import { Text } from 'react-native';
import { AuthHeader } from '@components/organisms/header';
import { relativeHeight } from '@core/util/Theme/layout';
import TextInputLable from '@components/atoms/label/TextInputLable';
import { useRoute } from '@react-navigation/native';
import { PHONE_REGEX } from '@core/util/constant/constant';
import { CreateUser } from '@core/models/CreateUser';
import { connect } from 'react-redux';
import { Actions } from '@core/modules/Actions';
import { UserRole } from '@core/models';

interface CreateAccountScreenProps {
    createAccount: (user: CreateUser) => void;
}

const CreateAccountScreen = ({ createAccount }: CreateAccountScreenProps) => {
    const theme = useTheme();
    const font = useFont();
    const { t } = useTranslation();
    const route = useRoute<any>();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [local, setLocal] = useState<string>('');
    const [international, setInternational] = useState<string>('');
    const [countryCode, setCountryCode] = useState<string>('');
    const [callingCode, setCallingCode] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [userType, setUserType] = useState<UserRole>(UserRole.CLIENT);

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
    });

    const firstRef = useRef<any>(null);
    const lastRef = useRef<any>(null);
    const phoneRef = useRef<any>(null);

    useEffect(() => {
        // Autofocus first name input when screen loads
        setTimeout(() => {
            phoneRef.current?.focus();
        }, 500);
    }, []);

    useEffect(() => {
        setUserType(route.params?.userType || UserRole.CLIENT);
    }, [route.params?.userType]);

    const validateForm = (): boolean => {
        const newErrors = {
            firstName: '',
            lastName: '',
            phoneNumber: '',
        };

        if (!firstName.trim()) {
            newErrors.firstName = t('first_name_required') || 'First name is required';
        }

        if (!lastName.trim()) {
            newErrors.lastName = t('last_name_required') || 'Last name is required';
        }

        if (!local.trim()) {
            newErrors.phoneNumber = t('phone_number_required') || 'Phone number is required';
        } else if (!PHONE_REGEX.test(phoneNumber)) {
            newErrors.phoneNumber = t('phone_number_invalid') || 'Phone number is invalid';
        }

        setErrors(newErrors);

        return !newErrors.firstName && !newErrors.lastName && !newErrors.phoneNumber;
    };

    const onContinue = () => {
        if (!validateForm()) {
            return;
        }

        const createUser: CreateUser = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phoneNumber: phoneNumber.trim(),
            countryCode: countryCode || international.replace('+', ''),
            callingCode: callingCode,
            localPhoneNumber: local.trim(),
            userType: userType,
        };

        createAccount(createUser);
        // TODO: Navigate to next screen or call API
    };

    const onChangePhone = (intl: string, localNum: string, code: string, callingCode: string) => {
        setInternational(intl);
        setLocal(localNum);
        setCountryCode(code);
        setCallingCode(callingCode);
        setPhoneNumber(`+${callingCode}${localNum}`);
        // Clear error when user starts typing
        if (errors.phoneNumber && localNum.trim()) {
            setErrors(prev => ({ ...prev, phoneNumber: '' }));
        }
    };


    const backgroundColor = typeof theme.background02 === 'function' ? theme.background02(100) : '#0f1315';
    const titleColor = typeof theme.text01 === 'function' ? theme.text01(100) : '#ffffff';
    const subtitleColor = typeof theme.text01 === 'function' ? theme.text01(75) : '#9AA3AD';

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <AuthHeader
                        title={t('create_account')}
                        onBack={() => { }}
                    />

                    <View style={styles.header}>
                        <Text style={[styles.title, { color: titleColor, fontFamily: font?.bold }]}>{t('create_account_title') || 'Create your account'}</Text>
                        <Text style={[styles.subtitle, { color: subtitleColor, fontFamily: font?.regular }]}>{t('create_account_subtitle') || 'Enter your name to verify your identity.'}</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputRow}>
                            <TextInputLable
                                label={t('phone_number_label')}
                                required={true}
                                error={Boolean(errors.phoneNumber)}
                                editable={true}
                            />
                            <PhoneNumberInput
                                value={local}
                                onChangeText={onChangePhone}
                                placeholder={t('phone_placeholder')}
                                showCountrySelector={true}
                                maxLength={15}
                                error={errors.phoneNumber}
                                ref={phoneRef}
                            />
                        </View>
                        <AppTextInput
                            label={t('first_name_label') || 'First Name'}
                            placeholder={t('first_name_placeholder') || 'Jane'}
                            value={firstName}
                            onChangeText={(text) => {
                                setFirstName(text);
                                if (errors.firstName && text.trim()) {
                                    setErrors(prev => ({ ...prev, firstName: '' }));
                                }
                            }}
                            ref={firstRef}
                            width="100%"
                            required={true}
                            error={errors.firstName}
                        />

                        <View style={styles.spacer} />

                        <AppTextInput
                            label={t('last_name_label') || 'Last Name'}
                            placeholder={t('last_name_placeholder') || 'Doe'}
                            value={lastName}
                            onChangeText={(text) => {
                                setLastName(text);
                                if (errors.lastName && text.trim()) {
                                    setErrors(prev => ({ ...prev, lastName: '' }));
                                }
                            }}
                            ref={lastRef}
                            width="100%"
                            required={true}
                            error={errors.lastName}
                        />
                    </View>

                    <View style={styles.footer}>
                        <ButtonV1 text={t('continue') || 'Continue'} onPress={onContinue} containerStyle={styles.continueButton} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    flex: { flex: 1 },
    safeArea: { flex: 1 },
    container: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
        minHeight: '100%'
    },
    header: {
        marginBottom: 24,
        marginTop: relativeHeight(30),
    },
    title: {
        fontSize: 34,
        fontWeight: '700',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 8,
    },
    form: {
        marginTop: 8,
    },
    footer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginTop: 100
    },
    continueButton: {
        width: '100%',
        borderRadius: 12,
        height: 56,
    }
    ,
    spacer: {
        height: 16,
    },
    inputRow: {
        width: '100%',
        marginBottom: 16,
    },
    label: {
        marginBottom: 8,
        fontSize: 14,
    },
});

export default connect(
    (state: any) => ({
        createUserInfo: state.auth.get('createUserInfo'),
    }),
    {
        createAccount: Actions.auth.createAccount
    }
)(CreateAccountScreen);



