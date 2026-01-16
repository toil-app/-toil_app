import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, ScrollView, Modal, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import { P, H4, H5 } from '@components/atoms/Typhography/variants';
import { ButtonV1 } from '@components/atoms/Button';
import { AuthHeader } from '@components/organisms/header';
import StepProgress from '@components/molecules/Progress/StepProgress';
import ReusableCamera from '@components/molecules/camera/ReusableCamera';
import { relativeWidth } from '@core/util/Theme/layout';
import { useToast } from '@core/util/ToastProvider';
import { DocumentFile, CreateProviderStepFive, CreateProviderData } from '@core/models';
import { connect } from 'react-redux';
import { Actions } from '@core/modules/Actions';

type ServiceProviderIdentifingScreenProps = {
    createProviderInfo: CreateProviderData;
    createProviderAccount: (data: any) => void;
};

const ServiceProviderIdentifingScreen: React.FC<ServiceProviderIdentifingScreenProps> = ({ createProviderAccount, createProviderInfo }) => {
    const theme: any = useTheme();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const { showToast } = useToast();
    const [showCamera, setShowCamera] = useState(false);
    const [selfiePath, setSelfiePath] = useState<string | null>(null);
    const [selfi, setSelfi] = useState<DocumentFile | null>(null);

    const bg = typeof theme.background02 === 'function' ? (theme.background02 as any)(100) : (theme.background02 || '#0f1720');
    const panelBg = typeof theme.background01 === 'function' ? theme.background01(100) : '#14202b';
    const textSecondary = typeof theme.text02 === 'function' ? (theme.text02 as any)(100) : (theme.text02 || '#9aa6b6');

    useEffect(() => {
        const stepFiveData = createProviderInfo?.stepFive;
        if (stepFiveData) {
            if (stepFiveData.selfi) {
                setSelfi(stepFiveData.selfi);
                // Assuming stepFiveData.selfi has a 'path' property
                setSelfiePath(stepFiveData.selfi.uri || null);
            }
        }

    }, [createProviderInfo]);

    const handleSubmit = () => {
        if (!selfiePath || !selfi) {
            showToast(
                'selfie_required',
                { type: 'error' }
            );
            return;
        }

        const data: CreateProviderStepFive = {
            selfi: selfi,
        }
        // Log selfie file path to console
        console.log('Submitting selfie:', data);
        createProviderAccount({
            ...createProviderInfo,
            stepFive: data,
        });
        // showToast(t('selfie_submitted') || 'Selfie submitted successfully', { type: 'success' });
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]}>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <AuthHeader
                    title={t('identity_verification_title') || 'Identity Verification'}
                    onBack={() => { }}
                />

                <View style={styles.headerRow}>
                    <StepProgress step={5} total={5} value={5} />
                </View>

                <View style={styles.titleBlock}>
                    <H4 themeToken='text01' style={[styles.title, styles.labelTextAlignLeft]}>{t('take_a_selfie') || 'Take a Selfie'}</H4>
                    <P size={14} themeShade={75} style={[styles.subtitle, styles.labelTextAlignLeft]}>{t('selfie_instructions') || "We need to verify it's really you. Please take a clear photo of your face."}</P>
                </View>

                <View style={[styles.previewWrap, { borderColor: panelBg }]}>
                    {/* camera preview placeholder */}
                    <View style={[styles.cameraPreview, { backgroundColor: panelBg }]}>
                        <View style={styles.oval}>
                            {selfiePath ? (
                                <Image source={{ uri: selfiePath }} style={styles.selfieImage} />
                            ) : (
                                // small avatar icon center
                                <Icon name="person-circle-outline" size={64} color={textSecondary} />
                            )}
                        </View>

                        <TouchableOpacity
                            style={[styles.captureBtn, { backgroundColor: typeof theme.primary01 === 'function' ? theme.primary01(125) : theme.primary01 }]}
                            activeOpacity={0.9}
                            onPress={() => setShowCamera(true)}
                        >
                            <View style={styles.captureInner} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.checklistWrap}>
                    <View style={styles.checkRow}>
                        <View style={styles.checkIcon}><Icon name="checkmark-circle" size={20} color={typeof theme.primary01 === 'function' ? theme.primary01(100) : '#3B82F6'} /></View>
                        <P size={13} themeShade={75} style={styles.checkText}>{t('ensure_face_well_lit') || 'Ensure your face is well-lit and centered.'}</P>
                    </View>

                    <View style={styles.checkRow}>
                        <View style={styles.checkIcon}><Icon name="checkmark-circle" size={20} color={typeof theme.primary01 === 'function' ? theme.primary01(100) : '#3B82F6'} /></View>
                        <P size={13} themeShade={75} style={styles.checkText}>{t('no_hats_masks') || 'No hats, sunglasses, or masks.'}</P>
                    </View>
                </View>

                <TouchableOpacity style={styles.retakeWrap} onPress={() => { }} activeOpacity={0.8}>
                    <Icon name="refresh-circle" size={30} color={typeof theme.button02 === 'function' ? theme.button02(100) : '#3B82F6'} />
                    <H5 themeToken='text01' style={styles.retakeText}>{t('retake_photo') || 'Retake Photo'}</H5>
                </TouchableOpacity>

                <View style={[styles.footer, { marginBottom: insets.bottom + 100 }]}>
                    <ButtonV1 text={t('create_account') || 'Submit Selfie'} onPress={handleSubmit} containerStyle={styles.submitBtn} />
                </View>
            </ScrollView>

            {/* Fullscreen camera modal for selfie capture (front camera) */}
            <Modal visible={showCamera} animationType="slide">
                <View style={{ flex: 1, backgroundColor: 'black' }}>
                    <ReusableCamera
                        initialCameraPosition="front"
                        onPhotoTaken={(file: any) => {
                            const path = Platform.OS === 'ios' ? file.path : 'file://' + file.path;
                            setSelfiePath(path);
                            console.log(file, 'Selfie captured:', path);
                            setShowCamera(false);
                            setSelfi({ ...file, path });
                        }}
                        onError={() => {
                            setShowCamera(false);
                            console.log('Camera error occurred');
                        }}
                        enableCrop
                    />
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingTop: 8, flexGrow: 1 },
    headerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
    backBtn: { padding: 8, marginRight: 8 },
    headerTitle: { flex: 1, textAlign: 'center', marginRight: 36, lineHeight: 60 },
    progressRow: { alignItems: 'center', marginTop: 8 },
    dotsRow: { flexDirection: 'row', gap: 8, alignItems: 'center' } as any,
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2B3940', marginHorizontal: 4 },
    dotActive: { backgroundColor: '#2B90FF', width: 22, height: 8, borderRadius: 6 },
    titleBlock: { marginTop: 18, marginBottom: 12 },
    title: { fontSize: 28, fontWeight: '700' },
    subtitle: { textAlign: 'center', marginTop: 8, maxWidth: 320 },
    previewWrap: { marginTop: 18, borderWidth: 1.5, borderStyle: 'dashed', borderRadius: 12, padding: 12, height: 420, justifyContent: 'center', alignItems: 'center' },
    cameraPreview: { width: '100%', height: '100%', borderRadius: 8, justifyContent: 'center', alignItems: 'center', position: 'relative' },
    oval: { width: relativeWidth(150), height: relativeWidth(150), borderRadius: relativeWidth(150), borderWidth: 2, borderColor: '#25507A', justifyContent: 'center', alignItems: 'center' },
    selfieImage: {
        width: '100%',
        height: '100%',
        borderRadius: 9999,
        resizeMode: 'cover',
    },
    captureBtn: { position: 'absolute', bottom: 22, alignSelf: 'center', width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 6, elevation: 6 },
    captureInner: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#fff', opacity: 0.9 },
    checklistWrap: { marginTop: 18 },
    checkRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent', paddingVertical: 12, paddingHorizontal: 8, borderRadius: 10, marginBottom: 10 },
    checkIcon: { width: 32, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    checkText: { flex: 1, textAlign: 'left' },
    retakeWrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12 },
    retakeText: { marginLeft: 6, color: '#2B90FF', fontWeight: '700' },
    footer: { marginTop: 18, marginBottom: Platform.OS === 'ios' ? 34 : 18 },
    submitBtn: { width: '100%', height: 56, borderRadius: 12 },
    labelTextAlignLeft: { textAlign: 'left' },
});

export default connect(
    (state: any) => ({
        createProviderInfo: state.auth.get('createProviderInfo'),
    }),
    {
        createProviderAccount: Actions.auth.createProviderAccount
    }
)(ServiceProviderIdentifingScreen);
