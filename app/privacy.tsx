import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppearance } from '@/contexts/AppearanceContext';
import { ArrowLeft } from 'lucide-react-native';

export default function PrivacyScreen() {
  const { t } = useLanguage();
  const { textSize, colors } = useAppearance();
  const router = useRouter();
  const styles = getStyles(textSize, colors);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('Politique de Confidentialité', 'Politik Konfidansyalite')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.lastUpdated}>{t('Dernière mise à jour : 06 Oct 2025', 'Dènye mizajou : 06 Okt 2025')}</Text>
        
        <Text style={styles.paragraph}>
          {t(
            "Bienvenue sur Citoyen Éclairé. Nous nous engageons à protéger votre vie privée. Cette politique de confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations lorsque vous utilisez notre application mobile.",
            "Byenveni sou Sitwayen Eklere. Nou angaje nou pou pwoteje vi prive w. Politik konfidansyalite sa a eksplike kijan nou kolekte, itilize, divilge, ak pwoteje enfòmasyon ou yo lè ou itilize aplikasyon mobil nou an."
          )}
        </Text>

        <Text style={styles.heading}>{t('1. Collecte d\'informations', '1. Koleksyon Enfòmasyon')}</Text>
        <Text style={styles.paragraph}>
          {t(
            "Nous collectons les informations que vous nous fournissez directement, telles que votre nom, votre adresse e-mail et vos préférences linguistiques lorsque vous créez un compte. Nous collectons également des informations d'utilisation anonymes pour améliorer l'application.",
            "Nou kolekte enfòmasyon ou ba nou dirèkteman, tankou non w, adrès imèl ou, ak preferans lang ou lè ou kreye yon kont. Nou kolekte tou enfòmasyon itilizasyon anonim pou amelyore aplikasyon an."
          )}
        </Text>

        <Text style={styles.heading}>{t('2. Utilisation de vos informations', '2. Itilizasyon Enfòmasyon Ou yo')}</Text>
        <Text style={styles.paragraph}>
          {t(
            "Nous utilisons vos informations pour : fournir, maintenir et améliorer notre service ; personnaliser votre expérience ; communiquer avec vous, y compris pour vous envoyer des notifications si vous y consentez ; et surveiller et analyser les tendances et l'utilisation.",
            "Nou itilize enfòmasyon ou yo pou : founi, kenbe ak amelyore sèvis nou an; pèsonalize eksperyans ou; kominike avèk ou, enkli voye notifikasyon si ou dakò; epi siveye ak analize tandans ak itilizasyon."
          )}
        </Text>

        <Text style={styles.heading}>{t('3. Partage de vos informations', '3. Pataj Enfòmasyon Ou yo')}</Text>
        <Text style={styles.paragraph}>
          {t(
            "Nous ne partageons pas vos informations personnelles avec des tiers, sauf si la loi l'exige ou pour protéger nos droits.",
            "Nou pa pataje enfòmasyon pèsonèl ou yo ak okenn lòt moun, sof si lalwa egzije sa oswa pou pwoteje dwa nou yo."
          )}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (textSize: number, colors: any) => StyleSheet.create({
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
  contentContainer: {
    padding: 20,
  },
  lastUpdated: {
    fontSize: 13 * textSize,
    color: colors.textSecondary,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  heading: {
    fontSize: 20 * textSize,
    fontWeight: '700',
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16 * textSize,
    color: colors.textSecondary,
    lineHeight: 24 * textSize,
  },
});
