import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AppearanceProvider } from '@/contexts/AppearanceContext';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import ErrorBoundary from '@/components/ErrorBoundary';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  usePushNotifications();

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="article/[id]" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="category/[id]" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="settings" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="profile" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="help" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="notification" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="privacy" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="about" options={{ headerShown: false, presentation: 'modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Inter-Regular': require('@/assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('@/assets/fonts/Inter-Medium.ttf'),
    'Inter-SemiBold': require('@/assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Bold': require('@/assets/fonts/Inter-Bold.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <LanguageProvider>
          <AppearanceProvider>
            <RootLayoutNav />
          </AppearanceProvider>
        </LanguageProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
