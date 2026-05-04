// // utils/qrHandler.js
// import { Linking } from 'react-native';

// export const QR_TYPES = {
//   UPI: 'upi',
//   INTERNAL_URL: 'internal_url',
//   MRC: 'mrc',
//   INVALID: 'invalid',
// };

// export const parseQRData = (data) => {
//   if (!data) return { type: QR_TYPES.INVALID };

//   // UPI QR
//   if (data.startsWith('upi://')) {
//     return { type: QR_TYPES.UPI, data };
//   }

//   // Internal URL QR (mhsteppays.in/pay)
//   if (data.includes('mhsteppays.in/pay')) {
//     const urlParts = data.split('/');
//     const merchantId = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
//     return { type: QR_TYPES.INTERNAL_URL, merchantId };
//   }

//   // MRC QR code
//   if (data.startsWith('MRC')) {
//     const merchantId = data.trim();
//     return { type: QR_TYPES.MRC, merchantId };
//   }

//   return { type: QR_TYPES.INVALID };
// };

// export const handleQRNavigation = async (data, navigation) => {
//   const parsed = parseQRData(data);

//   switch (parsed.type) {
//     case QR_TYPES.UPI:
//       try {
//         const supported = await Linking.canOpenURL(parsed.data);
//         if (supported) {
//           await Linking.openURL(parsed.data);
//         } else {
//           return { error: 'No UPI app found on this device.' };
//         }
//       } catch (e) {
//         return { error: 'Failed to open UPI app.' };
//       }
//       break;

//     case QR_TYPES.INTERNAL_URL:
//     case QR_TYPES.MRC:
//       navigation.navigate('Payment', { merchantId: parsed.merchantId });
//       break;

//     case QR_TYPES.INVALID:
//     default:
//       return { error: 'Invalid QR Code. Please scan a valid StepPays or UPI QR.' };
//   }

//   return { error: null };
// };







// import { Linking } from 'react-native';

// export const QR_TYPES = {
//   UPI: 'upi',
//   INTERNAL_URL: 'internal_url',
//   MRC: 'mrc',
//   INVALID: 'invalid',
// };

// export const parseQRData = (data) => {
//   if (!data) return { type: QR_TYPES.INVALID, data };

//   // ✅ UPI QR (GPay / PhonePe / Paytm)
//   if (data.startsWith('upi://')) {
//     return { type: QR_TYPES.UPI, data };
//   }

//   // ✅ StepPays internal QR
//   if (data.includes('mhsteppays.in/pay')) {
//     const urlParts = data.split('/');
//     const merchantId =
//       urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
//     return { type: QR_TYPES.INTERNAL_URL, merchantId };
//   }

//   // ✅ MRC QR
//   if (data.startsWith('MRC')) {
//     return { type: QR_TYPES.MRC, merchantId: data.trim() };
//   }

//   // ✅ ANY OTHER QR (IMPORTANT 🔥)
//   return { type: QR_TYPES.INVALID, data };
// };

// export const handleQRNavigation = async (data, navigation) => {
//   const parsed = parseQRData(data);

//   switch (parsed.type) {
//     // 🔵 UPI QR → open GPay / PhonePe
//     case QR_TYPES.UPI:
//       try {
//         const supported = await Linking.canOpenURL(parsed.data);
//         if (supported) {
//           await Linking.openURL(parsed.data);
//         } else {
//           return { error: 'No UPI app found on this device.' };
//         }
//       } catch (e) {
//         return { error: 'Failed to open UPI app.' };
//       }
//       break;

//     // 🟢 StepPays QR → Payment screen
//     case QR_TYPES.INTERNAL_URL:
//     case QR_TYPES.MRC:
//       navigation.navigate('Payment', {
//         type: 'internal',
//         merchantId: parsed.merchantId,
//       });
//       break;

//     // 🟡 ANY OTHER QR → still accept (IMPORTANT 🔥)
//     case QR_TYPES.INVALID:
//     default:
//       navigation.navigate('Payment', {
//         type: 'raw',
//         qrData: parsed.data,
//       });
//       break;
//   }

//   return { error: null };
// };























import { Linking } from 'react-native';

export const QR_TYPES = {
  UPI: 'upi',
  INTERNAL_URL: 'internal_url',
  MRC: 'mrc',
  INVALID: 'invalid',
};

export const parseQRData = (data) => {
  if (!data) return { type: QR_TYPES.INVALID, data };

  // 🔵 UPI QR (GPay / PhonePe / Paytm)
  if (data.startsWith('upi://')) {
    return { type: QR_TYPES.UPI, data };
  }

  // 🟢 StepPays QR (FIXED merchantId extraction)
  if (data.includes('apisteppays.in/pay')) {
    const parts = data.split('/').filter(Boolean); // remove empty values
    const merchantId = parts[parts.length - 1]; // correct last value
    return { type: QR_TYPES.INTERNAL_URL, merchantId };
  }

  // 🟣 MRC QR
  if (data.startsWith('MRC')) {
    return { type: QR_TYPES.MRC, merchantId: data.trim() };
  }

  // 🟡 ANY OTHER QR
  return { type: QR_TYPES.INVALID, data };
};

export const handleQRNavigation = async (data, navigation) => {
  const parsed = parseQRData(data);

  switch (parsed.type) {
    // 🔵 UPI QR → open GPay / PhonePe
    // case QR_TYPES.UPI:
    //   try {
    //     const supported = await Linking.canOpenURL(parsed.data);
    //     if (supported) {
    //       await Linking.openURL(parsed.data);
    //     } else {
    //       return { error: 'No UPI app found on this device.' };
    //     }
    //   } catch (e) {
    //     return { error: 'Failed to open UPI app.' };
    //   }
    //   break;
    case QR_TYPES.UPI:
  navigation.navigate('Payment', {
    type: 'upi',
    qrData: parsed.data,
  });
  break;

    // 🟢 StepPays QR → Payment screen
    case QR_TYPES.INTERNAL_URL:
    case QR_TYPES.MRC:
      navigation.navigate('Payment', {
        type: 'internal',
        merchantId: parsed.merchantId,
      });
      break;

    // 🟡 ANY OTHER QR → still accept
    case QR_TYPES.INVALID:
    default:
      navigation.navigate('Payment', {
        type: 'raw',
        qrData: parsed.data,
      });
      break;
  }

  return { error: null };
};