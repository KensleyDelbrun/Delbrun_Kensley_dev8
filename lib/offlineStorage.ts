import * as SQLite from 'expo-sqlite';
import { UserProfile } from '@/hooks/useProfile';
import { UserPreferences } from '@/hooks/usePreferences';

const db = SQLite.openDatabaseSync('citoyen_eclaire.db');

export const initOfflineDatabase = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS offline_articles (
      id TEXT PRIMARY KEY,
      category_id TEXT,
      title_fr TEXT,
      title_ht TEXT,
      content_fr TEXT,
      content_ht TEXT,
      summary_fr TEXT,
      summary_ht TEXT,
      image_url TEXT,
      media_type TEXT,
      media_url TEXT,
      is_featured INTEGER,
      published_at TEXT,
      saved_at TEXT,
      category_name_fr TEXT,
      category_name_ht TEXT
    );

    CREATE TABLE IF NOT EXISTS user_profile (
      id TEXT PRIMARY KEY,
      email TEXT,
      full_name TEXT,
      preferred_language TEXT,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS user_preferences (
      id TEXT PRIMARY KEY,
      dark_mode INTEGER,
      dark_mode_auto INTEGER,
      notifications_enabled INTEGER,
      notification_sound INTEGER,
      auto_download INTEGER,
      text_size REAL,
      new_articles_notif INTEGER,
      read_reminders_notif INTEGER,
      weekly_summary_notif INTEGER,
      community_updates_notif INTEGER,
      important_news_notif INTEGER,
      updated_at TEXT
    );
  `);
};

// User Profile Functions
export const saveUserProfile = (profile: UserProfile) => {
  try {
    db.runSync(
      `INSERT OR REPLACE INTO user_profile (id, email, full_name, preferred_language, updated_at)
       VALUES (?, ?, ?, ?, ?)`,
      [profile.id, profile.email, profile.full_name, profile.preferred_language, new Date().toISOString()]
    );
    return { success: true };
  } catch (error) {
    console.error('Error saving user profile offline:', error);
    return { success: false, error };
  }
};

export const getUserProfile = (userId: string): UserProfile | null => {
  try {
    const result = db.getFirstSync<any>(
      'SELECT * FROM user_profile WHERE id = ?',
      [userId]
    );
    return result ? { ...result, created_at: result.updated_at } : null;
  } catch (error) {
    console.error('Error getting user profile offline:', error);
    return null;
  }
};

// User Preferences Functions
export const saveUserPreferences = (prefs: UserPreferences) => {
  try {
    db.runSync(
      `INSERT OR REPLACE INTO user_preferences (
        id, dark_mode, dark_mode_auto, notifications_enabled, notification_sound, auto_download, text_size,
        new_articles_notif, read_reminders_notif, weekly_summary_notif, community_updates_notif, important_news_notif, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        prefs.id,
        prefs.dark_mode ? 1 : 0,
        prefs.dark_mode_auto ? 1 : 0,
        prefs.notifications_enabled ? 1 : 0,
        prefs.notification_sound ? 1 : 0,
        prefs.auto_download ? 1 : 0,
        prefs.text_size,
        prefs.new_articles_notif ? 1 : 0,
        prefs.read_reminders_notif ? 1 : 0,
        prefs.weekly_summary_notif ? 1 : 0,
        prefs.community_updates_notif ? 1 : 0,
        prefs.important_news_notif ? 1 : 0,
        new Date().toISOString()
      ]
    );
    return { success: true };
  } catch (error) {
    console.error('Error saving user preferences offline:', error);
    return { success: false, error };
  }
};

export const getUserPreferences = (userId: string): UserPreferences | null => {
  try {
    const result = db.getFirstSync<any>(
      'SELECT * FROM user_preferences WHERE id = ?',
      [userId]
    );
    if (!result) return null;
    
    // Convert integer back to boolean
    return {
      ...result,
      dark_mode: !!result.dark_mode,
      dark_mode_auto: !!result.dark_mode_auto,
      notifications_enabled: !!result.notifications_enabled,
      notification_sound: !!result.notification_sound,
      auto_download: !!result.auto_download,
      new_articles_notif: !!result.new_articles_notif,
      read_reminders_notif: !!result.read_reminders_notif,
      weekly_summary_notif: !!result.weekly_summary_notif,
      community_updates_notif: !!result.community_updates_notif,
      important_news_notif: !!result.important_news_notif,
      created_at: result.updated_at,
    };
  } catch (error) {
    console.error('Error getting user preferences offline:', error);
    return null;
  }
};


