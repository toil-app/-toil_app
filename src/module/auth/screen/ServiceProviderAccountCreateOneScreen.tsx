import React, { useEffect, useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { TextInput as AppTextInput, PhoneNumberInput } from '@components/atoms/TextInput';
import { ButtonV1 } from '@components/atoms/Button';
import { H2, H5 } from '@components/atoms/Typhography/variants';
import { StepProgress } from '@components/molecules/Progress';
import AuthHeader from '@components/organisms/header/AuthHeader';
import { useNavigation } from '@react-navigation/native';
import TextInputLable from '@components/atoms/label/TextInputLable';
import { connect } from 'react-redux';
import { Actions } from '@core/modules/Actions';
import { CreateProviderData, CreateProviderStepOne } from '@core/models';
import { UserRole } from '@core/models';

type ServiceProviderAccountCreateOneScreenProps = {
    createProviderInfo: CreateProviderData;
    createProviderAccount: (data: any) => void;
};

const ServiceProviderAccountCreateOneScreen: React.FC<ServiceProviderAccountCreateOneScreenProps> = ({ createProviderInfo, createProviderAccount }) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation<any>();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [nationality, setNationality] = useState('');
    const [local, setLocal] = useState<string>('');
    const [international, setInternational] = useState<string>('');
    const [countryCode, setCountryCode] = useState<string>('');
    const [callingCode, setCallingCode] = useState<string>('');

    const [errors, setErrors] = useState({
        phoneNumber: '',
        firstName: '',
        lastName: '',
        idNumber: '',
        nationality: '',
    });

    useEffect(() => {
        const stepOneData = createProviderInfo?.stepOne;
        if (stepOneData) {
            setFirstName(stepOneData.firstName || '');
            setLastName(stepOneData.lastName || '');
            setIdNumber(stepOneData.idNumber || '');
            setNationality(stepOneData.nationality || '');
            setLocal(stepOneData.localPhoneNumber || '');
            setInternational(stepOneData.internationalPhoneNumber || '');
            setCountryCode(stepOneData.countryCode || '');
            setCallingCode(stepOneData.callingCode || '');
        }

    }, [createProviderInfo])

    const onChangePhone = (intl: string, localNum: string, code: string, calling: string) => {
        setInternational(intl);
        setLocal(localNum);
        setCountryCode(code);
        setCallingCode(calling);
        // Clear error when user starts typing
        if (errors.phoneNumber && localNum.trim()) {
            setErrors(prev => ({ ...prev, phoneNumber: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors = {
            phoneNumber: '',
            firstName: '',
            lastName: '',
            idNumber: '',
            nationality: '',
        };

        if (!local.trim()) {
            newErrors.phoneNumber = t('phone_number_required') || 'Phone number is required';
        } else if (local.trim().length < 5) {
            newErrors.phoneNumber = t('phone_number_invalid') || 'Phone number is too short';
        }

        if (!firstName.trim()) {
            newErrors.firstName = t('first_name_required') || 'First name is required';
        }

        if (!lastName.trim()) {
            newErrors.lastName = t('last_name_required') || 'Last name is required';
        }

        if (!idNumber.trim()) {
            newErrors.idNumber = t('id_number_required') || 'ID number is required';
        }

        if (!nationality.trim()) {
            newErrors.nationality = t('nationality_required') || 'Nationality is required';
        }

        setErrors(newErrors);
        return !newErrors.phoneNumber && !newErrors.firstName && !newErrors.lastName && !newErrors.idNumber && !newErrors.nationality;
    };

    const onNext = () => {
        if (!validateForm()) {
            return;
        }

        const userData: CreateProviderStepOne = {
            phoneNumber: local.trim(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            idNumber: idNumber.trim(),
            nationality: nationality.trim(),
            dateOfBirth: '',
            countryCode: countryCode,
            callingCode: callingCode,
            internationalPhoneNumber: international,
            localPhoneNumber: local.trim(),
            userType: UserRole.PROVIDER,
        };

        createProviderAccount({
            ...createProviderInfo,
            stepOne: userData,
        });

        console.log('User Data:', userData);
        navigation.navigate('SignupScreenTwo', { userData });
    };

    const bg = typeof theme.background02 === 'function' ? theme.background02(100) : '#0f1720';

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <AuthHeader
                        title={t('personal_details') || 'Personal Details'}
                        onBack={() => { }}
                    />
                    <View style={styles.headerRow}>
                        <View style={styles.headerTop}>
                            {/* back arrow handled by navigation header outside this screen */}
                        </View>
                        <StepProgress step={1} total={5} value={1} />
                    </View>

                    <View style={styles.titleRow}>
                        <H2 style={styles.labelTextAlignLeft} themeToken="text01" >
                            {t('personal_details_title') || 'Tell us about yourself'}
                        </H2>
                        <H5 style={styles.labelTextAlignLeft} themeShade={50} themeToken="text02">
                            {t('personal_details_subtitle') || "We need your official identification details to verify your vendor account."}
                        </H5>
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
                            />
                        </View>
                        <AppTextInput
                            label={t('first_name_label') || 'First Name'}
                            placeholder={t('first_name_placeholder') || 'e.g., John'}
                            value={firstName}
                            onChangeText={(text) => {
                                setFirstName(text);
                                if (errors.firstName && text.trim()) {
                                    setErrors(prev => ({ ...prev, firstName: '' }));
                                }
                            }}
                            width="100%"
                            required={true}
                            error={errors.firstName}
                        />
                        <View style={styles.spacer} />
                        <AppTextInput
                            label={t('last_name_label') || 'Last Name'}
                            placeholder={t('last_name_placeholder') || 'e.g., Doe'}
                            value={lastName}
                            onChangeText={(text) => {
                                setLastName(text);
                                if (errors.lastName && text.trim()) {
                                    setErrors(prev => ({ ...prev, lastName: '' }));
                                }
                            }}
                            width="100%"
                            required={true}
                            error={errors.lastName}
                        />
                        <View style={styles.spacer} />
                        <AppTextInput
                            label={t('id_number_label') || 'ID Number'}
                            placeholder={t('id_number_placeholder') || 'National ID or Passport No.'}
                            value={idNumber}
                            onChangeText={(text) => {
                                setIdNumber(text);
                                if (errors.idNumber && text.trim()) {
                                    setErrors(prev => ({ ...prev, idNumber: '' }));
                                }
                            }}
                            width="100%"
                            required={true}
                            error={errors.idNumber}
                        />
                        <View style={styles.spacer} />
                        <AppTextInput
                            label={t('nationality_label') || 'Nationality'}
                            placeholder={t('nationality_placeholder') || 'Select Country'}
                            value={nationality}
                            onChangeText={(text) => {
                                setNationality(text);
                                if (errors.nationality && text.trim()) {
                                    setErrors(prev => ({ ...prev, nationality: '' }));
                                }
                            }}
                            width="100%"
                            required={true}
                            error={errors.nationality}
                        />
                    </View>

                    <View style={styles.footer}>
                        <ButtonV1 text={t('next') || 'Next'} onPress={onNext} containerStyle={styles.nextButton} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    flex: { flex: 1 },
    safeArea: { flex: 1 },
    container: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40, minHeight: '100%' },
    headerRow: { marginBottom: 16 },
    headerTop: { height: 40 },
    progressRow: { marginBottom: 12 },
    titleRow: { marginBottom: 24 },
    form: { marginTop: 8 },
    spacer: { height: 20 },
    footer: { alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 40 },
    nextButton: { width: '100%', height: 56, borderRadius: 12 },
    stepLabel: { marginBottom: 8 },
    subtitleText: { marginTop: 12 },
    inputRow: {
        width: '100%',
        marginBottom: 16,
    },
    label: {
        marginBottom: 8,
        fontSize: 14,
    },
    labelTextAlignLeft: {
        textAlign: 'left',
    },
});

export default connect(
    (state: any) => ({
        createProviderInfo: state.auth.get('createProviderInfo'),
    }),
    {
        createProviderAccount: Actions.auth.createProviderAccount
    }
)(ServiceProviderAccountCreateOneScreen);
