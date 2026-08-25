// 1.1 IMPORT SECTION
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Clipboard from 'expo-clipboard';
import { registerForPushNotificationsAsync } from '../lib/notificationService';

export default function PushScreen() {
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // 1.2 RETRIEVE PUSH TOKEN
  const handleGetToken = async () => {
    setLoading(true);
    try {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        setExpoPushToken(token);
        Alert.alert('Token Acquired', 'Device address ready to receive cloud alerts.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // 1.3 COPY TOKEN TO CLIPBOARD
  const copyToClipboard = async () => {
    if (!expoPushToken) return;
    await Clipboard.setStringAsync(expoPushToken);
    Alert.alert('Copied', 'Push token copied to clipboard.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Push Token Generator</Text>
        <Text style={styles.subtitle}>Retrieve unique ExponentPushToken to receive remote notifications.</Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>EXPONENT PUSH TOKEN</Text>
          <Text style={styles.tokenBox} numberOfLines={3} selectable>
            {expoPushToken || 'No token generated yet. Tap the button below.'}
          </Text>

          {expoPushToken ? (
            <TouchableOpacity style={styles.copyBtn} onPress={copyToClipboard} activeOpacity={0.8}>
              <Text style={styles.copyBtnText}>Copy Token</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          style={[styles.primaryBtn, loading && styles.btnDisabled]}
          onPress={handleGetToken}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#09090b" size="small" />
          ) : (
            <Text style={styles.primaryBtnText}>Generate Push Token</Text>
          )}
        </TouchableOpacity>
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
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27272a',
    marginBottom: 12,
  },
  cardLabel: {
    color: '#71717a',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  tokenBox: {
    color: '#fafafa',
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 10,
  },
  copyBtn: {
    backgroundColor: '#18181b',
    paddingVertical: 7,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27272a',
  },
  copyBtnText: {
    color: '#d4d4d8',
    fontSize: 11,
    fontWeight: '700',
  },
  primaryBtn: {
    backgroundColor: '#fafafa',
    height: 42,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  primaryBtnText: {
    color: '#09090b',
    fontWeight: '700',
    fontSize: 13,
  },
});
