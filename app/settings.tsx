import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Platform, ActivityIndicator } from 'react-native';
import * as Notifications from 'expo-notifications';
import { clearAllOfflineArticles, getStorageSize } from '@/lib/offlineStorage';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppearance } from '@/contexts/AppearanceContext';
import { usePreferences, UserPreferences } from '@/hooks/usePreferences';
import { useAppearanceSync } from '@/hooks/useAppearanceSync';
import { ArrowLeft, Moon, Type, Bell, Volume2, Download, Trash2, SunMoon, ChevronRight } from 'lucide-react-native';

const TEXT_SIZES = [
  { label: 'Petit', value: 0.9 },
  { label: 'Moyen', value: 1.0 },
  { label: 'Grand', value: 1.2 },
];

export default function SettingsScreen() {
  const { fetchPreferences, updatePreferences, loading: prefsLoading } = usePreferences();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [storageSize, setStorageSize] = useState({ size: 0, unit: 'MB' });
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const { textSize, setTextSize, colors, isDarkMode, manualDarkMode, setManualDarkMode, autoDarkMode, setAutoDarkMode } = useAppearance();
  const { loadAppearancePreferences } = useAppearanceSync();
  const router = useRouter();

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (textSize && preferences) {
      handlePreferenceUpdate({ text_size: textSize });
    }
  }, [textSize]);

  useEffect(() => {
    const storageInfo = getStorageSize();
    setStorageSize(storageInfo);
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const prefs = await fetchPreferences();
    if (prefs) {
      setPreferences(prefs);
      if (prefs.text_size && prefs.text_size !== textSize) {
        setTextSize(prefs.text_size);
      }
      // Sync local appearance state with loaded preferences
      if (prefs.dark_mode_auto !== undefined) await setAutoDarkMode(prefs.dark_mode_auto);
      if (prefs.dark_mode !== undefined) await setManualDarkMode(prefs.dark_mode);
    }
    setLoading(false);
  };

  const handlePreferenceUpdate = async (updates: Partial<UserPreferences>) => {
    const updatedPrefs = await updatePreferences(updates);
    if (updatedPrefs) {
      setPreferences(updatedPrefs);
    }
  };

  const handleAutoModeToggle = async (value: boolean) => {
    await setAutoDarkMode(value);
    await handlePreferenceUpdate({ dark_mode_auto: value });
  };

  const handleDarkModeToggle = async (value: boolean) => {
    // Manual toggle always disables auto mode
    if (autoDarkMode) {
      await setAutoDarkMode(false);
    }
    await setManualDarkMode(value);
    await handlePreferenceUpdate({ dark_mode: value, dark_mode_auto: false });
  };

  const handleNotificationsToggle = async (value: boolean) => {
    await handlePreferenceUpdate({ notifications_enabled: value });
  };

  const handleSoundToggle = async (value: boolean) => {
    await handlePreferenceUpdate({ notification_sound: value });
  };

  const handleAutoDownloadToggle = async (value: boolean) => {
    await handlePreferenceUpdate({ auto_download: value });
  };

  const handleClearCache = () => {
    Alert.alert(
      t('Vider le cache', 'Vide kach la'),
      t('Êtes-vous sûr de vouloir vider le cache?', 'Èske ou sèten ou vle vide kach la?'),
      [
        { text: t('Annuler', 'Anile'), style: 'cancel' },
        {
          text: t('Vider', 'Vide'),
          style: 'destructive',
          onPress: async () => {
            const result = await clearAllOfflineArticles();
            const storageInfo = getStorageSize();
            setStorageSize(storageInfo);
            
            if (result.success) {
              Alert.alert(t('Succès', 'Siksè'), t('Cache vidé avec succès', 'Kach vide avèk siksè'));
            } else {
              Alert.alert(t('Erreur', 'Erè'), t('Une erreur est survenue lors du nettoyage du cache', 'Gen yon erè ki fèt pandan netwayaj kach la'));
            }
          },
        },
      ]
    );
  };

  const styles = getStyles(textSize, colors, isDarkMode);

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft color={colors.text} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('Paramètres', 'Paramèt')}</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('Paramètres', 'Paramèt')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('Apparence', 'Aparans')}</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <SunMoon color={colors.textSecondary} size={20} />
              <Text style={styles.settingText}>{t('Thème automatique', 'Tèm otomatik')}</Text>
            </View>
            <Switch
              value={autoDarkMode}
              onValueChange={handleAutoModeToggle}
              trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
              thumbColor={autoDarkMode ? colors.primary : '#F3F4F6'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Moon color={autoDarkMode ? colors.border : colors.textSecondary} size={20} />
              <Text style={[styles.settingText, autoDarkMode && styles.disabledText]}>{t('Mode sombre', 'Mòd fènwa')}</Text>
            </View>
            <Switch
              value={manualDarkMode}
              onValueChange={handleDarkModeToggle}
              trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
              thumbColor={manualDarkMode ? colors.primary : '#F3F4F6'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Type color={colors.textSecondary} size={20} />
              <Text style={styles.settingText}>{t('Taille du texte', 'Gwosè tèks')}</Text>
            </View>
          </View>
          <View style={styles.textSizeSelector}>
            {TEXT_SIZES.map((size) => (
              <TouchableOpacity
                key={size.label}
                style={[
                  styles.textSizeOption,
                  textSize === size.value && styles.activeTextSizeOption,
                ]}
                onPress={() => setTextSize(size.value)}
              >
                <Text
                  style={[
                    styles.textSizeLabel,
                    textSize === size.value && styles.activeTextSizeLabel,
                  ]}
                >
                  {t(size.label, size.label)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('Notifications', 'Notifikasyon')}</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell color={colors.textSecondary} size={20} />
              <Text style={styles.settingText}>
                {t('Activer les notifications', 'Aktive notifikasyon yo')}
              </Text>
            </View>
            <Switch
              value={preferences?.notifications_enabled || false}
              onValueChange={handleNotificationsToggle}
              trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
              thumbColor={preferences?.notifications_enabled ? colors.primary : '#F3F4F6'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Volume2 color={!preferences?.notifications_enabled ? colors.border : colors.textSecondary} size={20} />
              <Text style={[styles.settingText, !preferences?.notifications_enabled && styles.disabledText]}>
                {t('Son des notifications', 'Son notifikasyon')}
              </Text>
            </View>
            <Switch
              value={preferences?.notification_sound || false}
              onValueChange={handleSoundToggle}
              trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
              thumbColor={preferences?.notification_sound ? colors.primary : '#F3F4F6'}
              disabled={!preferences?.notifications_enabled}
            />
          </View>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => router.push('/notification')}
            disabled={!preferences?.notifications_enabled}
          >
            <View style={styles.settingLeft}>
              <Text style={[styles.settingText, { marginLeft: 0 }, !preferences?.notifications_enabled && styles.disabledText]}>
                {t('Gérer les notifications', 'Jere notifikasyon yo')}
              </Text>
            </View>
            <ChevronRight color={!preferences?.notifications_enabled ? colors.border : colors.textSecondary} size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('Stockage', 'Estokaj')}</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Download color={colors.textSecondary} size={20} />
              <Text style={styles.settingText}>
                {t('Téléchargement auto', 'Telechajman otomatik')}
              </Text>
            </View>
            <Switch
              value={preferences?.auto_download || false}
              onValueChange={handleAutoDownloadToggle}
              trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
              thumbColor={preferences?.auto_download ? colors.primary : '#F3F4F6'}
            />
          </View>

          <View style={styles.storageInfo}>
            <Text style={styles.storageLabel}>
              {t('Espace utilisé', 'Espas itilize')}
            </Text>
            <Text style={styles.storageValue}>{storageSize.size.toFixed(2)} {storageSize.unit}</Text>
          </View>
          <View style={styles.storageBar}>
            <View style={[styles.storageBarFill, { width: `${Math.min(storageSize.size, 100)}%` }]} />
          </View>

          <TouchableOpacity style={styles.clearCacheButton} onPress={handleClearCache}>
            <Trash2 color="#EF4444" size={20} />
            <Text style={styles.clearCacheText}>
              {t('Vider le cache', 'Vide kach la')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('À propos', 'Konsènan')}</Text>
          <View style={styles.aboutItem}>
            <Text style={styles.aboutLabel}>{t('Version', 'Vèsyon')}</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
          <View style={styles.aboutItem}>
            <Text style={styles.aboutLabel}>
              {t('Dernière mise à jour', 'Dènye mizajou')}
            </Text>
            <Text style={styles.aboutValue}>06 Oct 2025</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (textSize: number, colors: any, isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18 * textSize,
    fontWeight: '700',
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: colors.surface,
    marginBottom: 12,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 14 * textSize,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: 16 * textSize,
    color: colors.text,
    marginLeft: 16,
  },
  disabledText: {
    color: colors.textSecondary,
  },
  textSizeSelector: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 8,
    marginHorizontal: 20,
    padding: 4,
  },
  textSizeOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  activeTextSizeOption: {
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  textSizeLabel: {
    fontSize: 14 * textSize,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeTextSizeLabel: {
    color: colors.primary,
  },
  storageInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
  },
  storageLabel: {
    fontSize: 14 * textSize,
    color: colors.textSecondary,
  },
  storageValue: {
    fontSize: 14 * textSize,
    fontWeight: '600',
    color: colors.text,
  },
  storageBar: {
    height: 8,
    backgroundColor: colors.border,
    marginHorizontal: 20,
    borderRadius: 4,
    overflow: 'hidden',
  },
  storageBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  clearCacheButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : '#FEF2F2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: isDarkMode ? 'rgba(239, 68, 68, 0.3)' : '#FECACA',
  },
  clearCacheText: {
    fontSize: 16 * textSize,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 8,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  aboutLabel: {
    fontSize: 16 * textSize,
    color: colors.textSecondary,
  },
  aboutValue: {
    fontSize: 16 * textSize,
    fontWeight: '600',
    color: colors.text,
  },
});
