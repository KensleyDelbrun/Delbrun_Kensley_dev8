import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { getUserPreferences, saveUserPreferences } from '@/lib/offlineStorage';

export interface UserPreferences {
  id: string;
  dark_mode: boolean;
  dark_mode_auto: boolean;
  notifications_enabled: boolean;
  notification_sound: boolean;
  auto_download: boolean;
  text_size: number;
  new_articles_notif: boolean;
  read_reminders_notif: boolean;
  weekly_summary_notif: boolean;
  community_updates_notif: boolean;
  important_news_notif: boolean;
  created_at: string;
  updated_at: string;
}

export function usePreferences() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPreferences = useCallback(async (): Promise<UserPreferences | null> => {
    if (!user) return null;
    
    setLoading(true);
    setError(null);

    // 1. Try to get preferences from local storage first
    const localPrefs = getUserPreferences(user.id);
    if (localPrefs) {
      setLoading(false);
    }

    // 2. Fetch from Supabase to get the latest data and update cache
    try {
      const { data, error: remoteError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('id', user.id)
        .single();

      if (remoteError && remoteError.code === 'PGRST116') {
        // Preferences don't exist, create them with defaults
        const defaultPreferences: Omit<UserPreferences, 'created_at' | 'updated_at' | 'id'> = {
          dark_mode: false, dark_mode_auto: true, notifications_enabled: true,
          notification_sound: true, auto_download: false, text_size: 1.0,
          new_articles_notif: true, read_reminders_notif: false, weekly_summary_notif: true,
          community_updates_notif: false, important_news_notif: true,
        };
        const { data: insertedData, error: insertError } = await supabase
          .from('user_preferences')
          .insert({ id: user.id, ...defaultPreferences })
          .select()
          .single();
        
        if (insertError) throw insertError;
        saveUserPreferences(insertedData); // Save new prefs locally
        return insertedData;
      }

      if (remoteError) {
        if (localPrefs) return localPrefs;
        throw remoteError;
      }
      
      saveUserPreferences(data); // Update local cache
      return data;
    } catch (e: any) {
      setError(e.message);
      if (localPrefs) return localPrefs;
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updatePreferences = async (updates: Partial<UserPreferences>): Promise<UserPreferences | null> => {
    if (!user) return null;
    
    setLoading(true);
    setError(null);

    // 1. Optimistically update local storage
    const localPrefs = getUserPreferences(user.id);
    const updatedLocalPrefs = { ...localPrefs, ...updates, id: user.id } as UserPreferences;
    saveUserPreferences(updatedLocalPrefs);

    // 2. Try to update Supabase
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      saveUserPreferences(data); // Update local cache with final data from server
      return data;
    } catch (e: any) {
      setError(e.message);
      // If update fails, the change is still saved locally.
      return updatedLocalPrefs; // Return the locally updated prefs
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchPreferences,
    updatePreferences,
    loading,
    error
  };
}
