// 1.1 IMPORT SECTION
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, Alert, ActivityIndicator, RefreshControl, Keyboard
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

// 1.2 INTERFACE / TYPE DEFINITION
interface Mission {
  id: string;
  title: string;
  reward_points: number;
  status: 'pending' | 'completed';
  created_at: string;
}

export default function TacticalHQScreen() {
  // 1.3 COMPONENT & STATE INITIALIZATION
  const { user, signOut } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [missionTitle, setMissionTitle] = useState('');
  const [rewardXP, setRewardXP] = useState('150');
  const [submitting, setSubmitting] = useState(false);

  // 1.4 SUPABASE CRUD OPERATIONS
  // 2.1 READ: FETCH ALL MISSIONS
  const fetchMissions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMissions(data || []);
    } catch (error: any) {
      Alert.alert('Sync Error', error.message || 'Failed to fetch mission board');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMissions();
  };

  // 2.2 CREATE: INSERT NEW MISSION
  const handleCreateMission = async () => {
    if (!missionTitle.trim()) {
      Alert.alert('Hold Up', 'Please provide an objective title for the mission.');
      return;
    }

    const points = parseInt(rewardXP, 10) || 100;
    try {
      setSubmitting(true);
      const { error } = await supabase.from('missions').insert([
        {
          title: missionTitle.trim(),
          reward_points: points,
          user_id: user?.id,
        },
      ]);

      if (error) throw error;
      setMissionTitle('');
      setRewardXP('150');
      Keyboard.dismiss();
      fetchMissions();
    } catch (error: any) {
      Alert.alert('Dispatch Error', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // 2.3 UPDATE: TOGGLE STATUS (OPTIMISTIC UI)
  const handleToggleStatus = async (item: Mission) => {
    const nextStatus = item.status === 'completed' ? 'pending' : 'completed';
    // Optimistic UI Update
    setMissions((prev) =>
      prev.map((m) => (m.id === item.id ? { ...m, status: nextStatus } : m))
    );

    try {
      const { error } = await supabase
        .from('missions')
        .update({ status: nextStatus })
        .eq('id', item.id);

      if (error) throw error;
    } catch (error: any) {
      Alert.alert('Status Update Failed', error.message);
      fetchMissions();
    }
  };

  // 2.4 DELETE: REMOVE MISSION (OPTIMISTIC UI)
  const handleDeleteMission = async (id: string) => {
    setMissions((prev) => prev.filter((m) => m.id !== id));
    try {
      const { error } = await supabase.from('missions').delete().eq('id', id);
      if (error) throw error;
    } catch (error: any) {
      Alert.alert('Delete Failed', error.message);
      fetchMissions();
    }
  };

  // 1.5 LIST ITEM RENDER COMPONENT
  const renderMissionItem = ({ item }: { item: Mission }) => {
    const isDone = item.status === 'completed';
    return (
      <View style={styles.missionCard}>
        <TouchableOpacity
          style={styles.missionMainTouch}
          onPress={() => handleToggleStatus(item)}
          activeOpacity={0.7}
        >
          <Text style={styles.statusBadgeIcon}>{isDone ? '✅' : '⏳'}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.missionTitle, isDone && styles.missionTitleDone]}>
              {item.title}
            </Text>
            <Text style={styles.rewardXPText}>+{item.reward_points} Tactical XP</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteMission(item.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // 1.6 MAIN SCREEN RENDER & UI LAYOUT
  return (
    <View style={styles.screenContainer}>
      {/* 2.5 HEADER SECTION */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>COMMAND HQ OPERATIVE ACTIVE</Text>
          <Text style={styles.callsignHeading}>
            {user?.user_metadata?.callsign || user?.email?.split('@')[0] || 'Hero'}
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
          <Text style={styles.logoutBtnText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* 2.6 FORM DISPATCH MISSION SECTION */}
      <View style={styles.formCard}>
        <Text style={styles.formLabel}>DISPATCH NEW MISSION</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Mission objective..."
          placeholderTextColor="#64748b"
          value={missionTitle}
          onChangeText={setMissionTitle}
        />
        <View style={styles.formRow}>
          <TextInput
            style={[styles.textInput, { flex: 1, marginBottom: 0 }]}
            placeholder="Reward XP"
            placeholderTextColor="#64748b"
            value={rewardXP}
            onChangeText={setRewardXP}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={[styles.dispatchBtn, submitting && { opacity: 0.6 }]}
            onPress={handleCreateMission}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.dispatchBtnText}>Dispatch</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* 2.7 ACTIVE MISSION LIST & EMPTY STATE */}
      <View style={styles.listHeaderRow}>
        <Text style={styles.sectionHeading}>ACTIVE MISSIONS</Text>
        <Text style={styles.badgeCount}>{missions.length} QUEUED</Text>
      </View>

      {loading ? (
        <View style={styles.loadingArea}>
          <ActivityIndicator size="large" color="#38bdf8" />
          <Text style={styles.loadingText}>Connecting to PostgreSQL...</Text>
        </View>
      ) : (
        <FlatList
          data={missions}
          keyExtractor={(item) => item.id}
          renderItem={renderMissionItem}
          contentContainerStyle={{ paddingBottom: 30 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#38bdf8" />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>☕</Text>
              <Text style={styles.emptyTitle}>No active tactical missions!</Text>
              <Text style={styles.emptySubtitle}>All sectors are secure.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

// 1.7 STYLESHEET SECTION
const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: '#020617', paddingHorizontal: 20, paddingTop: 54 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerSub: { color: '#38bdf8', fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  callsignHeading: { color: '#f8fafc', fontSize: 22, fontWeight: '800', marginTop: 2 },
  logoutBtn: { backgroundColor: '#1e293b', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: '#334155' },
  logoutBtnText: { color: '#f87171', fontWeight: '700', fontSize: 12 },
  formCard: { backgroundColor: '#0f172a', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#1e293b', marginBottom: 20 },
  formLabel: { color: '#94a3b8', fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 10 },
  textInput: { backgroundColor: '#1e293b', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, color: '#f8fafc', fontSize: 14, borderWidth: 1, borderColor: '#334155', marginBottom: 10 },
  formRow: { flexDirection: 'row', gap: 10 },
  dispatchBtn: { backgroundColor: '#0284c7', borderRadius: 12, paddingHorizontal: 18, justifyContent: 'center', alignItems: 'center' },
  dispatchBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 13 },
  listHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionHeading: { color: '#64748b', fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  badgeCount: { color: '#38bdf8', fontSize: 11, fontWeight: '700', backgroundColor: '#082f49', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  missionCard: { backgroundColor: '#0f172a', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#1e293b' },
  missionMainTouch: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  statusBadgeIcon: { fontSize: 20, marginRight: 12 },
  missionTitle: { color: '#f8fafc', fontSize: 15, fontWeight: '600' },
  missionTitleDone: { textDecorationLine: 'line-through', color: '#64748b' },
  rewardXPText: { color: '#38bdf8', fontSize: 12, fontWeight: '700', marginTop: 2 },
  deleteButton: { padding: 8, marginLeft: 8 },
  deleteButtonText: { color: '#ef4444', fontSize: 16, fontWeight: '700' },
  loadingArea: { alignItems: 'center', marginTop: 40 },
  loadingText: { color: '#64748b', fontSize: 12, marginTop: 10 },
  emptyState: { alignItems: 'center', marginTop: 40, paddingHorizontal: 20 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { color: '#f8fafc', fontSize: 16, fontWeight: '700' },
  emptySubtitle: { color: '#64748b', fontSize: 13, textAlign: 'center', marginTop: 4, lineHeight: 18 },
});
