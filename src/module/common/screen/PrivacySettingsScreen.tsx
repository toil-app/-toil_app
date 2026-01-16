import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import SettingListItem from '../../../component/molecules/SettingListItem/SettingListItem';
import { H5, P } from '@components/atoms';
import { AuthHeader } from '@components/organisms/header';
import { Switch } from '@components/atoms/Switch/Switch';
import LocalStorage from '@core/service/LocalStorage.service';
import { StorageKey } from '@core/util/keys';
import { useCameraPermission } from 'react-native-vision-camera';


const PrivacySettingsScreen: React.FC = () => {
  const theme: any = useTheme();
  const { t } = useTranslation();

  const [personalized, setPersonalized] = useState<boolean>(true);
  const [analytics, setAnalytics] = useState<boolean>(false);
  const { hasPermission: cameraPermission, requestPermission: requestCameraPermission } = useCameraPermission();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const p = await LocalStorage.get(StorageKey.KEY_PERSONALIZED);
        const a = await LocalStorage.get(StorageKey.KEY_ANALYTICS);
        if (!mounted) return;
        if (p !== undefined && p !== null) setPersonalized(String(p) === 'true');
        if (a !== undefined && a !== null) setAnalytics(String(a) === 'true');
      } catch {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  const onTogglePersonalized = async (v: boolean) => {
    setPersonalized(v);
    try { await LocalStorage.set(StorageKey.KEY_PERSONALIZED, String(v)); } catch { /* ignore */ }
  };

  const onToggleAnalytics = async (v: boolean) => {
    setAnalytics(v);
    try { await LocalStorage.set(StorageKey.KEY_ANALYTICS, String(v)); } catch { /* ignore */ }
  };

  const onToggleCameraPermission = async (v: boolean) => {
    if (v && !cameraPermission) {
      try {
        await requestCameraPermission();
      } catch {
        // ignore
      }
    } else if (!v && cameraPermission) {
      Alert.alert(
        t('camera_permission_title') || 'Camera permission',
        t('camera_permission_os_only') || 'To fully disable camera access, please use your phone settings.'
      );
    }
  };

  const dynamic = StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.background02 ? theme.background02(100) : '#081421'
    },
    container: {
      paddingHorizontal: 20,
      paddingBottom: 40
    },
    sectionTitle: {
      marginTop: 10,
      marginBottom: 8,
      textAlign: 'left'
    },
    card: {
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.background02 ? theme.background02(25) : '#0b1220',
      backgroundColor: theme.background01 ? theme.background01(100) : '#0b1220'
    },
    divider: {
      height: 1,
      backgroundColor: theme.background02 ? theme.background02(20) : '#071723'
    },
    note: {
      marginTop: 12,
      color: theme.text02 ? theme.text02(60) : '#9aa6b3'
    },
    legalCard: {
      marginTop: 20,
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.background02 ? theme.background02(25) : '#0b1220',
      backgroundColor: theme.background01 ? theme.background01(100) : '#0b1220'
    }
  });

  const openPrivacyPolicy = () => {
    // TODO: wire to actual privacy policy URL or screen
  };

  return (
    <SafeAreaView style={dynamic.screen}>
      <ScrollView contentContainerStyle={dynamic.container}>
        <AuthHeader onBack={() => { }} title={t('privacy_settings') || 'Privacy Settings'} />

        <H5 style={dynamic.sectionTitle}>{t('data_and_permissions') || 'DATA & PERMISSIONS'}</H5>

        <View style={dynamic.card}>
          <SettingListItem
            icon="account-search"
            iconColor="#2563eb"
            title={t('personalized_data_usage') || 'Personalized Data Usage'}
            subtitle={t('personalized_data_usage_sub') || 'Allow customized content based on your activity'}
            rightComponent={<Switch value={personalized} onChange={onTogglePersonalized} />}
            iconBgStyle={{ backgroundColor: theme.background02 ? theme.background02(80) : '#071827' }}
          />
          <View style={dynamic.divider} />
          <SettingListItem
            icon="chart-bar"
            iconColor="#7c3aed"
            title={t('app_analytics_sharing') || 'App Analytics Sharing'}
            subtitle={t('app_analytics_sharing_sub') || 'Share anonymous usage data to improve the app'}
            rightComponent={<Switch value={analytics} onChange={onToggleAnalytics} />}
            iconBgStyle={{ backgroundColor: theme.background02 ? theme.background02(80) : '#071827' }}
          />
          <View style={dynamic.divider} />
          <SettingListItem
            icon="camera"
            iconColor="#f97316"
            title={t('camera_permission') || 'Camera Access'}
            subtitle={t('camera_permission_sub') || 'Allow the app to use your camera'}
            rightComponent={<Switch value={cameraPermission} onChange={onToggleCameraPermission} />}
            iconBgStyle={{ backgroundColor: theme.background02 ? theme.background02(80) : '#071827' }}
          />
        </View>

        <P style={dynamic.note}>{t('privacy_note') || 'Disabling these options may limit your experience. Your data is always handled securely.'}</P>

        <H5 style={dynamic.sectionTitle}>{t('legal') || 'LEGAL'}</H5>
        <TouchableOpacity activeOpacity={0.8} onPress={openPrivacyPolicy}>
          <View style={dynamic.legalCard}>
            <SettingListItem
              icon="shield-half-full"
              iconColor="#10b981"
              title={t('privacy_policy') || 'Privacy Policy'}
              subtitle={t('privacy_policy_sub') || 'Read our full privacy statement'}
              rightComponent={<Text style={{ color: theme.text02 ? theme.text02(60) : '#9aa6b3' }}>⤴</Text>}
              iconBgStyle={{ backgroundColor: theme.background02 ? theme.background02(80) : '#071827' }}
            />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacySettingsScreen;
