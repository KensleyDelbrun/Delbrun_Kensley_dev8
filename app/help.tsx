import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppearance } from '@/contexts/AppearanceContext';
import { ArrowLeft, ChevronRight, FileText, Info } from 'lucide-react-native';
import AccordionItem from '@/components/AccordionItem';

const FAQ_DATA = [
  {
    question_fr: "Comment puis-je changer la langue de l'application ?",
    question_ht: "Kòman mwen ka chanje lang aplikasyon an?",
    answer_fr: "Vous pouvez changer la langue à tout moment depuis votre écran de profil. Appuyez sur l'option 'Langue' pour basculer entre le Français et le Kreyòl Ayisyen.",
    answer_ht: "Ou ka chanje lang lan nenpòt ki lè nan ekran pwofil ou a. Peze opsyon 'Lang' lan pou chanje ant Franse ak Kreyòl Ayisyen.",
  },
  {
    question_fr: "Comment fonctionne le mode hors ligne ?",
    question_ht: "Kòman mòd hors-ligne lan fonksyone?",
    answer_fr: "Les articles que vous consultez sont automatiquement sauvegardés pour une lecture hors ligne. Vous pouvez gérer le stockage et vider le cache dans les Paramètres > Stockage.",
    answer_ht: "Atik ou li yo anrejistre otomatikman pou ou ka li yo san entènèt. Ou ka jere estokaj la epi vide kach la nan Paramèt > Estokaj.",
  },
  {
    question_fr: "Comment gérer mes notifications ?",
    question_ht: "Kòman pou m jere notifikasyon mwen yo?",
    answer_fr: "Allez dans Paramètres > Notifications pour activer ou désactiver les notifications et leur son. Vous pouvez également gérer les notifications par catégorie sur l'écran de notifications.",
    answer_ht: "Ale nan Paramèt > Notifikasyon pou aktive oswa dezaktive notifikasyon yo ak son yo. Ou ka jere notifikasyon pa kategori tou sou ekran notifikasyon an.",
  },
  {
    question_fr: "Mes données personnelles sont-elles en sécurité ?",
    question_ht: "Èske done pèsonèl mwen yo an sekirite?",
    answer_fr: "Oui, nous prenons la sécurité de vos données très au sérieux. Pour plus de détails, veuillez consulter notre Politique de Confidentialité.",
    answer_ht: "Wi, nou pran sekirite done ou yo trè oserye. Pou plis detay, tanpri konsilte Politik Konfidansyalite nou an.",
  },
];

export default function HelpScreen() {
  const { t } = useLanguage();
  const { textSize, colors, isDarkMode } = useAppearance();
  const router = useRouter();
  const styles = getStyles(textSize, colors, isDarkMode);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('Aide & Support', 'Èd & Sipò')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('Foire aux Questions', 'Kesyon yo poze souvan')}</Text>
          {FAQ_DATA.map((item, index) => (
            <AccordionItem
              key={index}
              title={t(item.question_fr, item.question_ht)}
              content={t(item.answer_fr, item.answer_ht)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('Autres ressources', 'Lòt resous')}</Text>
          <TouchableOpacity style={styles.linkItem} onPress={() => router.push('/privacy')}>
            <View style={styles.linkLeft}>
              <FileText color={colors.textSecondary} size={20} />
              <Text style={styles.linkText}>{t('Politique de Confidentialité', 'Politik Konfidansyalite')}</Text>
            </View>
            <ChevronRight color={colors.textSecondary} size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkItem} onPress={() => router.push('/about')}>
            <View style={styles.linkLeft}>
              <Info color={colors.textSecondary} size={20} />
              <Text style={styles.linkText}>{t('À propos de nous', 'Konsènan nou')}</Text>
            </View>
            <ChevronRight color={colors.textSecondary} size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>{t('Besoin d\'aide supplémentaire ?', 'Ou bezwen plis èd?')}</Text>
          <Text style={styles.contactText}>{t('Contactez notre support par email.', 'Kontakte sipò nou an pa imèl.')}</Text>
          <TouchableOpacity style={styles.contactButton} onPress={() => Linking.openURL('mailto:support@citoyen-eclaire.app')}>
            <Text style={styles.contactButtonText}>support@citoyen-eclaire.app</Text>
          </TouchableOpacity>
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
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  linkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 16 * textSize,
    color: colors.text,
    marginLeft: 16,
  },
  contactSection: {
    backgroundColor: colors.surface,
    padding: 24,
    alignItems: 'center',
    marginVertical: 12,
  },
  contactTitle: {
    fontSize: 18 * textSize,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14 * textSize,
    color: colors.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  contactButton: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  contactButtonText: {
    color: colors.primary,
    fontSize: 15 * textSize,
    fontWeight: '600',
  },
});
