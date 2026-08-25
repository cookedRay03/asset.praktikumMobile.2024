// 1.1 IMPORT SECTION
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// 1.2 PUSH TOKEN REGISTRATION PIPELINE
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  let token: string | null = null;

  // STEP 1: PHYSICAL DEVICE CHECK
  if (!Device.isDevice) {
    alert('Must use physical device for Remote Push Notifications! Emulators lack hardware push antennas.');
    return null;
  }

  // STEP 2: ANDROID NOTIFICATION CHANNEL CONFIGURATION (Android 8.0+)
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'General Tactical Notifications',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#ffffff',
      sound: 'default',
    });
  }

  // STEP 3: REQUEST PERMISSIONS
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Permission Denied: Push alerts disabled.');
    return null;
  }

  // STEP 4: RETRIEVE THE UNIQUE EXPONENT PUSH TOKEN
  try {
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    const pushTokenData = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined
    );
    token = pushTokenData.data;
    console.log('Your Device Push Token:', token);
  } catch (error) {
    console.error('Failed to obtain push token:', error);
  }

  return token;
}
