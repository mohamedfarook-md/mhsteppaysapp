// // screens/KYC.js
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   Alert,
// } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { LinearGradient } from 'expo-linear-gradient';
// import { COLORS, SIZES, FONTS } from '../constants/config';
// import Button from '../components/Button';
// import { uploadKYC } from '../services/auth';
// import { handleError } from '../utils/errorHandler';

// const KYC = ({ navigation }) => {
//   const [aadhaarUri, setAadhaarUri] = useState(null);
//   const [panUri, setPanUri] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [submitted, setSubmitted] = useState(false);

//   const pickImage = async (type) => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission needed', 'Please allow photo library access in settings.');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 0.8,
//     });

//     if (!result.canceled && result.assets?.[0]) {
//       if (type === 'aadhaar') setAadhaarUri(result.assets[0].uri);
//       else setPanUri(result.assets[0].uri);
//     }
//   };

//   const takePhoto = async (type) => {
//     const { status } = await ImagePicker.requestCameraPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission needed', 'Please allow camera access in settings.');
//       return;
//     }

//     const result = await ImagePicker.launchCameraAsync({
//       allowsEditing: true,
//       quality: 0.8,
//     });

//     if (!result.canceled && result.assets?.[0]) {
//       if (type === 'aadhaar') setAadhaarUri(result.assets[0].uri);
//       else setPanUri(result.assets[0].uri);
//     }
//   };

//   const showPickOptions = (type) => {
//     Alert.alert('Upload Document', 'Choose an option', [
//       { text: 'Camera', onPress: () => takePhoto(type) },
//       { text: 'Gallery', onPress: () => pickImage(type) },
//       { text: 'Cancel', style: 'cancel' },
//     ]);
//   };

//   const handleSubmit = async () => {
//     if (!aadhaarUri || !panUri) {
//       Alert.alert('Missing Documents', 'Please upload both Aadhaar and PAN images.');
//       return;
//     }
//     setLoading(true);
//     try {
//       await uploadKYC(aadhaarUri, panUri);
//       setSubmitted(true);
//     } catch (error) {
//       Alert.alert('Upload Failed', error.response?.data?.message || 'Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (submitted) {
//     return (
//       <View style={styles.reviewContainer}>
//         <LinearGradient
//           colors={['#F5F0FF', '#EDE7FF']}
//           style={styles.reviewGradient}
//         >
//           <View style={styles.reviewIconWrap}>
//             <Text style={{ fontSize: 64 }}>⏳</Text>
//           </View>
//           <Text style={styles.reviewTitle}>KYC Under Review</Text>
//           <Text style={styles.reviewSubtitle}>
//             Your documents have been submitted successfully. Our team will verify
//             your KYC within 24-48 hours. You'll be notified once approved.
//           </Text>
//           <View style={styles.reviewBadge}>
//             <View style={styles.reviewDot} />
//             <Text style={styles.reviewBadgeText}>Pending Verification</Text>
//           </View>
//           <Button
//             title="Back to Login"
//             onPress={() => navigation.replace('Login')}
//             style={{ marginTop: 32, width: '100%' }}
//           />
//         </LinearGradient>
//       </View>
//     );
//   }

//   return (
//     <ScrollView
//       style={styles.container}
//       contentContainerStyle={styles.content}
//       showsVerticalScrollIndicator={false}
//     >
//       {/* Progress */}
//       <View style={styles.progressBar}>
//         <View style={[styles.progressStep, styles.progressDone]}>
//           <Text style={styles.progressStepText}>✓</Text>
//         </View>
//         <View style={[styles.progressLine, styles.progressLineDone]} />
//         <View style={[styles.progressStep, styles.progressActive]}>
//           <Text style={styles.progressStepText}>2</Text>
//         </View>
//         <View style={styles.progressLine} />
//         <View style={styles.progressStep}>
//           <Text style={[styles.progressStepText, { color: COLORS.gray400 }]}>3</Text>
//         </View>
//       </View>
//       <Text style={styles.progressLabel}>KYC Verification</Text>

//       <Text style={styles.title}>Complete Your KYC</Text>
//       <Text style={styles.subtitle}>
//         Upload your identity documents to verify your account.
//       </Text>

