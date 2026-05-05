// screens/Login.js
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
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, FONTS } from '../constants/config';
import Button from '../components/Button';
import Input from '../components/Input';
import { loginUser } from '../services/auth';
import { saveToken, saveUser } from '../utils/storage';
import { handleError } from '../utils/errorHandler';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';


const Login = ({ navigation }) => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!mobile || mobile.length < 10) newErrors.mobile = 'Enter a valid 10-digit mobile number';
    if (!password || password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleLogin = async () => {
  //   if (!validate()) return;
  //   setLoading(true);
  //   try {
  //     const data = await loginUser(mobile, password);
  //     if (data.token) {
  //       await saveToken(data.token);
  //       if (data.user) await saveUser(data.user);
  //       if (data.user.kycStatus !== "approved") {
  //       navigation.replace("KYCPending");
  //       return;
  //       }
  //       navigation.replace('Home');
  //     } else {
  //       Alert.alert('Login Failed', data.message || 'Invalid credentials');
  //     }
  //   // } catch (error) {
  //   //   const msg = error.response?.data?.message || 'Login failed. Please try again.';
  //   //   Alert.alert('Error', msg);
  //     // }
  //   }
  //    catch (error) {
  //     Alert.alert('Error', handleError(error, "Login failed. Please try again."));
  //     }
  //    finally {
  //     setLoading(false);
  //   }
  // };



//   const handleLogin = async () => {
//   if (!validate()) return;

//   setLoading(true);

//   try {
//     const data = await loginUser(mobile, password);

//     if (data.token) {
//       await saveToken(data.token);
//       if (data.user) await saveUser(data.user);

//       // ✅ KYC CHECK
//       if (data.user.kycStatus !== "approved") {
//         navigation.replace("KYCPending");
//         return;
//       }

//       // ✅ HOME NAVIGATION
//       navigation.replace('Home');

//     } else {
//       Alert.alert('Login Failed', data.message || 'Invalid credentials');
//     }

//   } catch (error) {
//     Alert.alert('Error', handleError(error, "Login failed"));
//   } finally {
//     setLoading(false);
//   }
// };

const handleLogin = async () => {
  if (!validate()) return;

  setLoading(true);

  try {
    const res = await loginUser(mobile, password);

    console.log("LOGIN RESPONSE:", res);

    // 🔥 CORRECT STRUCTURE
    if (res.success && res.data?.token) {
      const token = res.data.token;
      const user = res.data.user;

      await saveToken(token);
      if (user) await saveUser(user);

      // ✅ KYC CHECK
      if (user?.kycStatus !== "approved") {
        navigation.replace("KYCPending");
        return;
      }

      Alert.alert("Success", "Login successful!");

      navigation.replace("Home");

    } else {
      Alert.alert("Login Failed", res.message || "Invalid credentials");
    }

  } catch (error) {
    Alert.alert("Error", handleError(error, "Login failed"));
  } finally {
    setLoading(false);
  }
};


const handleMobile = (v) => {
  setMobile(v);
};

const handlePassword = (v) => {
  setPassword(v);
};
  return (
    
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >
     
      <ScrollView
         style={styles.container}
  contentContainerStyle={styles.content}
  keyboardShouldPersistTaps="handled"
  keyboardDismissMode="on-drag"
  showsVerticalScrollIndicator={false}
        

      > 
   
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={['#5A20C0', '#6C2BD9']}
            style={styles.logoCircle}
          >
            <Text style={styles.logoLetter}>S</Text>
          </LinearGradient>
          <Text style={styles.welcome}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Login to continue</Text>
        </View>

        {/* Form */}
        <View style={styles.form} >
          {/* <Input
            label="Mobile Number"
            value={mobile}
            onChangeText={(v) => {
              setMobile(v);
              if (errors.mobile) setErrors({ ...errors, mobile: null });
            }}
            placeholder="Enter mobile number"
            keyboardType="phone-pad"
            maxLength={10}
            error={errors.mobile}
          /> */}
          <Input
  label="Mobile Number"
  value={mobile}
  onChangeText={handleMobile}
  placeholder="Enter mobile number"
  keyboardType="phone-pad"
  maxLength={10}
  error={errors.mobile}
/>

<Input
  label="Password"
  value={password}
  onChangeText={handlePassword}
  placeholder="Enter password"
  secureTextEntry
  error={errors.password}
/>

          {/* <Input
            label="Password"
            value={password}
            onChangeText={(v) => {
              setPassword(v);
              if (errors.password) setErrors({ ...errors, password: null });
            }}
            placeholder="Enter password"
            secureTextEntry
            error={errors.password}
          /> */}

          <TouchableOpacity style={styles.forgotRow}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button
            title="Login"
            onPress={handleLogin}
            loading={loading}
            size="lg"
            style={styles.loginBtn}
          />

          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.registerRow}>
            <Text style={styles.noAccountText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Secure badge */}
        <View style={styles.secureBadge}>
          <View style={styles.shieldIcon}>
            <Text style={{ fontSize: 16 }}>🛡️</Text>
          </View>
          <Text style={styles.secureText}>Secure • Fast • Reliable</Text>
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
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  logoLetter: {
    fontSize: 40,
    fontWeight: FONTS.extraBold,
    color: COLORS.white,
  },
  welcome: {
    fontSize: SIZES.xxl,
    fontWeight: FONTS.bold,
    color: COLORS.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: SIZES.base,
    color: COLORS.textLight,
    fontWeight: FONTS.regular,
  },
  form: {
    flex: 1,
  },
  forgotRow: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: -8,
  },
  forgotText: {
    fontSize: SIZES.sm,
    color: COLORS.primary,
    fontWeight: FONTS.medium,
  },
  loginBtn: {
    marginBottom: 24,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  orText: {
    marginHorizontal: 12,
    color: COLORS.textLight,
    fontSize: SIZES.sm,
    fontWeight: FONTS.medium,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAccountText: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
  },
  registerLink: {
    fontSize: SIZES.sm,
    color: COLORS.primary,
    fontWeight: FONTS.bold,
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
  },
  shieldIcon: {
    marginRight: 8,
  },
  secureText: {
    fontSize: SIZES.sm,
    color: COLORS.primary,
    fontWeight: FONTS.medium,
    letterSpacing: 0.5,
  },
});

export default Login;
