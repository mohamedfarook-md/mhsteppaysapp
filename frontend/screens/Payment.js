// screens/Payment.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants/config';
import { getMerchantInfo, initiatePayment } from '../services/payment';
import { getProfile } from '../services/auth';
import Button from '../components/Button';
import Input from '../components/Input';
import Loader from '../components/Loader';
import { handleError } from '../utils/errorHandler';
import { TextInput } from 'react-native';
import { initiateUPI, markUPISuccess } from '../services/payment';
import * as Linking from 'expo-linking';

const Payment = ({ route, navigation }) => {
  const { merchantId, qrData, type } = route.params || {};
  const [merchant, setMerchant] = useState(null);
  const [profile, setProfile] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [amountError, setAmountError] = useState('');

  const parseUPI = (upiString) => {
  try {
    const query = upiString.split('?')[1];
    const params = new URLSearchParams(query);

    return {
      pa: params.get('pa'),
      pn: params.get('pn'),
      am: params.get('am'),
    };
  } catch {
    return {};
  }
};

  useEffect(() => {
    loadData();
  }, []);



const loadData = async () => {
  try {
    // 🔵 UPI QR HANDLE
    if (type === 'upi') {
      const upi = parseUPI(qrData);

      setMerchant({
        name: upi.pn ? decodeURIComponent(upi.pn) : "UPI Merchant",
        upiId: upi.pa || "Unknown UPI",
      });

      setAmount(upi.am || '');

      const profileData = await getProfile();
      // setProfile(profileData.user || profileData);

      setLoading(false);
      return;
    }

 
    let merchantData = null;
let profileData = null;

// 🔵 Merchant API
try {
  merchantData = await getMerchantInfo(merchantId);
} catch (err) {
  console.log("Merchant error:", err);
}

// 🔵 Profile API
try {
  profileData = await getProfile();
} catch (err) {
  console.log("Profile error:", err);
}

// ✅ Set data safely
if (merchantData) {
  setMerchant(merchantData.merchant || merchantData);
}

if (profileData) {
  setProfile(profileData.user || profileData);
}

  }
  
   finally {
    setLoading(false);
  }
};






const handlePay = async () => {
  const num = parseFloat(amount);

  if (!num || num <= 0) {
    Alert.alert("Enter valid amount");
    return;
  }

  // // 🔥 UPI FLOW
  // if (merchant?.upiId) {
  //   try {
  //     const res = await initiateUPI({
  //       merchantId,
  //       merchantName: merchant.name,
  //       amount: num
  //     });

  //     const txnId = res.data.data.txnId;

  //     const upiUrl = `upi://pay?pa=${merchant.upiId}&pn=${merchant.name}&am=${num}&cu=INR`;

  //     await Linking.openURL(upiUrl);

  //     // assume success
  //     await markUPISuccess({ txnId });

  //     navigation.navigate("Home");

  //   } catch (err) {
  //     console.log(err);
  //     Alert.alert("UPI Payment Failed");
  //   }

  // } 
  // 🔥 UPI FLOW
if (merchant?.upiId) {
  try {

    const res = await initiateUPI({
      merchantId,
      merchantName: merchant.name,
      amount: num
    });

    const txnId = res.data.data.txnId;

    // ✅ UPDATED UPI URL
    const upiUrl =
      `upi://pay?pa=${merchant.upiId}` +
      `&pn=${encodeURIComponent(merchant.name)}` +
      `&tr=${txnId}` +
      `&tn=${encodeURIComponent("Payment")}` +
      `&am=${num}` +
      `&cu=INR`;

    console.log("UPI URL:", upiUrl);

    await Linking.openURL(upiUrl);

    // 🔥 TEMP SUCCESS ASSUME
    await markUPISuccess({ txnId });

    navigation.navigate("Home");

  } catch (err) {

    console.log("UPI ERROR:", err);

    Alert.alert("UPI Payment Failed");
  }
}
  else {
    // 🔥 PAYU FLOW
    const data = await initiatePayment({
      merchantId,
      merchantName: merchant.name,
      amount: num,
      customerName: profile?.data?.user?.name,
      customerEmail: profile?.data?.user?.email,
      customerPhone: profile?.data?.user?.mobile,
    });

    navigation.navigate("PayUWebView", { paymentData: data });
  }
};




  const formatAmount = (text) => {
    const cleaned = text.replace(/[^0-9.]/g, '');
    setAmount(cleaned);
    if (amountError) setAmountError('');
  };

  if (loading) return <Loader fullScreen message="Loading merchant..." />;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment Details</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Merchant Card */}
        <View style={styles.merchantCard}>
          <View style={styles.merchantIconBg}>
            <Text style={{ fontSize: 28 }}>🏪</Text>
          </View>
          <View style={styles.merchantInfo}>
            <Text style={styles.merchantLabel}>Merchant</Text>
            <Text style={styles.merchantName}>
              {merchant?.name || merchantId || 'Unknown Merchant'}
            </Text>
          {merchant?.upiId && (
  <Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
    UPI: {merchant.upiId}
  </Text>
)}
            {merchant?.category && (
              <Text style={styles.merchantCategory}>{merchant.category}</Text>
            )}
          </View>
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✓ Verified</Text>
          </View>
        </View>

        {/* Amount Input */}
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>Enter Amount</Text>
          <View style={[styles.amountInputWrapper, amountError ? styles.amountInputError : null]}>
            <Text style={styles.rupeeSymbol}>₹</Text>
           <TextInput
  value={amount}
  onChangeText={(text) => {
    const cleaned = text.replace(/[^0-9.]/g, '');
    setAmount(cleaned);
  }}
  placeholder="0.00"
  keyboardType="decimal-pad"
  style={styles.amountInput}
