import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Book } from 'lucide-react-native';
import AuthInput from '@/components/AuthInput';
import AuthButton from '@/components/AuthButton';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(
        t('Erreur', 'Erè'),
        t('Veuillez remplir tous les champs', 'Tanpri ranpli tout chan yo')
      );
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert(
        t('Erreur de connexion', 'Erè koneksyon'),
        t('Email ou mot de passe incorrect', 'Imèl oswa modpas pa kòrèk')
      );
    } else {
      router.replace('/(tabs)');
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'ht' : 'fr');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <View style={styles.logoContainer}>
            <View style={styles.iconCircle}>
              <Book color="#3B82F6" size={48} strokeWidth={2} />
            </View>
          </View>

          <Text style={styles.title}>CITOYEN ÉCLAIRÉ</Text>
          <Text style={styles.subtitle}>
            {t('Connaître son pays, c\'est mieux le servir', 'Konnen peyi ou, se pi bon sèvi li')}
          </Text>

          <TouchableOpacity style={styles.languageButton} onPress={toggleLanguage}>
            <View style={styles.flagContainer}>
              <View style={[styles.flagHalf, { backgroundColor: '#0038A8' }]} />
              <View style={[styles.flagHalf, { backgroundColor: '#D21034' }]} />
            </View>
            <Text style={styles.languageText}>{language === 'fr' ? 'FR' : 'HT'}</Text>
          </TouchableOpacity>

          <View style={styles.form}>
            <Text style={styles.label}>{t('Email', 'Imèl')}</Text>
            <AuthInput
              placeholder="exemple@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <Text style={styles.label}>{t('Mot de passe', 'Modpas')}</Text>
            <AuthInput
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />

            <AuthButton
              title={t('Se connecter', 'Konekte')}
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />

            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.linkText}>
                {t('Pas de compte ? S\'inscrire', 'Pa gen kont? Enskri')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3B82F6',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 16,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginBottom: 24,
  },
  flagContainer: {
    flexDirection: 'row',
    width: 32,
    height: 20,
    marginRight: 8,
    overflow: 'hidden',
    borderRadius: 2,
  },
  flagHalf: {
    flex: 1,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  linkText: {
    fontSize: 14,
    color: '#3B82F6',
    textAlign: 'center',
    fontWeight: '600',
  },
});
