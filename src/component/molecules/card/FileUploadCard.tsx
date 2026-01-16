import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import Icon from "react-native-vector-icons/Ionicons";
import { H5, P } from '@components/atoms';

export type Props = {
    onPress?: () => void;
    hint?: string;
    maxSizeText?: string;
    uploadType?: 'file' | 'image';
    imageUri?: string | null;
    fileName?: string | null;
};

const FileUploadCard: React.FC<Props> = ({
    onPress,
    hint,
    maxSizeText,
    uploadType = 'file',
    imageUri = null,
    fileName = null,
}) => {
    const theme = useTheme();
    const { t } = useTranslation();

    // Resolve theme tokens to color strings in a safe way (some tokens are functions).
    // Coerce to string to satisfy React Native style types.

    const textPrimary = (typeof theme.primary01 === 'function' ? (theme.primary01 as any)(100) : (theme.primary01 || '#2b8cff')) as string;

    return (
        <TouchableOpacity
            activeOpacity={0.85}
            onPress={onPress}
            style={[styles.container, { borderColor: theme.background01(100) }]}
        >
            <View style={styles.inner}>
                {uploadType === 'image' && imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="cover" />
                ) : (
                    <View style={styles.iconBox}>
                        {
                            <Icon name={uploadType === 'image' && imageUri ? 'image' : 'cloud-upload'} style={[styles.icon, { color: textPrimary }]} />}
                        {uploadType === 'file' && fileName && (
                            <H5 themeToken="text01" style={styles.fileNameText}>
                                {fileName}
                            </H5>
                        )}
                    </View>
                )}

                {!fileName && <P themeToken='text02' style={[styles.hintText]}>{hint || t('upload_click_or_drag', 'Click to upload or drag and drop')}</P>}
                {maxSizeText ? <P themeToken='text01' style={styles.maxText}>{maxSizeText}</P> : null}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 2,
        borderStyle: 'dashed',
        borderRadius: 12,
        paddingVertical: 28,
        paddingHorizontal: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inner: { alignItems: 'center' },
    iconBox: { marginBottom: 10, alignItems: 'center' },
    icon: { fontSize: 28 },
    imagePreview: { width: 220, height: 120, borderRadius: 8, marginBottom: 12 },
    hintText: { fontSize: 16, fontWeight: '600' },
    maxText: { fontSize: 12, marginTop: 6 },
    fileNameText: { marginTop: 6, backgroundColor: 'rgba(0,0,0,0.05)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
});

export default FileUploadCard;
