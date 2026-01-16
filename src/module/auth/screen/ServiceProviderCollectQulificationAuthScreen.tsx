import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { TextInput as AppTextInput, TextArea } from '@components/atoms/TextInput';
import { ButtonV1 } from '@components/atoms';
import { StepProgress } from '@components/molecules/Progress';
import { FileUploadCard, UploadedFileCard } from '@components/molecules';
import CommonUploadPicker, {
    CommonPickedFile,
} from '@components/molecules/fileUpload/CommonUploadPicker';
import { H2, H5 } from '@components/atoms/Typhography/variants';
import { useNavigation } from '@react-navigation/native';
import AuthHeader from '@components/organisms/header/AuthHeader';
import { QualificationData, DocumentFile, CreateProviderData } from "@core/models"
import { MAX_FILE_SIZE } from '@core/util/constant/constant';
import { useToast } from '@core/util/ToastProvider';
import { connect } from 'react-redux';
import { Actions } from '@core/modules/Actions';


const FILE_SIZE_ERROR_MESSAGE = 'file_size_error';

type ServiceProviderCollectQulificationAuthScreenProps = {
    createProviderInfo: CreateProviderData;
    createProviderAccount: (data: any) => void;
};

const ServiceProviderCollectQulificationAuthScreen: React.FC<ServiceProviderCollectQulificationAuthScreenProps> = ({ createProviderInfo, createProviderAccount }) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation<any>();
    const { showToast } = useToast();

    const [years, setYears] = useState('');
    const [yearsError, setYearsError] = useState('');
    const [files, setFiles] = useState<DocumentFile[]>([]);
    const [details, setDetails] = useState('');

    const bg = typeof theme.background02 === 'function' ? (theme.background02 as any)(100) : (theme.background02 || '#0f1720');

    useEffect(() => {
        const stepThreeData = createProviderInfo?.stepThree;
        if (stepThreeData) {
            setYears(stepThreeData.years || '');
            setDetails(stepThreeData.details || '');
            setFiles(stepThreeData.qualification || []);
        }

    }, [createProviderInfo]);

    const validateFileSize = (fileSize?: number): boolean => {
        if (!fileSize) return true;
        if (fileSize > MAX_FILE_SIZE) {
            showToast(t(FILE_SIZE_ERROR_MESSAGE) || 'File size must be less than 5MB', { type: 'error' });
            return false;
        }
        return true;
    };

    const validateYearsOfExperience = (): boolean => {
        if (!years.trim()) {
            setYearsError(t('years_of_experience_required') || 'Years of experience is required');
            return false;
        }

        const yearsNum = parseInt(years.trim(), 10);
        if (isNaN(yearsNum) || yearsNum < 0) {
            setYearsError(t('years_of_experience_invalid') || 'Please enter a valid number');
            return false;
        }

        if (yearsError) {
            setYearsError('');
        }
        return true;
    };

    const handlePicked = (picked: CommonPickedFile) => {
        // Validate file size
        if (!validateFileSize(picked.size ?? 6 * 1024 * 1024)) {
            return;
        }

        const sizeLabel =
            picked.size != null ? `${(picked.size / (1024 * 1024)).toFixed(1)} MB` : undefined;

        const newFile: DocumentFile = {
            id: Date.now().toString(),
            name: picked.name || 'File',
            sizeLabel: sizeLabel,
            size: picked.size || 0,
            uri: picked.uri,
            mimeType: picked.type,
            source: picked.source,
        };

        setFiles(prev => [...prev, newFile]);
    };

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const onNext = () => {
        // Validate years of experience (required)
        if (!validateYearsOfExperience()) {
            return;
        }

        // Create qualification object
        // Files and details are optional
        const qualificationData: QualificationData = {
            qualification: files,
            years: years,
            details: details,
        };

        console.log('Qualification data:', qualificationData);
        showToast(t('professional_info_saved') || 'Professional information saved', { type: 'success' });

        createProviderAccount({
            ...createProviderInfo,
            stepThree: qualificationData,
        });
        // Navigate to next screen with qualification data
        navigation.navigate('SignupScreenFour');
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <AuthHeader
                        title={t('professional_info') || 'Professional Information'}
                        onBack={() => { }}
                    />

                    <View style={styles.headerRow}>
                        <StepProgress step={3} total={5} value={3} />
                    </View>

                    <View style={styles.titleRow}>
                        <H2 style={styles.labelTextAlignLeft} themeToken="text01">{t('professional_qualifications_title') || 'Professional Qualifications'}</H2>
                        <H5 style={styles.labelTextAlignLeft} themeShade={50} themeToken="text02">{t('professional_qualifications_subtitle') || 'Help clients trust you by verifying your skills and experience.'}</H5>
                    </View>

                    <View style={styles.form}>
                        <Text style={[styles.label, { color: typeof theme.text02 === 'function' ? (theme.text02 as any)(100) : (theme.text02 || '#94a3b8') }]}>{t('years_of_experience_label') || 'Years of Experience'} <Text style={styles.requiredAsterisk}>*</Text></Text>
                        <View style={styles.yearsRow}>
                            <AppTextInput
                                placeholder={t('years_placeholder') || 'e.g. 5'}
                                value={years}
                                onChangeText={(text) => {
                                    setYears(text);
                                    if (yearsError && text.trim()) {
                                        setYearsError('');
                                    }
                                }}
                                width="100%"
                                error={yearsError}
                            />
                            <View style={styles.yearsSuffix}><Text style={styles.yearsSuffixText}>{t('years_suffix') || 'Years'}</Text></View>
                        </View>

                        <View style={styles.spacer} />

                        <View style={styles.sectionHeaderRow}>
                            <Text style={[styles.sectionLabel, { color: typeof theme.text02 === 'function' ? (theme.text02 as any)(100) : (theme.text02 || '#94a3b8') }]}>{t('proficiency_certificates') || 'Proficiency Certificates'}</Text>
                            <Text style={styles.optionalLabel}>{t('optional') || 'Optional'}</Text>
                        </View>

                        <FileUploadCard
                            hint={t('upload_click_or_drag') as string}
                            maxSizeText={t('upload_file_types') || 'PDF, JPG, PNG (MAX. 5MB)'}
                            uploadType='image'
                            onPress={undefined}
                        />
                        <View style={{ marginTop: 8 }}>
                            <CommonUploadPicker
                                label={t('upload_click_or_drag') || 'Upload'}
                                onPicked={handlePicked}
                                onError={(e) => {
                                    console.warn('Upload error', e);
                                }}
                                enableCamera
                                enableImagePicker
                                enableFilePicker={Platform.OS !== 'ios'}
                            />
                        </View>

                        {files.map(f => (
                            <UploadedFileCard
                                key={f.id}
                                fileName={f.name}
                                fileSize={f.sizeLabel}
                                fileType={f.name.split('.').pop() || 'file'}
                                fileSource={f}
                                onRemove={() => removeFile(f.id)}
                            />
                        ))}

                        <View style={styles.spacer} />

                        <View style={styles.sectionHeaderRow}>
                            <Text style={[styles.sectionLabel, { color: typeof theme.text02 === 'function' ? (theme.text02 as any)(100) : (theme.text02 || '#94a3b8') }]}>{t('experience_details') || 'Experience Details'}</Text>
                            <Text style={styles.optionalLabel}>{t('optional') || 'Optional'}</Text>
                        </View>

                        <TextArea
                            placeholder={t('experience_details_placeholder') || 'Briefly describe your past projects, verify your skills, or list a reference...'}
                            value={details}
                            onChangeText={setDetails}
                            width="100%"
                            rows={6}
                            inputStyle={{}}
                        />
                    </View>

                    <View style={styles.footer}>
                        <ButtonV1 text={t('next_step') || 'Next Step'} onPress={onNext} containerStyle={styles.nextButton} />
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
    headerRow: { marginBottom: 8 },
    progressRow: { marginBottom: 8 },
    titleRow: { marginBottom: 18 },
    form: { marginTop: 4 },
    spacer: { height: 18 },
    label: { fontSize: 15, marginBottom: 8 },
    requiredAsterisk: { color: '#dc2626', fontWeight: '700' },
    yearsRow: { flexDirection: 'row', alignItems: 'center' },
    yearsSuffix: { position: 'absolute', right: 12, top: 14 },
    yearsSuffixText: { color: '#9aa6b6' },
    sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 8 },
    sectionLabel: { fontSize: 15, fontWeight: '600', textAlign: 'left' },
    optionalLabel: { fontSize: 13, color: '#94a3b8' },
    footer: { alignItems: 'center', justifyContent: 'flex-end', marginTop: 18 },
    nextButton: { width: '100%', height: 56, borderRadius: 12 },
    stepLabel: { marginBottom: 8 },
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
)(ServiceProviderCollectQulificationAuthScreen);
