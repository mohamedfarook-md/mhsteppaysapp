// screens/Splash.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getToken } from '../utils/storage';
import { getProfile } from '../services/auth';
import { clearStorage } from '../utils/storage';
import { COLORS, SIZES, FONTS } from '../constants/config';

const { width, height } = Dimensions.get('window');

const Splash = ({ navigation }) => {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 60,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 400,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(checkAuth, 2200);
    return () => clearTimeout(timer);
  }, []);

  const checkAuth = async () => {
    try {
      const token = await getToken();
      if (token) {
        const profile = await getProfile();
        if (profile) {
          navigation.replace('Home');
        } else {
          await clearStorage();
          navigation.replace('Login');
        }
      } else {
        navigation.replace('Login');
      }
    } catch {
      await clearStorage();
      navigation.replace('Login');
    }
  };

  return (
    <LinearGradient
      colors={['#5A20C0', '#6C2BD9', '#8B4FE8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Background circles */}
      <View style={styles.circleLarge} />
      <View style={styles.circleSmall} />

      <Animated.View
        style={[
          styles.logoContainer,
          { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
        ]}
      >
        <View style={styles.logoCircle}>
          <Text style={styles.logoLetter}>S</Text>
        </View>
      </Animated.View>

      <Animated.View style={{ opacity: textOpacity, alignItems: 'center' }}>
        <Text style={styles.brandName}>MHStepPays</Text>
        <Text style={styles.tagline}>Smart Payments for{'\n'}Every Business</Text>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Secure • Fast • Reliable</Text>
        <View style={styles.dotsRow}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.dot, i === 1 && styles.dotActive]} />
          ))}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleLarge: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: 'rgba(255,255,255,0.04)',
    top: -width * 0.4,
    right: -width * 0.3,
  },
  circleSmall: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: -width * 0.2,
    left: -width * 0.2,
  },
  logoContainer: {
    marginBottom: 28,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  logoLetter: {
    fontSize: 48,
    fontWeight: FONTS.extraBold,
    color: COLORS.white,
  },
  brandName: {
    fontSize: 36,
    fontWeight: FONTS.extraBold,
    color: COLORS.white,
    letterSpacing: 1,
    marginBottom: 12,
  },
  tagline: {
    fontSize: SIZES.base,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: FONTS.regular,
  },
  footer: {
    position: 'absolute',
    bottom: 56,
    alignItems: 'center',
  },
  footerText: {
    fontSize: SIZES.sm,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1,
    marginBottom: 16,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotActive: {
    width: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
});

export default Splash;
