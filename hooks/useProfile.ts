import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  preferred_language: 'fr' | 'ht';
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user } = useAuth();
  const { setLanguage } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (): Promise<UserProfile | null> => {
    if (!user) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Si le profil n'existe pas, le créer automatiquement
      if (error && error.code === 'PGRST116') {
        const newProfile: UserProfile = {
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || null,
          preferred_language: 'fr',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { data: insertedData, error: insertError } = await supabase
          .from('user_profiles')
          .insert(newProfile)
          .select()
          .single();

        if (insertError) throw insertError;
        return insertedData;
      }

      if (error) throw error;
      
      return data;
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<UserProfile | null> => {
    if (!user) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Mettre à jour le contexte de langue si la langue préférée est modifiée
      if (updates.preferred_language) {
        setLanguage(updates.preferred_language);
      }

      // Mettre à jour les metadata de l'utilisateur si le nom complet est modifié
      if (updates.full_name) {
        await supabase.auth.updateUser({
          data: { full_name: updates.full_name }
        });
      }

      return data;
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchProfile,
    updateProfile,
    loading,
    error
  };
}