//       {/* Aadhaar Upload */}
//       <View style={styles.uploadSection}>
//         <Text style={styles.uploadLabel}>Aadhaar Card</Text>
//         <TouchableOpacity
//           style={[styles.uploadBox, aadhaarUri && styles.uploadBoxFilled]}
//           onPress={() => showPickOptions('aadhaar')}
//           activeOpacity={0.8}
//         >
//           {aadhaarUri ? (
//             <>
//               <Image source={{ uri: aadhaarUri }} style={styles.uploadPreview} />
//               <View style={styles.uploadOverlay}>
//                 <Text style={styles.changeText}>Tap to change</Text>
//               </View>
//             </>
//           ) : (
//             <>
//               <View style={styles.uploadIconBg}>
//                 <Text style={{ fontSize: 28 }}>🪪</Text>
//               </View>
//               <Text style={styles.uploadBoxText}>Upload Aadhaar Card</Text>
//               <Text style={styles.uploadBoxHint}>Tap to upload front & back</Text>
//             </>
//           )}
//         </TouchableOpacity>
//         {aadhaarUri && (
//           <View style={styles.uploadedBadge}>
//             <Text style={styles.uploadedBadgeText}>✓ Aadhaar uploaded</Text>
//           </View>
//         )}
//       </View>

//       {/* PAN Upload */}
//       <View style={styles.uploadSection}>
//         <Text style={styles.uploadLabel}>PAN Card</Text>
//         <TouchableOpacity
//           style={[styles.uploadBox, panUri && styles.uploadBoxFilled]}
//           onPress={() => showPickOptions('pan')}
//           activeOpacity={0.8}
//         >
//           {panUri ? (
//             <>
//               <Image source={{ uri: panUri }} style={styles.uploadPreview} />
//               <View style={styles.uploadOverlay}>
//                 <Text style={styles.changeText}>Tap to change</Text>
//               </View>
//             </>
//           ) : (
//             <>
//               <View style={styles.uploadIconBg}>
//                 <Text style={{ fontSize: 28 }}>💳</Text>
//               </View>
//               <Text style={styles.uploadBoxText}>Upload PAN Card</Text>
//               <Text style={styles.uploadBoxHint}>Tap to upload</Text>
//             </>
//           )}
//         </TouchableOpacity>
//         {panUri && (
//           <View style={styles.uploadedBadge}>
//             <Text style={styles.uploadedBadgeText}>✓ PAN uploaded</Text>
//           </View>
//         )}
//       </View>

//       <View style={styles.infoBox}>
//         <Text style={{ fontSize: 16, marginRight: 8 }}>🔒</Text>
//         <Text style={styles.infoText}>
//           Your documents are encrypted and securely stored. We never share your data.
//         </Text>
//       </View>

//       <Button
//         title="Submit for Verification"
//         onPress={handleSubmit}
//         loading={loading}
//         disabled={!aadhaarUri || !panUri}
//         size="lg"
//         style={styles.submitBtn}
//       />
//     </ScrollView>
//   );
// };


// screens/KYC.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, FONTS } from '../constants/config';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { uploadKYC } from '../services/auth';
import { handleError } from '../utils/errorHandler';

