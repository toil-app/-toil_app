import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { TextInput as AppTextInput } from '@components/atoms/TextInput';
import { ButtonV1, H5, P } from '@components/atoms';
import { AuthHeader } from '@components/organisms/header';
import { relativeHeight } from '@core/util/Theme/layout';
// import LocalStorage from '@core/service/LocalStorage.service';

// const PROFILE_FIRST = 'profile_first_name';
// const PROFILE_LAST = 'profile_last_name';

const ProfileDetailsScreen: React.FC = () => {
    const theme: any = useTheme();
    const { t } = useTranslation();

    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [_saving, setSaving] = useState<boolean>(false);
    const [phoneNumber, _setPhoneNumber] = useState<string>('+1 (555) 123-4567'); // Static for preview purposes

    // useEffect(() => {
    // let mounted = true;
    // (async () => {
    //     try {
    //         const f = await LocalStorage.get(PROFILE_FIRST);
    //         const l = await LocalStorage.get(PROFILE_LAST);
    //         if (!mounted) return;
    //         if (f) setFirstName(JSON.parse(f));
    //         if (l) setLastName(JSON.parse(l));
    //     } catch {
    //         // ignore
    //     }
    // })();
    // return () => { mounted = false; };
    // }, []);

    const onSave = async () => {
        setSaving(true);
        // try {
        //     await LocalStorage.set(PROFILE_FIRST, firstName);
        //     await LocalStorage.set(PROFILE_LAST, lastName);
        // } catch {
        //     // ignore
        // }
        setSaving(false);
    };

    const dynamic = StyleSheet.create({
        screen: {
            flex: 1,
            backgroundColor: theme.background02 ? theme.background02(100) : '#081421'
        },
        container: {
            paddingHorizontal: 20,
            paddingBottom: 120
        },
        sectionTitle: {
            marginTop: 10,
            marginBottom: 8,
            textAlign: 'left'
        },
        inputRow: {
            marginTop: 16,
        },
        previewLabel: {
            marginTop: 20,
            marginBottom: 10,
            textAlign: 'left'
        },
        previewCard: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 12,
            padding: 16,
            backgroundColor: theme.background01 ? theme.background01(100) : '#0b1220',
            borderWidth: 1,
            borderColor: theme.background02 ? theme.background02(25) : '#0b1220'
        },
        avatar: {
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: theme.primary01 ? theme.primary01(100) : '#2563eb',
            marginRight: 16,
            justifyContent: 'center',
            alignItems: 'center'
        },
        avatarText: {
            color: theme.text01 ? theme.text01(100) : '#fff',
            fontWeight: '700'
        },
        previewName: {
            fontWeight: '700',
            color: theme.text01 ? theme.text01(100) : '#fff'
        },
        activeBadge: {
            marginLeft: 'auto',
            backgroundColor: theme.positive ? theme.positive(100) : '#10b981',
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 8
        },
        activeText: {
            color: '#fff',
            fontWeight: '700'
        },
        saveWrap: {
            // position: 'absolute',
            // left: 20,
            // right: 20,
            // bottom: 20,
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingBottom: 50,
            justifyContent: 'center',
            marginTop: relativeHeight(40)
        }
    });



    return (
        <SafeAreaView style={dynamic.screen}>
            <ScrollView contentContainerStyle={dynamic.container}>
                <AuthHeader onBack={() => { }} title={t('edit_profile') || 'Profile Details'} />

                <H5 style={dynamic.sectionTitle}>{t('personal_details_title') || 'Profile Details'}</H5>

                <View style={dynamic.inputRow}>
                    <AppTextInput
                        label={t('first_name_label') || 'First Name'}
                        placeholder={t('first_name_placeholder') || ''}
                        value={firstName}
                        onChangeText={setFirstName}
                        inputStyle={{ width: '100%' }}
                        width="100%" />
                </View>

                <View style={dynamic.inputRow}>
                    <AppTextInput
                        label={t('last_name_label') || 'Last Name'}
                        placeholder={t('last_name_placeholder') || ''}
                        value={lastName}
                        onChangeText={setLastName}
                        width="100%" />
                </View>

                <P style={dynamic.previewLabel}>{t('live_preview') || 'LIVE PREVIEW'}</P>

                <View style={dynamic.previewCard}>
                    <View style={dynamic.avatar}>
                        <P style={dynamic.avatarText}>{(firstName || lastName) ? (firstName?.charAt(0) || lastName?.charAt(0) || '').toUpperCase() : '?'}</P>
                    </View>
                    <P style={dynamic.previewName}>{phoneNumber}</P>
                    <View style={dynamic.activeBadge}>
                        <P style={dynamic.activeText}>{t('confirmed') || 'ACTIVE'}</P>
                    </View>
                </View>

                <View style={dynamic.saveWrap}>
                    <ButtonV1
                        containerStyle={{ width: '100%', alignSelf: 'center', height: 52, borderRadius: 12 }}
                        text={t('save_changes') || 'Save Changes'}
                        onPress={onSave} />
                </View>

            </ScrollView>


        </SafeAreaView>
    );
};

export default ProfileDetailsScreen;
