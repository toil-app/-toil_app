import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ActivityIndicator,
} from 'react-native';
// Native file picker wrapper (Android/iOS native module)
import { pickImage, pickDocument } from '../../../native/NativeFilePicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export type PickedFile = {
    uri: string;
    name?: string | null;
    type?: string | null;
    size?: number | null;
};

export type FileUploadPickerProps = {
    /** Called when user successfully picks any file (image or pdf) */
    onFilePicked: (file: PickedFile) => void;
    /** Optional error callback */
    onError?: (error: unknown) => void;
    /** Optional label for main button */
    label?: string;
    /** Optional: disable component */
    disabled?: boolean;
};

const FileUploadPicker: React.FC<FileUploadPickerProps> = ({
    onFilePicked,
    onError,
    label = 'Upload file',
    disabled = false,
}) => {
    const [chooserVisible, setChooserVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const closeChooser = () => setChooserVisible(false);

    const handlePick = async (mode: 'image' | 'pdf') => {
        try {
            setLoading(true);
            closeChooser();

            const picked = mode === 'image' ? await pickImage() : await pickDocument();

            const file: PickedFile = {
                uri: picked.uri,
                name: picked.name,
                type: picked.type,
                size: picked.size,
            };
            onFilePicked(file);
        } catch (e) {
            onError?.(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.root}>
            <TouchableOpacity
                style={[styles.button, disabled && styles.buttonDisabled]}
                activeOpacity={0.8}
                onPress={() => !disabled && setChooserVisible(true)}
                disabled={disabled || loading}
            >
                <Icon name="paperclip" size={18} color="#FFFFFF" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>{label}</Text>
                {loading && <ActivityIndicator color="#FFFFFF" style={{ marginLeft: 8 }} />}
            </TouchableOpacity>

            <Modal
                visible={chooserVisible}
                animationType="fade"
                transparent
                onRequestClose={closeChooser}
            >
                <View style={styles.backdrop}>
                    <View style={styles.sheet}>
                        <Text style={styles.sheetTitle}>Choose file type</Text>

                        <TouchableOpacity
                            style={styles.optionRow}
                            activeOpacity={0.8}
                            onPress={() => handlePick('image')}
                        >
                            <Icon name="image-outline" size={22} color="#3B82F6" style={styles.optionIcon} />
                            <View style={styles.optionTextWrap}>
                                <Text style={styles.optionTitle}>Image</Text>
                                <Text style={styles.optionSubtitle}>Select photo from gallery</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.optionRow}
                            activeOpacity={0.8}
                            onPress={() => handlePick('pdf')}
                        >
                            <Icon name="file-pdf-box" size={22} color="#EF4444" style={styles.optionIcon} />
                            <View style={styles.optionTextWrap}>
                                <Text style={styles.optionTitle}>Document (PDF)</Text>
                                <Text style={styles.optionSubtitle}>Pick a PDF file</Text>
                            </View>
                        </TouchableOpacity>

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

export default FileUploadPicker;
