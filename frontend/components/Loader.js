// components/Loader.js
import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants/config';
import { Image } from 'react-native';

const Loader = ({ message = 'Loading...', fullScreen = false, overlay = false }) => {
  if (fullScreen) {
    return (
      <View style={styles.fullScreen}>
        <View style={styles.card}>
          {/* <ActivityIndicator size="large" color={COLORS.primary} /> */}
          <Image
           source={require('../assets/images/logo.png')}
           style={styles.logo}
           resizeMode="contain"
          />

          <ActivityIndicator
           size="small"
           color={COLORS.primary}
           style={{ marginTop: 10 }}
          />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    );
  }

  if (overlay) {
    return (
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* <ActivityIndicator size="large" color={COLORS.primary} /> */}
           <Image
           source={require('../assets/images/logo.png')}
           style={styles.logo}
           resizeMode="contain"
          />

          <ActivityIndicator
           size="small"
           color={COLORS.primary}
           style={{ marginTop: 10 }}
          />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.inline}>
      <ActivityIndicator size="small" color={COLORS.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    minWidth: 160,
  },
  logo: {
  width: 70,
  height: 70,
  },
  message: {
    marginTop: 16,
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    fontWeight: FONTS.medium,
    textAlign: 'center',
  },
  inline: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Loader;
