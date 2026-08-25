// 1.1 IMPORT SECTION
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';

// 1.2 FOREGROUND NOTIFICATION HANDLER (MANDATORY)
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

export default function LocalNotificationScreen() {
  const [scheduledId, setScheduledId] = useState<string | null>(null);

  // 2.1 TRIGGER INSTANT LOCAL NOTIFICATION
  const triggerInstantNotification = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Web Mode', 'Local notifications require physical mobile device.');
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Tactical HQ Alert',
        body: 'Perimeter check completed. All sectors secure.',
        data: { sector: 'Sector-7', priority: 'High' },
      },
      trigger: null, // null = fires immediately!
    });
  };

  // 2.2 TRIGGER SCHEDULED 5-SECOND TIMER
  const scheduleFiveSecondNotification = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Web Mode', 'Local notifications require physical mobile device.');
      return;
    }

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Delayed Extraction Alert',
        body: 'Helicopter arriving at Extraction Point Alpha in 5 seconds!',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 5,
        repeats: false,
      },
    });
    setScheduledId(id);
    Alert.alert('Scheduled', 'Extraction alert set for 5 seconds from now.');
  };

  // 2.3 CANCEL SCHEDULED NOTIFICATION
  const cancelScheduledAlert = async () => {
    if (!scheduledId) {
      Alert.alert('Notice', 'No active scheduled notification to cancel.');
      return;
    }
    await Notifications.cancelScheduledNotificationAsync(scheduledId);
    setScheduledId(null);
    Alert.alert('Canceled', 'Scheduled extraction alert has been aborted.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Local Notifications</Text>
        <Text style={styles.subtitle}>Test instant offline alerts and delayed system tray timers.</Text>

        <View style={styles.card}>
          <TouchableOpacity style={styles.primaryBtn} onPress={triggerInstantNotification} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>Trigger Instant Notification</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} onPress={scheduleFiveSecondNotification} activeOpacity={0.85}>
            <Text style={styles.secondaryBtnText}>Schedule Alert (5 Seconds)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dangerBtn} onPress={cancelScheduledAlert} activeOpacity={0.85}>
            <Text style={styles.dangerBtnText}>Cancel Scheduled Alert</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  headerTitle: {
    color: '#fafafa',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    color: '#71717a',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#121215',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  primaryBtn: {
    backgroundColor: '#fafafa',
    height: 42,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  primaryBtnText: {
    color: '#09090b',
    fontWeight: '700',
    fontSize: 13,
  },
  secondaryBtn: {
    backgroundColor: '#18181b',
    height: 42,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27272a',
    marginBottom: 8,
  },
  secondaryBtnText: {
    color: '#fafafa',
    fontWeight: '700',
    fontSize: 13,
  },
  dangerBtn: {
    backgroundColor: '#18181b',
    height: 42,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#44403c',
  },
  dangerBtnText: {
    color: '#d4d4d8',
    fontWeight: '700',
    fontSize: 13,
  },
});
