import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppearance } from '@/contexts/AppearanceContext';
import { usePreferences, UserPreferences } from '@/hooks/usePreferences';
import {
  ArrowLeft,
  BookOpen,
  Bell,
  Calendar,
  MessageSquare,
  TrendingUp,
  Lightbulb,
} from 'lucide-react-native';

export default function NotificationsScreen() {
  const { fetchPreferences, updatePreferences, loading: prefsLoading } = usePreferences();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const { textSize, colors, isDarkMode } = useAppearance();
  const router = useRouter();
  const styles = getStyles(textSize, colors, isDarkMode);

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    setLoading(true);
    const prefs = await fetchPreferences();
    if (prefs) {
      setPreferences(prefs);
    }
    setLoading(false);
  };

  const handlePreferenceUpdate = async (updates: Partial<UserPreferences>) => {
    const updatedPrefs = await updatePreferences(updates);
    if (updatedPrefs) {
      setPreferences(updatedPrefs);
    }
  };

  const notificationItems = [
    {
      icon: <BookOpen color="#3B82F6" size={20} />,
      iconBg: '#DBEAFE',
      title: t('Nouveaux articles', 'Nouvo atik'),
      description: t(
        'Recevoir une notification pour chaque nouvel article publié',
        'Resevwa yon notifikasyon pou chak nouvo atik pibliye'
      ),
      value: preferences?.new_articles_notif || false,
      handler: (value: boolean) => handlePreferenceUpdate({ new_articles_notif: value }),
    },
    {
      icon: <Bell color="#F59E0B" size={20} />,
      iconBg: '#FEF3C7',
      title: t('Rappels de lecture', 'Rapèl lekti'),
      description: t('Rappels pour lire vos articles sauvegardés', 'Rapèl pou li atik ou sovgade yo'),
      value: preferences?.read_reminders_notif || false,
      handler: (value: boolean) => handlePreferenceUpdate({ read_reminders_notif: value }),
    },
    {
      icon: <Calendar color="#6366F1" size={20} />,
      iconBg: '#E0E7FF',
      title: t('Résumé hebdomadaire', 'Rezime chak semèn'),
      description: t(
        'Résumé des articles les plus populaires de la semaine',
        'Rezime atik ki pi popilè nan semèn nan'
      ),
      value: preferences?.weekly_summary_notif || false,
      handler: (value: boolean) => handlePreferenceUpdate({ weekly_summary_notif: value }),
    },
    {
      icon: <MessageSquare color="#0EA5E9" size={20} />,
      iconBg: '#E0F2FE',
      title: t('Mises à jour communautaires', 'Mizajou kominotè'),
      description: t('Actualités et événements de la communauté', 'Aktyalite ak evènman nan kominote a'),
      value: preferences?.community_updates_notif || false,
      handler: (value: boolean) => handlePreferenceUpdate({ community_updates_notif: value }),
    },
    {
      icon: <TrendingUp color="#22C55E" size={20} />,
      iconBg: '#DCFCE7',
      title: t('Actualités importantes', 'Aktyalite enpòtan'),
      description: t(
        'Alertes pour les actualités urgentes et importantes',
        'Alèt pou aktyalite ijan ak enpòtan yo'
      ),
      value: preferences?.important_news_notif || false,
      handler: (value: boolean) => handlePreferenceUpdate({ important_news_notif: value }),
    },
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft color="#1F2937" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('Notifications', 'Notifikasyon')}</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color="#1F2937" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('Notifications', 'Notifikasyon')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            {t(
              'Personnalisez vos notifications pour rester informé des contenus qui vous intéressent.',
              'Pèsonalize notifikasyon ou yo pou rete enfòme sou kontni ki enterese ou.'
            )}
          </Text>
        </View>

        {notificationItems.map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.notificationLeft}>
              <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
                {item.icon}
              </View>
              <View style={styles.notificationTextContainer}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationDescription}>{item.description}</Text>
              </View>
            </View>
            <Switch
              value={item.value}
              onValueChange={item.handler}
              trackColor={{ false: '#E5E7EB', true: '#2563EB' }}
              thumbColor={'#FFFFFF'}
              ios_backgroundColor="#E5E7EB"
            />
          </View>
        ))}

        <View style={styles.tipCard}>
          <Lightbulb color="#F59E0B" size={20} />
          <Text style={styles.tipText}>
            {t(
              'Astuce: Activez les notifications importantes pour ne manquer aucune information urgente concernant Haïti.',
              'Astis: Aktive notifikasyon enpòtan yo pou pa rate okenn enfòmasyon ijan konsènan Ayiti.'
            )}
          </Text>
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
    marginLeft: -8,
    width: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18 * textSize,
    fontWeight: '600',
    color: colors.text,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  infoCard: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14 * textSize,
    color: '#1E40AF',
    lineHeight: 20 * textSize,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: isDarkMode ? 0.3 : 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20, // Make it circular
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16 * textSize,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  notificationDescription: {
    fontSize: 13 * textSize,
    color: colors.textSecondary,
    lineHeight: 18 * textSize,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFBEB',
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  tipText: {
    flex: 1,
    fontSize: 13 * textSize,
    color: '#92400E',
    lineHeight: 18 * textSize,
    marginLeft: 12,
  },
});
