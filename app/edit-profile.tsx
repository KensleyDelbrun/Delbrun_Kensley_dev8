import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProfile, UserProfile } from '@/hooks/useProfile';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppearance } from '@/contexts/AppearanceContext';
import { ArrowLeft, User } from 'lucide-react-native';

export default function EditProfileScreen() {
  const router = useRouter();
  const { fetchProfile, updateProfile, loading: profileLoading } = useProfile();
  const { t } = useLanguage();
  const { textSize, colors, isDarkMode } = useAppearance();
  const styles = getStyles(textSize, colors, isDarkMode);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const userProfile = await fetchProfile();
    if (userProfile) {
      setProfile(userProfile);
      setFullName(userProfile.full_name || '');
    }
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert(t('Erreur', 'Erè'), t('Le nom ne peut pas être vide.', 'Non an pa ka vid.'));
      return;
    }

    setIsSaving(true);
    const updatedProfile = await updateProfile({ full_name: fullName.trim() });
    setIsSaving(false);

    if (updatedProfile) {
      Alert.alert(
        t('Succès', 'Siksè'),
        t('Votre profil a été mis à jour.', 'Pwofil ou a te mete ajou.'),
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } else {
      Alert.alert(t('Erreur', 'Erè'), t('Une erreur est survenue.', 'Yon erè te fèt.'));
    }
  };

  if (profileLoading && !profile) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft color={colors.text} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('Modifier le profil', 'Modifye pwofil')}</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
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
        <Text style={styles.headerTitle}>{t('Modifier le profil', 'Modifye pwofil')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <User color={colors.textSecondary} size={20} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder={t('Nom complet', 'Non konplè')}
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="words"
            autoComplete="name"
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>{t('Enregistrer', 'Anrejistre')}</Text>
          )}
        </TouchableOpacity>
      </View>
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
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16 * textSize,
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: colors.primary + '80',
  },
  saveButtonText: {
    fontSize: 16 * textSize,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
