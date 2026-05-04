// screens/Register.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants/config';
import Button from '../components/Button';
import Input from '../components/Input';
import { registerUser } from '../services/auth';
import { saveToken, saveUser } from '../utils/storage';

const Register = ({ navigation }) => {
  const [form, setForm] = useState({ name: '', mobile: '', email: '', password: '' });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: null });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.mobile || form.mobile.length < 10) e.mobile = 'Enter a valid 10-digit mobile';
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!agreed) e.agreed = 'You must agree to Terms & Conditions';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await registerUser(form);
      if (data.token) {
        await saveToken(data.token);
        if (data.user) await saveUser(data.user);
        navigation.replace('KYC');
      } else {
        Alert.alert('Registration Failed', data.message || 'Please try again');
      }
    // } catch (error) {
    //   const msg = error.response?.data?.message || 'Registration failed. Please try again.';
    //   Alert.alert('Error', msg);
    // }
     } catch (error) {
  console.log("REGISTER ERROR FULL:", error);
  console.log("REGISTER ERROR DATA:", error?.response?.data);

  const msg =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    "Registration failed";

  Alert.alert("Error", msg);
} 
    finally {
      setLoading(false);
    }
  };

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
        {/* Back button */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        {/* Title */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join StepPays today</Text>
        </View>

        {/* Form */}
        <Input
          label="Full Name"
          value={form.name}
          onChangeText={(v) => update('name', v)}
          placeholder="Enter your name"
          autoCapitalize="words"
          error={errors.name}
        />

        <Input
          label="Mobile Number"
          value={form.mobile}
          onChangeText={(v) => update('mobile', v)}
          placeholder="Enter mobile number"
          keyboardType="phone-pad"
          maxLength={10}
          error={errors.mobile}
        />

        <Input
          label="Email (optional)"
          value={form.email}
          onChangeText={(v) => update('email', v)}
          placeholder="Enter email (optional)"
          keyboardType="email-address"
          error={errors.email}
        />

        <Input
          label="Password"
          value={form.password}
          onChangeText={(v) => update('password', v)}
          placeholder="Enter password"
          secureTextEntry
          error={errors.password}
        />

        {/* Terms */}
        <TouchableOpacity
          style={styles.termsRow}
          onPress={() => setAgreed(!agreed)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
            {agreed && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.termsText}>
            I agree to{' '}
            <Text style={styles.termsLink}>Terms & Conditions</Text>
          </Text>
        </TouchableOpacity>
        {errors.agreed && <Text style={styles.errorText}>{errors.agreed}</Text>}

        <Button
          title="Register"
          onPress={handleRegister}
          loading={loading}
          size="lg"
          style={styles.registerBtn}
        />

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
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
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  backBtn: {
    marginTop: 56,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  backArrow: {
    fontSize: 22,
    color: COLORS.text,
    fontWeight: FONTS.bold,
  },
  headerSection: {
    marginBottom: 32,
  },
  title: {
    fontSize: SIZES.xxxl,
    fontWeight: FONTS.bold,
    color: COLORS.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: SIZES.base,
    color: COLORS.textLight,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: FONTS.bold,
  },
  termsText: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: FONTS.semiBold,
  },
  errorText: {
    fontSize: SIZES.xs,
    color: COLORS.error,
    marginTop: 4,
    marginBottom: 8,
  },
  registerBtn: {
    marginTop: 20,
    marginBottom: 20,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
  },
  loginLink: {
    fontSize: SIZES.sm,
    color: COLORS.primary,
    fontWeight: FONTS.bold,
  },
});

export default Register;