export type OfflineArticle = {
  id: string;
  category_id: string;
  title_fr: string;
  title_ht: string;
  content_fr: string;
  content_ht: string;
  summary_fr: string;
  summary_ht: string;
  image_url: string | null;
  media_type: string;
  media_url: string | null;
  is_featured: number;
  published_at: string;
  saved_at: string;
  category_name_fr?: string;
  category_name_ht?: string;
};

export const saveArticleOffline = async (article: any, categoryName?: { fr: string; ht: string }) => {
  try {
    const result = db.runSync(
      `INSERT OR REPLACE INTO offline_articles (
        id, category_id, title_fr, title_ht, content_fr, content_ht,
        summary_fr, summary_ht, image_url, media_type, media_url,
        is_featured, published_at, saved_at, category_name_fr, category_name_ht
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        article.id,
        article.category_id,
        article.title_fr,
        article.title_ht,
        article.content_fr,
        article.content_ht,
        article.summary_fr,
        article.summary_ht,
        article.image_url,
        article.media_type,
        article.media_url,
        article.is_featured ? 1 : 0,
        article.published_at,
        new Date().toISOString(),
        categoryName?.fr || '',
        categoryName?.ht || '',
      ]
    );
    return { success: true, result };
  } catch (error) {
    console.error('Error saving article offline:', error);
    return { success: false, error };
  }
};

export const removeArticleOffline = async (articleId: string) => {
  try {
    const result = db.runSync('DELETE FROM offline_articles WHERE id = ?', [articleId]);
    return { success: true, result };
  } catch (error) {
    console.error('Error removing article offline:', error);
    return { success: false, error };
  }
};

export const getOfflineArticles = (): OfflineArticle[] => {
  try {
    const result = db.getAllSync<OfflineArticle>(
      'SELECT * FROM offline_articles ORDER BY saved_at DESC'
    );
    return result;
  } catch (error) {
    console.error('Error getting offline articles:', error);
    return [];
  }
};

export const getOfflineArticleById = (articleId: string): OfflineArticle | null => {
  try {
    const result = db.getFirstSync<OfflineArticle>(
      'SELECT * FROM offline_articles WHERE id = ?',
      [articleId]
    );
    return result ?? null;
  } catch (error) {
    console.error('Error getting offline article by ID:', error);
    return null;
  }
};

export const isArticleSavedOffline = (articleId: string): boolean => {
  try {
    const result = db.getFirstSync<{ count: number }>(
      'SELECT COUNT(*) as count FROM offline_articles WHERE id = ?',
      [articleId]
    );
    return (result?.count ?? 0) > 0;
  } catch (error) {
    console.error('Error checking if article is saved:', error);
    return false;
  }
};

export const clearOldOfflineArticles = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const result = db.runSync(
      'DELETE FROM offline_articles WHERE saved_at < ?',
      [thirtyDaysAgo.toISOString()]
    );
    return { success: true, result };
  } catch (error) {
    console.error('Error clearing old articles:', error);
    return { success: false, error };
  }
};

export const getStorageSize = (): { size: number; unit: string } => {
  try {
    const articles = getOfflineArticles();
    const averageArticleSize = 2048;
    const totalSize = articles.length * averageArticleSize;
    
    if (totalSize < 1024) {
      return { size: totalSize, unit: 'bytes' };
    } else if (totalSize < 1024 * 1024) {
      return { size: Math.round(totalSize / 1024), unit: 'KB' };
    } else {
      return { size: Math.round(totalSize / (1024 * 1024)), unit: 'MB' };
    }
  } catch (error) {
    console.error('Error calculating storage size:', error);
    return { size: 0, unit: 'MB' };
  }
};

export const clearAllOfflineArticles = async () => {
  try {
    const result = db.runSync('DELETE FROM offline_articles');
    return { success: true, result };
  } catch (error) {
    console.error('Error clearing all articles:', error);
    return { success: false, error };
  }
};
