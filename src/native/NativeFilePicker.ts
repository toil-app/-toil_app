import { Platform, PermissionsAndroid, InteractionManager } from 'react-native';
import { pick, types } from '@react-native-documents/picker';
import {
  launchImageLibrary,
  ImageLibraryOptions,
  Asset,
} from 'react-native-image-picker';

export type NativePickedFile = {
  uri: string;
  name?: string | null;
  type?: string | null;
  size?: number | null;
};

let pickerPromise: Promise<any> | null = null;
let iosNativeBusy = false;

const IOS_RELEASE_DELAY = 600;

async function runWithPickerLock<T>(fn: () => Promise<T>): Promise<T> {
  if (pickerPromise) {
    throw new Error('PICKER_BUSY');
  }

  pickerPromise = new Promise<T>(async (resolve, reject) => {
    try {
      // Wait until navigation + UI is settled
      await new Promise<void>(res =>
        InteractionManager.runAfterInteractions(() => res()),
      );

      const result = await fn();
      resolve(result);
    } catch (e) {
      reject(e);
    }
  });

  try {
    return await pickerPromise;
  } finally {
    if (Platform.OS === 'ios') {
      setTimeout(() => {
        pickerPromise = null;
      }, IOS_RELEASE_DELAY);
    } else {
      pickerPromise = null;
    }
  }
}

/**
 * Android gallery permission
 */
async function ensureImagePermissionAndroid() {
  if (Platform.OS !== 'android') return;

  const sdk = Platform.Version as number;
  const perm =
    sdk >= 33
      ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

  const granted = await PermissionsAndroid.check(perm);
  if (!granted) {
    await PermissionsAndroid.request(perm);
  }
}

/**
 * IMAGE PICKER (SAFE)
 */
export function pickImage(): Promise<NativePickedFile> {
  return runWithPickerLock(async () => {
    await ensureImagePermissionAndroid();

    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 1,
      presentationStyle: 'fullScreen',
    };

    const res = await launchImageLibrary(options);

    if (res.didCancel) {
      throw new Error('IMAGE_PICKER_CANCELLED');
    }

    const asset: Asset | undefined = res.assets?.[0];
    if (!asset?.uri) {
      throw new Error('IMAGE_PICKER_NO_ASSET');
    }

    return {
      uri: asset.uri,
      name: asset.fileName ?? null,
      type: asset.type ?? null,
      size: asset.fileSize ?? null,
    };
  });
}

/**
 * DOCUMENT PICKER (CRASH-FREE ON iOS)
 */
export async function pickDocument(): Promise<NativePickedFile> {
  console.log('pickDocument called');

  if (Platform.OS === 'ios' && iosNativeBusy) {
    throw new Error('PICKER_BUSY');
  }

  return runWithPickerLock(async () => {
    if (Platform.OS === 'ios') iosNativeBusy = true;

    try {
      const results = await pick({
        mode: 'open',
        type: [types.pdf],
        presentationStyle: 'fullScreen',
        multiple: false,
      });

      const doc = Array.isArray(results) ? results[0] : results;

      if (!doc?.uri) throw new Error('DOCUMENT_PICKER_NO_FILE');

      return {
        uri: doc.uri,
        name: doc.name ?? null,
        type: doc.type ?? null,
        size: doc.size ?? null,
      };
    } catch (e: any) {
      // Handle native “promise did not settle” warning gracefully
      if (
        Platform.OS === 'ios' &&
        typeof e?.message === 'string' &&
        e.message.includes('previous promise did not settle')
      ) {
        throw new Error('PICKER_BUSY');
      }
      throw e;
    } finally {
      if (Platform.OS === 'ios') {
        setTimeout(() => {
          iosNativeBusy = false;
        }, 700); // give native VC time to dealloc safely
      }
    }
  });
}
