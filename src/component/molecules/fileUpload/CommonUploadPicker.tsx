import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ReusableCamera from '@components/molecules/camera/ReusableCamera';
import { pickImage, pickDocument, NativePickedFile } from '../../../native/NativeFilePicker';

export type CommonPickedFile = {
    source: 'camera' | 'image' | 'file';
    uri: string;
    name?: string | null;
    type?: string | null;
    size?: number | null;
};

export type CommonUploadPickerProps = {
    onPicked: (file: CommonPickedFile) => void;
    onError?: (error: unknown) => void;
    label?: string;
    disabled?: boolean;
    enableCamera?: boolean;
    enableImagePicker?: boolean;
    enableFilePicker?: boolean;
};

const CommonUploadPicker: React.FC<CommonUploadPickerProps> = ({
    onPicked,
    onError,
    label = 'Upload',
    disabled = false,
    enableCamera = true,
    enableImagePicker = true,
    enableFilePicker = true,
}) => {
    const [chooserVisible, setChooserVisible] = useState(false);
    const [cameraVisible, setCameraVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const closeChooser = () => setChooserVisible(false);

    const handleNativeResult = (source: 'image' | 'file', picked: NativePickedFile) => {
        onPicked({
            source: source === 'image' ? 'image' : 'file',
            uri: picked.uri,
            name: picked.name,
            type: picked.type,
            size: picked.size,
        });
    };

    const handlePick = async (mode: 'image' | 'file') => {
        try {
            setLoading(true);
            closeChooser();
            const picked = mode === 'image' ? await pickImage() : await pickDocument();
            handleNativeResult(mode, picked);
        } catch (e: any) {
            // Ignore busy/cancel cases, report only real errors
            const code = e?.code ?? e?.message;
            if (
                code === 'PICKER_BUSY' ||
                code === 'IMAGE_PICKER_CANCELLED' ||
                code === 'DOCUMENT_PICKER_CANCELLED'
            ) {
                return;
            }
            onError?.(e);
        } finally {
            setLoading(false);
        }
    };

    const handleCameraDone = (r: { path: string; name?: string; size?: number }) => {
        if (!r?.path) {
            onError?.(new Error('Cannot find image data'));
            return;
        }

        const fileName = r.name || `photo_${Date.now()}.jpg`;

        onPicked({
            source: 'camera',
            uri: r.path,
            name: fileName,
            type: 'image/jpeg',
            size: r.size || null,

        });
        setCameraVisible(false);
    };

    return (
        <View style={styles.root}>
            <TouchableOpacity
                style={[styles.button, disabled && styles.buttonDisabled]}
                activeOpacity={0.8}
                onPress={() => !disabled && setChooserVisible(true)}
                disabled={disabled || loading}
            >
                <Icon name="tray-arrow-up" size={18} color="#FFFFFF" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>{label}</Text>
                {loading && <ActivityIndicator color="#FFFFFF" style={{ marginLeft: 8 }} />}
            </TouchableOpacity>

            {/* Option chooser */}
            <Modal
                visible={chooserVisible}
                animationType="fade"
                transparent
                onRequestClose={closeChooser}
            >
                <View style={styles.backdrop}>
                    <View style={styles.sheet}>
                        <Text style={styles.sheetTitle}>Choose upload type</Text>

                        {enableCamera && (
                            <TouchableOpacity
                                style={styles.optionRow}
                                activeOpacity={0.8}
                                onPress={() => {
                                    closeChooser();
                                    setCameraVisible(true);
                                }}
                            >
                                <Icon
                                    name="camera-outline"
                                    size={22}
                                    color="#22C55E"
                                    style={styles.optionIcon}
                                />
                                <View style={styles.optionTextWrap}>
                                    <Text style={styles.optionTitle}>Camera</Text>
                                    <Text style={styles.optionSubtitle}>Take a new photo</Text>
                                </View>
                            </TouchableOpacity>
                        )}

                        {enableImagePicker && (
                            <TouchableOpacity
                                style={styles.optionRow}
                                activeOpacity={0.8}
                                onPress={() => handlePick('image')}
                            >
                                <Icon
                                    name="image-outline"
                                    size={22}
                                    color="#3B82F6"
                                    style={styles.optionIcon}
                                />
                                <View style={styles.optionTextWrap}>
                                    <Text style={styles.optionTitle}>Image</Text>
                                    <Text style={styles.optionSubtitle}>
                                        Select a photo from gallery
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}

                        {enableFilePicker && (
                            <TouchableOpacity
                                style={styles.optionRow}
                                activeOpacity={0.8}
                                onPress={() => handlePick('file')}
                            >
                                <Icon
                                    name="file-document-outline"
                                    size={22}
                                    color="#F97316"
                                    style={styles.optionIcon}
                                />
                                <View style={styles.optionTextWrap}>
                                    <Text style={styles.optionTitle}>File (PDF)</Text>
                                    <Text style={styles.optionSubtitle}>Pick a document</Text>
                                </View>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={styles.cancelButton}
                            activeOpacity={0.8}
                            onPress={closeChooser}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Camera modal */}
            <Modal visible={cameraVisible} animationType="slide">
                <View style={{ flex: 1, backgroundColor: 'black' }}>
                    <ReusableCamera
                        initialCameraPosition="back"
                        onPhotoTaken={handleCameraDone}
                        onError={(e) => {
                            setCameraVisible(false);
                            onError?.(e);
                        }}
                        enableCrop
                        cropOptions={
                            { compressImageQuality: 1, cropping: true, }
                        }

                    />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        alignSelf: 'stretch',
    },
    button: {
        minHeight: 44,
        paddingHorizontal: 14,
        borderRadius: 10,
        backgroundColor: '#2563EB',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonIcon: {
        marginRight: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sheet: {
        width: '86%',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 18,
        backgroundColor: '#020617',
    },
    sheetTitle: {
        color: '#E5E7EB',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    optionIcon: {
        marginRight: 10,
    },
    optionTextWrap: {
        flex: 1,
    },
    optionTitle: {
        color: '#E5E7EB',
        fontSize: 14,
        fontWeight: '600',
    },
    optionSubtitle: {
        color: '#9CA3AF',
        fontSize: 12,
        marginTop: 2,
    },
    cancelButton: {
        marginTop: 10,
        alignSelf: 'flex-end',
        paddingVertical: 6,
        paddingHorizontal: 10,
    },
    cancelText: {
        color: '#9CA3AF',
        fontSize: 13,
    },
});

export default CommonUploadPicker;
