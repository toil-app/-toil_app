import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import FileUploadCard from '@components/molecules/card/FileUploadCard';
import CommonUploadPicker, {
    CommonPickedFile,
} from '@components/molecules/fileUpload/CommonUploadPicker';
import { ButtonV1 } from '@components/atoms/Button';
import { H2, H5, P } from '@components/atoms/Typhography/variants';
import { StepProgress } from '@components/molecules/Progress';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AuthHeader from '@components/organisms/header/AuthHeader';
import { useToast } from '@core/util/ToastProvider';
import { connect } from 'react-redux';
import { Actions } from '@core/modules/Actions';
import { CreateProviderData, CreateProviderStepTwo, DocumentFile } from '@core/models';

type ServiceProviderPersonalInfoCollectScreenProps = {
    createProviderInfo: CreateProviderData;
    createProviderAccount: (data: any) => void;
};

const ServiceProviderPersonalInfoCollectScreen: React.FC<ServiceProviderPersonalInfoCollectScreenProps> = ({ createProviderInfo, createProviderAccount }) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation<any>();
    const { showToast } = useToast();

    const [files, setFiles] = useState<
        Record<
            string,
            DocumentFile
        >
    >({});

    useEffect(() => {
        const stepTwoData = createProviderInfo?.stepTwo;
        if (stepTwoData) {
            setFiles({
                front_id: stepTwoData.frontId,
                back_id: stepTwoData.backId,
                birth_cert: stepTwoData.birthCertificate,
                address_proof: stepTwoData.addressProof,
            });
        }

    }, [createProviderInfo]);

    const bg = typeof theme.background02 === 'function' ? (theme.background02 as any)(100) : (theme.background02 || '#0f1720');

    const docItems = [
        { key: 'front_id', label: t('front_side_of_id') || 'Front side of ID Card', hint: t('upload_front') || 'Upload Front Side' },
        { key: 'back_id', label: t('back_side_of_id') || 'Back side of ID Card', hint: t('upload_back') || 'Upload Back Side' },
        { key: 'birth_cert', label: t('birth_certificate_photo') || 'Birth Certificate Photo', hint: t('upload_photo') || 'Upload Photo' },
        { key: 'address_proof', label: t('proof_of_permanent_address') || 'Proof of Permanent Address', hint: t('upload_address_proof') || 'Upload Address Proof' },
    ];

    const handlePicked = (docKey: string, picked: CommonPickedFile) => {
        const sizeLabel =
            picked.size != null ? `${(picked.size / (1024 * 1024)).toFixed(1)} MB` : undefined;
        console.log('Picked file:', picked);
        setFiles(prev => ({
            ...prev,
            [docKey]: {
                id: docKey,
                name: picked.name || '',
                uri: picked.uri,
                size: picked.size || null,
                sizeLabel: sizeLabel,
                mimeType: picked.type || '',
                source: picked.source,
            } as DocumentFile,
        }));
    };

    const onSubmit = () => {
        // Validate that ALL required documents are uploaded
        const requiredDocs = ['front_id', 'back_id', 'birth_cert', 'address_proof'];
        const missingDocs = requiredDocs.filter(key => !files[key]?.uri);

        if (missingDocs.length > 0) {
            showToast(
                t('all_documents_required') || 'Please upload all required documents to continue',
                { type: 'error' }
            );
            return;
        }

        // Create complete documents object with all uploaded files
        const documentsData: CreateProviderStepTwo = {
            frontId: files.front_id,
            backId: files.back_id,
            birthCertificate: files.birth_cert,
            addressProof: files.address_proof,
        };

        // showToast(t('submit_documents') || 'Documents submitted successfully', { type: 'success' });
        createProviderAccount({
            ...createProviderInfo,
            stepTwo: documentsData,
        });
        // Navigate to next screen with documents data
        navigation.navigate('SignupScreenThree');
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <AuthHeader
                        title={t('document_upload') || 'Document Upload'}
                        onBack={() => { }}
                    />
                    <View style={styles.headerRow}>
                        <StepProgress step={2} total={5} value={2} />
                    </View>

                    <View style={styles.titleRow}>
                        <H2 style={styles.textLeftAlign} themeToken="text01">{t('personal_documents_title') || 'Personal Documents'}</H2>
                        <H5 themeShade={50} style={styles.textLeftAlign} themeToken="text02">{t('personal_documents_subtitle') || 'Please upload clear photos of the following documents to verify your identity.'}</H5>
                    </View>

                    <View style={styles.form}>
                        {docItems.map(item => {
                            const file = files[item.key];
                            const isFile = file?.source === 'file';
                            const showImage = !isFile && file?.uri;

                            return (
                                <View key={item.key} style={styles.docBlock}>
                                    <P themeToken='text01' style={styles.docLabel}>{item.label}</P>
                                    <FileUploadCard
                                        hint={item.hint}
                                        maxSizeText={t('upload_file_types') || 'JPG, PNG'}
                                        uploadType={isFile ? 'file' : 'image'}
                                        imageUri={showImage ? file?.uri : null}
                                        fileName={file?.name || null}
                                        onPress={undefined}
                                    />
                                    <View style={{ marginTop: 8 }}>
                                        <CommonUploadPicker
                                            label={t('upload_photo') || 'Upload'}
                                            onPicked={(picked) => handlePicked(item.key, picked)}
                                            onError={(e) => {
                                                console.warn('Upload error', e);
                                            }}
                                            enableCamera
                                            enableImagePicker
                                            enableFilePicker={Platform.OS !== 'ios'}
                                        />
                                    </View>
                                </View>
                            );
                        })}

                        <View style={[styles.noteCard, { backgroundColor: typeof theme.background01 === 'function' ? (theme.background01 as any)(100) : (theme.background01 || '#07101a') }]}>
                            <View style={styles.noteLeft}>
                                <Icon name="lock-closed" size={20} color={typeof theme.primary01 === 'function' ? (theme.primary01 as any)(100) : (theme.primary01 || '#2b8cff')} />
                            </View>
                            <View style={styles.noteRight}>
                                <P size={14} themeToken='text01'>{t('doc_encrypted_note') || 'Your documents are encrypted and securely stored. We only use them for verification purposes.'}</P>
                            </View>
                        </View>

                    </View>

                    <View style={styles.footer}>
                        <ButtonV1 text={t('next_step') || 'Next Step'} onPress={onSubmit} containerStyle={styles.submitButton} />
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
    docBlock: { marginBottom: 18 },
    docLabel: { marginBottom: 8, fontSize: 15, textAlign: 'left' },
    label: { fontSize: 15, marginBottom: 8 },
    yearsRow: { flexDirection: 'row', alignItems: 'center' },
    sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 8 },
    sectionLabel: { fontSize: 15, fontWeight: '600' },
    optionalLabel: { fontSize: 13 },
    spacer: { height: 18 },
    footer: { alignItems: 'center', justifyContent: 'flex-end', marginTop: 18 },
    submitButton: { width: '100%', height: 56, borderRadius: 12 },
    stepLabel: { marginBottom: 8 },
    noteCard: { flexDirection: 'row', alignItems: 'flex-start', padding: 14, borderRadius: 10, marginTop: 18 },
    noteLeft: { width: 36, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    noteRight: { flex: 1 },
    textLeftAlign: { textAlign: 'left' },
});

export default connect(
    (state: any) => ({
        createProviderInfo: state.auth.get('createProviderInfo'),
    }),
    {
        createProviderAccount: Actions.auth.createProviderAccount
    }
)(ServiceProviderPersonalInfoCollectScreen);
