import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { Camera, useCameraDevices, PhotoFile, useCameraPermission } from 'react-native-vision-camera';
import ImageCropPicker from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Minimal crop options type (only what we actually use)
type CropOptions = {
    cropping?: boolean;
    compressImageQuality?: number;
    cropperToolbarTitle?: string;
    // allow passing through any other supported options if needed
    [key: string]: any;
};

export interface ReusableCameraResult {
    path: string;
}

export interface ReusableCameraProps {
    onPhotoTaken: (result: ReusableCameraResult) => void;
    onError?: (error: unknown) => void;
    enableCrop?: boolean;
    cropOptions?: Partial<CropOptions>;
    initialCameraPosition?: 'back' | 'front'

    maxPhotoSize?: number;
}

const ReusableCamera: React.FC<ReusableCameraProps> = ({
    onPhotoTaken,
    onError,
    enableCrop = true,
    cropOptions,
    initialCameraPosition = 'back',
}) => {
    const devices = useCameraDevices();
    const [position, setPosition] = useState<'back' | 'front'>(initialCameraPosition);
    const device = devices.find((d) => d.position === position);

    const cameraRef = useRef<Camera | null>(null);
    const { hasPermission, requestPermission } = useCameraPermission();
    const [isBusy, setIsBusy] = useState(false);
    const [flashMode, setFlashMode] = useState<'off' | 'on'>('off');

    // (optional) side‑effect on permission error
    useEffect(() => {
        if (!hasPermission) {
            // you can log/track this if needed
        }
    }, [hasPermission]);

    const toggleCamera = useCallback(() => {
        setPosition((prev) => (prev === 'back' ? 'front' : 'back'));
    }, []);

    const toggleFlash = useCallback(() => {
        setFlashMode((prev) => (prev === 'off' ? 'on' : 'off'));
    }, []);

    const handleTakePhoto = useCallback(async () => {
        console.log('Taking photo...');
        if (!cameraRef.current || !device || isBusy) return;
        try {
            setIsBusy(true);
            const photo: PhotoFile = await cameraRef.current.takePhoto({
                flash: flashMode,
            });
            console.log('Photo taken:', photo);

            if (!photo?.path) {
                throw new Error('Photo path missing');
            }

            // Use temp directory accessible on both platforms
            const tempPath = `${RNFS.TemporaryDirectoryPath}/photo_${Date.now()}.jpg`;
            await RNFS.copyFile(photo.path, tempPath);

            let finalPath = `file://${tempPath}`;

            if (enableCrop) {
                try {
                    const cropped = await ImageCropPicker.openCropper({
                        path: tempPath, // NO file:// prefix for cropper
                        mediaType: 'photo',
                        cropping: true,
                        compressImageQuality: 0.9,
                        cropperToolbarTitle: 'Crop Photo',
                        cropperChooseText: 'Done',
                        cropperCancelText: 'Cancel',
                        showCropGuidelines: true,
                        enableRotationGesture: true,
                        showCropFrame: true,
                        ...cropOptions,
                    });

                    finalPath = cropped.path.startsWith('file://')
                        ? cropped.path
                        : `file://${cropped.path}`;
                } catch (cropError: any) {
                    console.warn('Crop cancelled or failed, using original photo:', cropError);
                    // Keep the formatted finalPath with file:// prefix
                }
            }

            console.log('Final image path:', finalPath);
            onPhotoTaken({ path: finalPath });
        } catch (e) {
            console.error('Error taking photo:', e);
            onError?.(e);
        } finally {
            setIsBusy(false);
        }
    }, [device, enableCrop, cropOptions, isBusy, flashMode, onError, onPhotoTaken]);

    if (!hasPermission) {
        return (
            <View style={styles.centered}>
                <Text style={styles.infoText}>Camera permission is required.</Text>
                <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                    <Text style={styles.permissionButtonText}>Enable camera</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!device) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Camera
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive
                photo

            />

            {/* Top-left flash control */}
            <View style={styles.topLeftControls}>
                <TouchableOpacity
                    onPress={toggleFlash}
                    style={[
                        styles.iconButton,
                        flashMode === 'on' && styles.iconButtonActive
                    ]}
                >
                    <Icon
                        name={flashMode === 'on' ? 'flash' : 'flash-off'}
                        size={26}
                        color={flashMode === 'on' ? '#FFD700' : '#FFFFFF'}
                    />
                </TouchableOpacity>
            </View>

            {/* Top-right switch camera */}
            <View style={styles.topRightControls}>
                <TouchableOpacity onPress={toggleCamera} style={styles.iconButton}>
                    <Icon name="camera-switch" size={26} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {/* Flash indicator */}
            {flashMode === 'on' && (
                <View style={styles.flashIndicator}>
                    <Text style={styles.flashIndicatorText}>Flash ON</Text>
                </View>
            )}

            {/* Bottom capture bar */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.captureButtonOuter}
                    onPress={handleTakePhoto}
                    disabled={isBusy}
                >
                    <View style={styles.captureButtonInner} />
                </TouchableOpacity>
            </View>

            {isBusy && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator color="#FFFFFF" />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        overflow: 'hidden',
        borderRadius: 12,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    infoText: {
        color: '#FFFFFF',
        textAlign: 'center',
    },
    permissionButton: {
        marginTop: 16,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#3B82F6',
    },
    permissionButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    topLeftControls: {
        position: 'absolute',
        top: 24,
        left: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    topRightControls: {
        position: 'absolute',
        top: 24,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconButtonActive: {
        backgroundColor: 'rgba(255, 215, 0, 0.3)',
    },
    flashIndicator: {
        position: 'absolute',
        top: 80,
        left: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 215, 0, 0.4)',
        borderWidth: 1,
        borderColor: '#FFD700',
    },
    flashIndicatorText: {
        color: '#FFD700',
        fontSize: 12,
        fontWeight: '600',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 32,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    captureButtonOuter: {
        width: 78,
        height: 78,
        borderRadius: 39,
        borderWidth: 4,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    captureButtonInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FFFFFF',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.35)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ReusableCamera;
