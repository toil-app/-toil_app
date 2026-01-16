import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Images } from '@assets/images';
import { ButtonV1 } from '@components/atoms/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Asset_V3 } from '@components/atoms';
import LanguageDropdown from '@components/atoms/Dropdown/LanguageDropdown';
import { useTranslation } from 'react-i18next';
import { H4, P } from '@components/atoms/Typhography/variants';
import { relativeHeight, relativeWidth } from '@core/util/Theme/layout';
import { Button2 } from '@components/atoms/Button/Button2';
import { useNavigation } from '@react-navigation/native';
import { UserRole } from '@core/models/User';
import { connect } from 'react-redux';
import Actions from '@core/modules/Actions';

type InitatieScreenProps = {
    userType: string;
    setUserType: (userType: string) => void;
};

const InitatieScreen: React.FC<InitatieScreenProps> = ({ setUserType }) => {
    const theme = useTheme();
    const navigation = useNavigation<any>();

    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const HERO_BASE_HEIGHT = relativeHeight(370);

    const onClient = () => {
        if (!UserRole?.CLIENT) {
            console.error('UserRole.CLIENT is undefined', UserRole);
            return;
        }
        setUserType(UserRole.CLIENT);
        navigation.navigate('LoginScreen', { userType: UserRole.CLIENT });
    };

    const onProvider = () => {
        if (!UserRole?.PROVIDER) {
            console.error('UserRole.PROVIDER is undefined');
            return;
        }
        setUserType(UserRole.PROVIDER);
        navigation.navigate('LoginScreen', { userType: UserRole.PROVIDER });
    };

    const backgroundColor =
        typeof theme.background02 === 'function' ? theme.background02(100) : (theme.background02 as any) || '#111722';

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor }]}>
            <View style={styles.container}>
                <Asset_V3
                    source={Images.sa_initiate}
                    style={[
                        styles.hero,
                        { height: HERO_BASE_HEIGHT + insets.top, marginTop: -insets.top },
                    ]}
                    resizeMode="cover"
                >
                    <View style={styles.langRow}>
                        <LanguageDropdown boxHeight={30} />
                    </View>

                </Asset_V3>

                <View style={styles.card}>

                    <H4 themeToken="text01" style={styles.title}>{t('title')}</H4>
                    <P themeToken="text01" style={styles.subtitle}>
                        {t('subtitle')}
                    </P>

                    <View style={styles.actions}>
                        <ButtonV1
                            text={t('client')}
                            onPress={onClient}
                            containerStyle={styles.clientButton}
                        />

                        <Button2
                            text={t('provider')}
                            onPress={onProvider}
                            containerStyle={styles.providerButton}
                        />
                    </View>

                </View>
            </View>
        </SafeAreaView>
    );
};

export default connect(
    (state: any) => ({
        auth: state.auth.get('userType'),
    }),
    {
        setUserType: Actions.auth.setUserType,
    }
)(InitatieScreen);

const styles = StyleSheet.create({
    safe: { flex: 1 },
    container: { flex: 1 },
    hero: {
        width: '100%',
        height: 370,
        backgroundColor: '#ddd',
    },
    card: {
        flex: 1,
        paddingHorizontal: relativeWidth(24),
        paddingTop: 16,
        alignItems: 'center',
        marginTop: relativeHeight(50),
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginTop: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 12,
        lineHeight: 20,
    },
    langRow: {
        width: '100%',
        alignItems: 'flex-end',
        paddingHorizontal: relativeWidth(24),
        paddingTop: relativeHeight(52),
    },
    actions: {
        marginTop: relativeHeight(50),
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    clientButton: {
        width: '100%',
        marginBottom: 12,
        alignSelf: 'center',
    },
    providerButton: {
        width: '100%',
        alignSelf: 'center',
    },
});
