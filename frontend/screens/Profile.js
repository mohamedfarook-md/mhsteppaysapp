import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SPACING, RADIUS } from '../constants/config';
import { getProfile } from '../services/auth';
import { clearStorage } from '../utils/storage';
import { InlineLoader } from '../components/Loader';

const MenuItem = ({ icon, label, onPress, danger }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <Text style={styles.menuIcon}>{icon}</Text>
    <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
    <Text style={styles.menuArrow}>›</Text>
  </TouchableOpacity>
);

const Profile = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const loadProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data.user || data);
    } catch {}
    finally { setLoading(false); }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout', style: 'destructive',
        onPress: async () => {
          await clearStorage();
          navigation.replace('Login');
        },
      },
    ]);
  };

  const kycStatusColor = {
    approved: COLORS.success,
    pending: COLORS.warning,
    rejected: COLORS.error,
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <InlineLoader size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={styles.profileName}>{profile?.name || 'User'}</Text>
        <Text style={styles.profileMobile}>{profile?.mobile || '–'}</Text>
        {profile?.email && <Text style={styles.profileEmail}>{profile.email}</Text>}

        {/* KYC Badge */}
        <View style={[styles.kycBadge, {
          backgroundColor: (kycStatusColor[profile?.kycStatus] || COLORS.warning) + '18'
        }]}>
          <Text style={[styles.kycBadgeText, {
            color: kycStatusColor[profile?.kycStatus] || COLORS.warning
          }]}>
            {profile?.kycStatus === 'approved' ? '✅ KYC Verified' :
              profile?.kycStatus === 'pending' ? '⏳ KYC Pending' : '❌ KYC Not Submitted'}
          </Text>
        </View>
      </View>

      {/* Menu */}
      <View style={styles.menuSection}>
        <Text style={styles.menuSectionTitle}>Account</Text>
        <View style={styles.menuCard}>
          <MenuItem icon="📋" label="Transaction History" onPress={() => navigation.navigate('History')} />
          <MenuItem icon="🔐" label="KYC Documents" onPress={() => navigation.navigate('KYC')} />
          <MenuItem icon="🎧" label="Support" onPress={() => navigation.navigate('SupportScreen')} />
        </View>

        <Text style={styles.menuSectionTitle}>App</Text>
        <View style={styles.menuCard}>
          <MenuItem icon="ℹ️" label="About StepPays" onPress={() => {}} />
          <MenuItem icon="📄" label="Terms & Conditions" onPress={() => {}} />
          <MenuItem icon="🔒" label="Privacy Policy" onPress={() => {}} />
        </View>

        <View style={styles.menuCard}>
          <MenuItem icon="🚪" label="Logout" onPress={handleLogout} danger />
        </View>
      </View>

      <View style={styles.version}>
        <Text style={styles.versionText}>StepPays v1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  avatarSection: {
    backgroundColor: COLORS.primary, alignItems: 'center',
    paddingTop: 40, paddingBottom: 32, marginBottom: 16,
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  avatarText: { fontSize: 36, fontWeight: '800', color: '#fff' },
  profileName: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 4 },
  profileMobile: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 2 },
  profileEmail: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 12 },
  kycBadge: {
    paddingVertical: 6, paddingHorizontal: 16,
    borderRadius: RADIUS.full, marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  kycBadgeText: { fontSize: 13, fontWeight: '700', color: '#fff' },

  menuSection: { paddingHorizontal: SPACING.md, gap: 8 },
  menuSectionTitle: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginTop: 8, marginBottom: 6 },
  menuCard: {
    backgroundColor: '#fff', borderRadius: RADIUS.lg,
    overflow: 'hidden', marginBottom: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: SPACING.md,
    borderBottomWidth: 1, borderBottomColor: COLORS.grayBorder,
  },
  menuIcon: { fontSize: 18, marginRight: 12 },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: COLORS.text },
  menuLabelDanger: { color: COLORS.error },
  menuArrow: { fontSize: 20, color: COLORS.textSecondary },

  version: { alignItems: 'center', paddingVertical: 24 },
  versionText: { fontSize: 12, color: COLORS.textSecondary },
});

export default Profile;