const KYC = ({ navigation }) => {
  const [aadhaarUri, setAadhaarUri] = useState(null);
  const [panUri, setPanUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // 📸 Pick from gallery
  const pickImage = async (type) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow gallery access.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];

      // ✅ FILE SIZE CHECK
      if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
        Alert.alert("Error", "Image must be less than 5MB");
        return;
      }

      if (type === 'aadhaar') setAadhaarUri(asset.uri);
      else setPanUri(asset.uri);
    }
  };

  // 📷 Take photo
  const takePhoto = async (type) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow camera access.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];

      // ✅ FILE SIZE CHECK
      if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
        Alert.alert("Error", "Image must be less than 5MB");
        return;
      }

      if (type === 'aadhaar') setAadhaarUri(asset.uri);
      else setPanUri(asset.uri);
    }
  };

  const showPickOptions = (type) => {
    Alert.alert('Upload Document', 'Choose option', [
      { text: 'Camera', onPress: () => takePhoto(type) },
      { text: 'Gallery', onPress: () => pickImage(type) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  // 🚀 SUBMIT
  const handleSubmit = async () => {
    if (!aadhaarUri || !panUri) {
      Alert.alert('Missing Documents', 'Upload both Aadhaar & PAN.');
      return;
    }

    setLoading(true);

    try {
      await uploadKYC(aadhaarUri, panUri);

      setSubmitted(true);

      Alert.alert(
        "KYC Submitted",
        "Your documents are under review",
        [
          {
            text: "OK",
            onPress: () => navigation.replace("KYCPending")
          }
        ]
      );

    } catch (error) {
      Alert.alert('Upload Failed', handleError(error, "KYC upload failed"));
    } finally {
      setLoading(false);
    }
  };

  // 🔄 LOADER OVERLAY
  if (loading) {
    return <Loader overlay message="Uploading KYC..." />;
  }

  // ⏳ REVIEW SCREEN
  if (submitted) {
    return (
      <View style={styles.reviewContainer}>
        <LinearGradient
          colors={['#F5F0FF', '#EDE7FF']}
          style={styles.reviewGradient}
        >
          <Text style={{ fontSize: 64 }}>⏳</Text>
          <Text style={styles.reviewTitle}>KYC Under Review</Text>
          <Text style={styles.reviewSubtitle}>
            We will verify your documents within 24–48 hours.
          </Text>

          <Button
            title="Back to Login"
            onPress={() => navigation.replace('Login')}
            style={{ marginTop: 30 }}
          />
        </LinearGradient>
      </View>
    );
  }

  // 🧾 MAIN UI
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      <Text style={styles.title}>Complete Your KYC</Text>

      {/* Aadhaar */}
      <TouchableOpacity
        style={styles.uploadBox}
        onPress={() => showPickOptions('aadhaar')}
      >
        {aadhaarUri ? (
          <Image source={{ uri: aadhaarUri }} style={styles.preview} />
        ) : (
          <Text>Upload Aadhaar</Text>
        )}
      </TouchableOpacity>

      {/* PAN */}
      <TouchableOpacity
        style={styles.uploadBox}
        onPress={() => showPickOptions('pan')}
      >
        {panUri ? (
          <Image source={{ uri: panUri }} style={styles.preview} />
        ) : (
          <Text>Upload PAN</Text>
        )}
      </TouchableOpacity>

      <Button
        title="Submit KYC"
        onPress={handleSubmit}
        loading={loading}
        disabled={!aadhaarUri || !panUri}
      />

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 40,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.gray200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDone: {
    backgroundColor: COLORS.success,
  },
  progressActive: {
    backgroundColor: COLORS.primary,
  },
  progressStepText: {
    color: COLORS.white,
    fontWeight: FONTS.bold,
    fontSize: SIZES.sm,
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.border,
  },
  progressLineDone: {
    backgroundColor: COLORS.success,
  },
  progressLabel: {
    fontSize: SIZES.xs,
    color: COLORS.textLight,
    marginBottom: 24,
    marginTop: 4,
  },
  title: {
    fontSize: SIZES.xxl,
    fontWeight: FONTS.bold,
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: SIZES.base,
    color: COLORS.textLight,
    marginBottom: 32,
    lineHeight: 22,
  },
  uploadSection: {
    marginBottom: 24,
  },
  uploadLabel: {
    fontSize: SIZES.base,
    fontWeight: FONTS.semiBold,
    color: COLORS.text,
    marginBottom: 10,
  },
  uploadBox: {
    height: 140,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gray100,
    overflow: 'hidden',
  },
  uploadBoxFilled: {
    borderStyle: 'solid',
    borderColor: COLORS.primary,
  },
  uploadPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(108,43,217,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeText: {
    color: COLORS.white,
    fontWeight: FONTS.semiBold,
    fontSize: SIZES.base,
  },
  uploadIconBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  uploadBoxText: {
    fontSize: SIZES.base,
    fontWeight: FONTS.semiBold,
    color: COLORS.text,
    marginBottom: 4,
  },
  uploadBoxHint: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
  },
  uploadedBadge: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadedBadgeText: {
    fontSize: SIZES.sm,
    color: COLORS.success,
    fontWeight: FONTS.medium,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: SIZES.sm,
    color: '#4338CA',
    lineHeight: 20,
  },
  submitBtn: {
    marginBottom: 16,
  },
  reviewContainer: {
    flex: 1,
  },
  reviewGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  reviewIconWrap: {
    marginBottom: 24,
  },
  reviewTitle: {
    fontSize: SIZES.xxl,
    fontWeight: FONTS.bold,
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  reviewSubtitle: {
    fontSize: SIZES.base,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  reviewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  reviewDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.warning,
    marginRight: 8,
  },
  reviewBadgeText: {
    fontSize: SIZES.sm,
    color: '#856404',
    fontWeight: FONTS.semiBold,
  },
});

export default KYC;
