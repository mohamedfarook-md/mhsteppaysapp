// screens/Home.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SIZES, FONTS } from '../constants/config';
import { getProfile } from '../services/auth';
import { clearStorage } from '../utils/storage';
import Loader from '../components/Loader';

const { width } = Dimensions.get('window');

const PartnerLogo = ({ name, color, emoji }) => (
  <View style={[styles.partnerCard, { borderLeftColor: color }]}>
    <Text style={styles.partnerEmoji}>{emoji}</Text>
    <Text style={styles.partnerName}>{name}</Text>
  </View>
);

const QuickAction = ({ icon, label, onPress, color = COLORS.primary }) => (
  <TouchableOpacity style={styles.actionCard} onPress={onPress} activeOpacity={0.8}>
    <View style={[styles.actionIconBg, { backgroundColor: color + '18' }]}>
      <Text style={{ fontSize: 26 }}>{icon}</Text>
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const Home = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data.user || data);
    } catch (error) {
      if (error.response?.status === 401) {
        await clearStorage();
        navigation.replace('Login');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await clearStorage();
          navigation.replace('Login');
        },
      },
    ]);
  };

  if (loading) return <Loader fullScreen message="Loading..." />;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchProfile();
          }}
          tintColor={COLORS.primary}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header Banner */}
      <LinearGradient
        colors={['#4C1D95', '#6C2BD9', '#7C3AED']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroBanner}
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greetingText}>
              Good day, {profile?.name?.split(' ')[0] || 'User'} 👋
            </Text>
            <Text style={styles.topBarSub}>Welcome to StepPays</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.avatarBtn}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(profile?.name || 'U').charAt(0).toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Hero Content */}
        <View style={styles.heroContent}>
          <View style={styles.heroTextBlock}>
            <Text style={styles.heroHeading}>Scan. Pay.{'\n'}Done!</Text>
            <Text style={styles.heroBadge}>Paid • Secure • Reliable</Text>
          </View>
          {/* Decorative phone/QR mockup */}
          <View style={styles.heroQrMock}>
            <View style={styles.qrMockBox}>
              <View style={styles.qrRow}>
                <View style={styles.qrDot} />
                <View style={[styles.qrDot, styles.qrDotW]} />
                <View style={styles.qrDot} />
              </View>
              <View style={styles.qrRow}>
                <View style={[styles.qrDot, styles.qrDotW]} />
                <View style={styles.qrDot} />
                <View style={[styles.qrDot, styles.qrDotW]} />
              </View>
              <View style={styles.qrRow}>
                <View style={styles.qrDot} />
                <View style={[styles.qrDot, styles.qrDotW]} />
                <View style={styles.qrDot} />
              </View>
            </View>
            <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>Scanner</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Quick Actions */}
      <View style={styles.section}>
        <View style={styles.actionsRow}>
          <QuickAction
            icon="📷"
            label="Scan QR"
            onPress={() => navigation.navigate('Scanner')}
            color="#7C3AED"
          />
          <QuickAction
            icon="📋"
            label="Transaction History"
            onPress={() => navigation.navigate('History')}
            color="#0891B2"
          />
          <QuickAction
            icon="🎧"
            label="Support"
            onPress={() => navigation.navigate('Support')}
            color="#059669"
          />
        </View>
      </View>

      {/* KYC Status Banner */}
      {profile?.kycStatus === 'pending' && (
        <TouchableOpacity style={styles.kycBanner}>
          <Text style={{ fontSize: 18 }}>⚠️</Text>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.kycBannerTitle}>KYC Verification Pending</Text>
            <Text style={styles.kycBannerSub}>Complete KYC to unlock all features</Text>
          </View>
          <Text style={styles.kycArrow}>›</Text>
        </TouchableOpacity>
      )}

      {/* Our Partners */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Partners</Text>
        <View style={styles.partnersGrid}>
          <PartnerLogo name="ICICI Bank" color="#F97316" emoji="🏦" />
          <PartnerLogo name="Razorpay" color="#3B82F6" emoji="💳" />
          <PartnerLogo name="Easebuzz" color="#8B5CF6" emoji="⚡" />
          <PartnerLogo name="PayU" color="#EF4444" emoji="💰" />
        </View>
      </View>

      {/* Profile Info Card */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Info</Text>
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>Name</Text>
            <Text style={styles.profileValue}>{profile?.name || '—'}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>Mobile</Text>
            <Text style={styles.profileValue}>{profile?.mobile || '—'}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>Email</Text>
            <Text style={styles.profileValue}>{profile?.email || '—'}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>KYC Status</Text>
            <View style={[
              styles.statusBadge,
              {
                backgroundColor:
                  profile?.kycStatus === 'approved' ? '#D1FAE5' :
                    profile?.kycStatus === 'pending' ? '#FEF3C7' : '#FEE2E2'
              }
            ]}>
              <Text style={[
                styles.statusText,
                {
                  color:
                    profile?.kycStatus === 'approved' ? COLORS.success :
                      profile?.kycStatus === 'pending' ? '#92400E' : COLORS.error
                }
              ]}>
                {profile?.kycStatus ? profile.kycStatus.charAt(0).toUpperCase() + profile.kycStatus.slice(1) : 'Not Submitted'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F5FF',
  },
  heroBanner: {
    paddingTop: 56,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greetingText: {
    fontSize: SIZES.lg,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
  topBarSub: {
    fontSize: SIZES.xs,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  avatarBtn: {
    padding: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: SIZES.lg,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroTextBlock: {
    flex: 1,
  },
  heroHeading: {
    fontSize: 32,
    fontWeight: FONTS.extraBold,
    color: COLORS.white,
    lineHeight: 40,
    marginBottom: 8,
  },
  heroBadge: {
    fontSize: SIZES.xs,
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 0.5,
  },
  heroQrMock: {
    alignItems: 'center',
    marginLeft: 16,
  },
  qrMockBox: {
    width: 72,
    height: 72,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 10,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  qrRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  qrDot: {
    width: 14,
    height: 14,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  qrDotW: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: SIZES.base,
    fontWeight: FONTS.bold,
    color: COLORS.text,
    marginBottom: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  actionIconBg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: FONTS.semiBold,
    color: COLORS.text,
    textAlign: 'center',
  },
  kycBanner: {
    marginHorizontal: 24,
    marginTop: 16,
    backgroundColor: '#FFF8E1',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  kycBannerTitle: {
    fontSize: SIZES.sm,
    fontWeight: FONTS.semiBold,
    color: '#92400E',
  },
  kycBannerSub: {
    fontSize: SIZES.xs,
    color: '#B45309',
    marginTop: 2,
  },
  kycArrow: {
    fontSize: 22,
    color: '#B45309',
    fontWeight: FONTS.bold,
  },
  partnersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  partnerCard: {
    width: (width - 60) / 2,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  partnerEmoji: {
    fontSize: 22,
    marginRight: 10,
  },
  partnerName: {
    fontSize: SIZES.sm,
    fontWeight: FONTS.semiBold,
    color: COLORS.text,
  },
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  profileLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    fontWeight: FONTS.medium,
  },
  profileValue: {
    fontSize: SIZES.sm,
    color: COLORS.text,
    fontWeight: FONTS.semiBold,
    maxWidth: '60%',
    textAlign: 'right',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: SIZES.xs,
    fontWeight: FONTS.semiBold,
  },
});

export default Home;
