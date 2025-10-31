import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppearance } from '@/contexts/AppearanceContext';
import { ArrowLeft } from 'lucide-react-native';

export default function AboutScreen() {
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
        <Text style={styles.headerTitle}>{t('À propos de nous', 'Konsènan nou')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <View style={styles.flag}>
            <View style={[styles.flagHalf, { backgroundColor: '#0038A8' }]} />
            <View style={[styles.flagHalf, { backgroundColor: '#D21034' }]} />
          </View>
          <Text style={styles.appName}>CITOYEN ÉCLAIRÉ</Text>
        </View>

        <Text style={styles.heading}>{t('Notre Mission', 'Misyon Nou')}</Text>
        <Text style={styles.paragraph}>
          {t(
            "Notre mission est de fournir aux citoyens haïtiens un accès facile et fiable à l'information civique et aux actualités pertinentes. Nous croyons qu'un citoyen bien informé est un citoyen plus engagé, capable de prendre des décisions éclairées pour lui-même et sa communauté.",
            "Misyon nou se bay sitwayen ayisyen yo aksè fasil ak fyab a enfòmasyon sivik ak nouvèl ki enpòtan. Nou kwè yon sitwayen ki byen enfòme se yon sitwayen ki pi angaje, ki kapab pran desizyon eklere pou tèt li ak kominote li."
          )}
        </Text>

        <Text style={styles.heading}>{t('Ce que nous offrons', 'Sa Nou Ofri')}</Text>
        <Text style={styles.paragraph}>
          {t(
            "Citoyen Éclairé est une plateforme bilingue (Français/Kreyòl) qui centralise les actualités, les guides civiques, et les informations importantes. Notre objectif est de briser les barrières linguistiques et de rendre l'information accessible à tous.",
            "Sitwayen Eklere se yon platfòm bileng (Franse/Kreyòl) ki santralize nouvèl, gid sivik, ak enfòmasyon enpòtan. Objektif nou se kraze baryè lang yo epi rann enfòmasyon aksesib pou tout moun."
          )}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
          <Text style={styles.footerText}>© 2025 Citoyen Éclairé. {t('Tous droits réservés.', 'Tout dwa rezève.')}</Text>
        </View>
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
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  flag: {
    width: 80,
    height: 48,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  flagHalf: {
    flex: 1,
  },
  appName: {
    fontSize: 22 * textSize,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.5,
  },
  heading: {
    fontSize: 20 * textSize,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16 * textSize,
    color: colors.textSecondary,
    lineHeight: 24 * textSize,
  },
  footer: {
    marginTop: 48,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 24,
  },
  footerText: {
    fontSize: 13 * textSize,
    color: colors.textSecondary,
    lineHeight: 20 * textSize,
  },
});
