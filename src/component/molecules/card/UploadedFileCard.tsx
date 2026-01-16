import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { P } from '@components/atoms';
import Icon from "react-native-vector-icons/MaterialIcons";


export type Props = {
    fileName: string;
    fileSize?: string;
    uploadedAt?: string;
    onRemove?: () => void;
    fileType?: string;
    fileSource?: any;
};

const UploadedFileCard: React.FC<Props> = ({ fileName, fileSize, uploadedAt, onRemove, fileType, fileSource }) => {
    const theme = useTheme();
    const bg = theme.background01(100);
    const isPdf = (fileType || '').toLowerCase().includes('pdf');

    return (
        <View style={[styles.container, { backgroundColor: bg }]}>
            <View style={styles.left}>
                {isPdf ? (
                    <View style={styles.pdfBadge}>
                        <P style={styles.pdfText}>PDF</P>
                    </View>
                ) : fileSource?.uri ? (
                    <Image source={{ uri: fileSource.uri }} style={styles.previewImage} />
                ) : (
                    <View style={styles.pdfBadge}>
                        <P style={styles.pdfText}>FILE</P>
                    </View>
                )}
                <View style={styles.meta}>
                    <P themeToken='text01' style={styles.fileName} numberOfLines={1}>{fileName}</P>
                    <P themeToken='text02' style={styles.fileMeta}>{fileSize || ''}{uploadedAt ? ` • ${uploadedAt}` : ''}</P>
                </View>
            </View>
            <TouchableOpacity onPress={onRemove} style={styles.removeBtn} accessibilityLabel="Remove file">
                <Icon color={theme.text01(75)} name="delete" style={styles.removeText} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, marginTop: 12 },
    left: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    pdfBadge: { width: 44, height: 44, borderRadius: 8, backgroundColor: '#2b3140', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    pdfText: { color: '#fef3f2', fontWeight: '700' },
    previewImage: { width: 44, height: 44, borderRadius: 8, marginRight: 12 },
    meta: { flex: 1 },
    fileName: { fontSize: 15, fontWeight: '600' },
    fileMeta: { fontSize: 13, marginTop: 4 },
    removeBtn: { padding: 6 },
    removeText: { fontSize: 18 },
});

export default UploadedFileCard;
