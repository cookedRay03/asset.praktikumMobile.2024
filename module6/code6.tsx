// 1.1 IMPORT SECTION
import React, { useEffect, useRef } from 'react';
import { Stack, useRouter } from 'expo-router';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

// 1.2 CONFIGURE FOREGROUND BEHAVIOR (MANDATORY)
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export default function RootLayout() {
  const router = useRouter();
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    // 2.1 COLD START HANDLER (App opened from killed state by tapping notification)
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        const data = response.notification.request.content.data;
        console.log('Cold start payload:', data);
        if (data?.screen) {
          router.push(data.screen as any);
        }
      }
    });

    // 2.2 FOREGROUND LISTENER (Alert arrived while user is active in app)
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Foreground notification:', notification.request.content);
    });

    // 2.3 CODELAB 3: RESPONSE LISTENER (User tapped banner in system tray)
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      console.log('Notification tapped with data payload:', data);

      // 💡 Hint: Lakukan in-app deep linking ke data.screen
      if (data?.screen) {
        router.push(data.screen as any);
      }
    });

    // 2.4 CLEANUP SUBSCRIPTIONS (Prevent memory leaks)
    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#09090b' } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="local" />
      <Stack.Screen name="push" />
    </Stack>
  );
}