/>
          </View>
          {amountError ? <Text style={styles.errorText}>{amountError}</Text> : null}

          {/* Quick amounts */}
          <View style={styles.quickAmounts}>
            {['100', '250', '500', '1000'].map((q) => (
              <TouchableOpacity
                key={q}
                style={[styles.quickChip, amount === q && styles.quickChipActive]}
                onPress={() => { setAmount(q); setAmountError(''); }}
              >
                <Text style={[styles.quickChipText, amount === q && styles.quickChipTextActive]}>
                  ₹{q}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Text style={{ fontSize: 16, marginRight: 8 }}>ℹ️</Text>
          <Text style={styles.infoBannerText}>
            You will be redirected to secure payment page
          </Text>
        </View>

        {/* PayU Brand */}
        <View style={styles.payuSection}>
          <Text style={styles.payuPowered}>Powered by</Text>
          <View style={styles.payuBadge}>
            <Text style={styles.payuText}>PayU</Text>
          </View>
        </View>

        {/* Pay button */}
        <Button
          title={paying ? 'Redirecting...' : 'Proceed to Pay'}
          onPress={handlePay}
          loading={paying}
          disabled={!amount}
          size="lg"
          style={styles.payBtn}
        />

        {/* Secure footer */}
        <View style={styles.secureFooter}>
          <Text style={{ fontSize: 14 }}>🔒</Text>
          <Text style={styles.secureText}>Secure by StepPays</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    marginBottom: 28,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',

    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 22,
    color: COLORS.text,
    fontWeight: FONTS.bold,
  },
  headerTitle: {
    fontSize: SIZES.lg,
    fontWeight: FONTS.bold,
    color: COLORS.text,
  },
  merchantCard: {
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#DDD0FF',
  },
  merchantIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  merchantInfo: {
    flex: 1,
  },
  merchantLabel: {
    fontSize: SIZES.xs,
    color: COLORS.textLight,
    fontWeight: FONTS.medium,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  merchantName: {
    fontSize: SIZES.lg,
    fontWeight: FONTS.bold,
    color: COLORS.text,
  },
  merchantCategory: {
    fontSize: SIZES.xs,
    color: COLORS.textLight,
    marginTop: 2,
  },
  verifiedBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  verifiedText: {
    fontSize: 11,
    color: COLORS.success,
    fontWeight: FONTS.semiBold,
  },
  amountSection: {
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: SIZES.base,
    fontWeight: FONTS.semiBold,
    color: COLORS.text,
    marginBottom: 12,
  },
  amountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 16,
    paddingLeft: 16,
    backgroundColor: COLORS.secondary,
  },
  amountInputError: {
    borderColor: COLORS.error,
  },
  rupeeSymbol: {
    fontSize: 28,
    fontWeight: FONTS.bold,
    color: COLORS.primary,
    marginRight: 4,
  },
  amountInput: {
    fontSize: 32,
    fontWeight: FONTS.bold,
    color: COLORS.text,
    paddingVertical: 16,
  },
  errorText: {
    fontSize: SIZES.xs,
    color: COLORS.error,
    marginTop: 6,
    marginLeft: 4,
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  quickChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  quickChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.secondary,
  },
  quickChipText: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    fontWeight: FONTS.medium,
  },
  quickChipTextActive: {
    color: COLORS.primary,
    fontWeight: FONTS.semiBold,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  infoBannerText: {
    flex: 1,
    fontSize: SIZES.sm,
    color: '#4338CA',
    fontWeight: FONTS.medium,
  },
  payuSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
  },
  payuPowered: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
  },
  payuBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  payuText: {
    color: COLORS.white,
    fontWeight: FONTS.bold,
    fontSize: SIZES.sm,
    letterSpacing: 0.5,
  },
  payBtn: {
    marginBottom: 16,
  },
  secureFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secureText: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
  },
});

export default Payment;
