import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function SecureVaultDemo() {
  const [tokenInput, setTokenInput] = useState('');
  const [storedToken, setStoredToken] = useState<string | null>(null);

  const saveToken = async () => {
    if (!tokenInput.trim()) {
      Alert.alert('Error', 'Please enter a valid token');
      return;
    }
    await SecureStore.setItemAsync('hero_license_token', tokenInput.trim());
    setTokenInput('');
    Alert.alert('Success', 'Token encrypted and stored in SecureStore!');
  };

  const loadToken = async () => {
    const token = await SecureStore.getItemAsync('hero_license_token');
    setStoredToken(token);
  };

  const wipeToken = async () => {
    await SecureStore.deleteItemAsync('hero_license_token');
    setStoredToken(null);
    Alert.alert('Wiped', 'Token removed from vault');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Encrypted Vault Demo</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Hero License Token..."
        placeholderTextColor="#64748b"
        value={tokenInput}
        onChangeText={setTokenInput}
      />
      <TouchableOpacity style={styles.btn} onPress={saveToken}>
        <Text style={styles.btnText}>Save Token</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={loadToken}>
        <Text style={styles.btnText}>Load Token</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btn, styles.dangerBtn]} onPress={wipeToken}>
        <Text style={styles.btnText}>Wipe Token</Text>
      </TouchableOpacity>
      {storedToken && <Text style={styles.tokenText}>Vault Value: {storedToken}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#0f172a', borderRadius: 12 },
  title: { color: '#f8fafc', fontSize: 18, fontWeight: '700', marginBottom: 12 },
  input: { backgroundColor: '#1e293b', color: '#f8fafc', padding: 12, borderRadius: 8, marginBottom: 10 },
  btn: { backgroundColor: '#0284c7', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 8 },
  dangerBtn: { backgroundColor: '#ef4444' },
  btnText: { color: '#fff', fontWeight: '700' },
  tokenText: { color: '#38bdf8', marginTop: 10, fontWeight: '600' }
});