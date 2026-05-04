// screens/Scanner.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Animated,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { COLORS, SIZES, FONTS } from '../constants/config';
import { handleQRNavigation } from '../utils/qrHandler';


const { width, height } = Dimensions.get('window');
const SCAN_FRAME = width * 0.68;

const Scanner = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  
   useEffect(() => {
  if (!permission) {
    requestPermission();
  }
}, [permission]);

  useEffect(() => {
    // (async () => {
    //   // const { status } = await BarCodeScanner.requestPermissionsAsync();
    //   // const { status } = await Camera.requestCameraPermissionsAsync();
    //   // setHasPermission(status === 'granted');
    // })();             

    // Scan line animation
   
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const scanLineY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCAN_FRAME - 4],
  });

  const handleBarCodeScanned = async ({ data }) => {
    if (scanned) return;
    setScanned(true);

    const result = await handleQRNavigation(data, navigation);
    if (result?.error) {
      Alert.alert('Invalid QR', result.error, [
        { text: 'Scan Again', onPress: () => setScanned(false) },
      ]);
    }
  };

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text style={styles.permText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>📷</Text>
        <Text style={styles.permTitle}>Camera Access Required</Text>
        <Text style={styles.permText}>
          Please enable camera access in your device settings to scan QR codes.
        </Text>
        <TouchableOpacity
          style={styles.permBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.permBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        torch={torchOn ? 'on' : 'off'}
        style={StyleSheet.absoluteFillObject}
      /> */}
     <CameraView
  style={StyleSheet.absoluteFillObject}
  onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
/>
      {/* Overlay */}
      <View style={styles.overlay}>
        {/* Top */}
        <View style={styles.overlayTop}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.headerBtnText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Scan QR Code</Text>
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => setTorchOn(!torchOn)}
            >
              <Text style={styles.headerBtnText}>{torchOn ? '🔦' : '⚡'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Middle row */}
        <View style={styles.middleRow}>
          <View style={styles.overlaySide} />

          {/* Scan Frame */}
          <View style={styles.scanFrame}>
            {/* Corner marks */}
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />

            {/* Scanning line */}
            <Animated.View
              style={[
                styles.scanLine,
                { transform: [{ translateY: scanLineY }] },
              ]}
            />
          </View>

          <View style={styles.overlaySide} />
        </View>

        {/* Bottom */}
        <View style={styles.overlayBottom}>
          <Text style={styles.hintText}>Align QR code within the frame</Text>

          {scanned && (
            <TouchableOpacity
              style={styles.rescanBtn}
              onPress={() => setScanned(false)}
            >
              <Text style={styles.rescanText}>🔄  Scan Again</Text>
            </TouchableOpacity>
          )}

          {/* QR Type hints */}
          <View style={styles.hintCards}>
            <View style={styles.hintCard}>
              <Text style={styles.hintCardEmoji}>📲</Text>
              <Text style={styles.hintCardText}>UPI QR</Text>
            </View>
            <View style={styles.hintCard}>
              <Text style={styles.hintCardEmoji}>🏪</Text>
              <Text style={styles.hintCardText}>Merchant QR</Text>
            </View>
            <View style={styles.hintCard}>
              <Text style={styles.hintCardEmoji}>🔗</Text>
              <Text style={styles.hintCardText}>StepPays QR</Text>
            </View>
          </View>

          <View style={styles.secureRow}>
            <Text style={{ fontSize: 14 }}>🔒</Text>
            <Text style={styles.secureText}>Secure by StepPays</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const OVERLAY_COLOR = 'rgba(0,0,0,0.65)';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A0A0A',
    padding: 32,
  },
  permTitle: {
    fontSize: SIZES.xl,
    fontWeight: FONTS.bold,
    color: COLORS.white,
    marginBottom: 12,
    textAlign: 'center',
  },
  permText: {
    fontSize: SIZES.base,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 24,
  },
  permBtn: {
    marginTop: 24,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
  },
  permBtnText: {
    color: COLORS.white,
    fontWeight: FONTS.semiBold,
    fontSize: SIZES.base,
  },
  overlay: {
    flex: 1,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: OVERLAY_COLOR,
  },
  middleRow: {
    flexDirection: 'row',
    height: SCAN_FRAME,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: OVERLAY_COLOR,
  },
  scanFrame: {
    width: SCAN_FRAME,
    height: SCAN_FRAME,
    overflow: 'hidden',
  },
  overlayBottom: {
    flex: 1.2,
    backgroundColor: OVERLAY_COLOR,
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBtnText: {
    fontSize: 20,
    color: COLORS.white,
    fontWeight: FONTS.bold,
  },
  headerTitle: {
    fontSize: SIZES.lg,
    fontWeight: FONTS.bold,
    color: COLORS.white,
    flex: 1,
    textAlign: 'center',
  },
  // Corner marks
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: COLORS.primary,
  },
  tl: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 6,
  },
  tr: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 6,
  },
  bl: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 6,
  },
  br: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 6,
  },
  scanLine: {
    height: 2,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  hintText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: SIZES.sm,
    marginBottom: 20,
    fontWeight: FONTS.medium,
  },
  rescanBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginBottom: 20,
  },
  rescanText: {
    color: COLORS.white,
    fontWeight: FONTS.semiBold,
    fontSize: SIZES.base,
  },
  hintCards: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  hintCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    minWidth: 80,
  },
  hintCardEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  hintCardText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    fontWeight: FONTS.medium,
    textAlign: 'center',
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  secureText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: SIZES.xs,
    letterSpacing: 0.5,
  },
});

export default Scanner;
