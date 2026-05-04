// // components/Input.js
// import React, { useState } from 'react';
// import {
//   View,
//   TextInput,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
// } from 'react-native';
// import { COLORS, SIZES, FONTS } from '../constants/config';

// const EyeIcon = ({ visible }) => (
//   <View style={{ width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
//     <View style={{
//       width: 16, height: 10, borderRadius: 8,
//       borderWidth: 1.5, borderColor: COLORS.gray400,
//       justifyContent: 'center', alignItems: 'center'
//     }}>
//       {visible ? (
//         <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: COLORS.gray400 }} />
//       ) : (
//         <View style={{
//           width: 18, height: 1.5, backgroundColor: COLORS.gray400,
//           position: 'absolute', transform: [{ rotate: '45deg' }]
//         }} />
//       )}
//     </View>
//   </View>
// );

// const Input = ({
//   label,
//   value,
//   onChangeText,
//   placeholder,
//   secureTextEntry = false,
//   keyboardType = 'default',
//   autoCapitalize = 'none',
//   error,
//   editable = true,
//   multiline = false,
//   numberOfLines = 1,
//   leftIcon,
//   style,
//   inputStyle,
//   maxLength,
// }) => {
//   const [focused, setFocused] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   return (
//     <View style={[styles.container, style]}>
//       {label && <Text style={styles.label}>{label}</Text>}
//       <View
//         style={[
//           styles.inputWrapper,
//           focused && styles.focused,
//           error && styles.errorBorder,
//           !editable && styles.disabled,
//           multiline && styles.multiline,
//         ]}
//       >
//         {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
//         <TextInput
//           value={value}
//           onChangeText={onChangeText}
//           placeholder={placeholder}
//           placeholderTextColor={COLORS.gray400}
//           focusable={true}
//           underlineColorAndroid="transparent"
//           blurOnSubmit={false}
//           secureTextEntry={secureTextEntry && !showPassword}
//           keyboardType={keyboardType}
//           autoCapitalize={autoCapitalize}
//           onFocus={() => setFocused(true)}
//           onBlur={() => setFocused(false)}
//           editable={editable}
//           multiline={multiline}
//           numberOfLines={numberOfLines}
//           maxLength={maxLength}
//           style={[
//             styles.input,
//             leftIcon && styles.inputWithLeftIcon,
//             multiline && styles.multilineInput,
//             inputStyle,
//           ]}
//         />
//         {secureTextEntry && (
//           <TouchableOpacity
//             onPress={() => setShowPassword(!showPassword)}
//             style={styles.eyeBtn}
//           >
//             <EyeIcon visible={showPassword} />
//           </TouchableOpacity>
//         )}
//       </View>
//       {error && <Text style={styles.errorText}>{error}</Text>}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: SIZES.sm,
//     fontWeight: FONTS.medium,
//     color: COLORS.gray700,
//     marginBottom: 8,
//     letterSpacing: 0.3,
//   },
//   inputWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1.5,
//     borderColor: COLORS.border,
//     borderRadius: 12,
//     backgroundColor: COLORS.white,
//     paddingHorizontal: 14,
//     height: 55,
//   },
//   focused: {
//     borderColor: COLORS.primary,
//     backgroundColor: '#FAFAFF',
//     shadowColor: COLORS.primary,
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 2,
//   },
//   errorBorder: {
//     borderColor: COLORS.error,
//   },
//   disabled: {
//     backgroundColor: COLORS.gray100,
//     borderColor: COLORS.gray300,
//   },
//   multiline: {
//     alignItems: 'flex-start',
//     paddingVertical: 12,
//   },
//   input: {
//     flex: 1,
//     fontSize: SIZES.base,
//     color: COLORS.text,
//     height: '100%',
//     fontWeight: FONTS.regular,
//   },
//   inputWithLeftIcon: {
//     paddingLeft: 8,
//   },
//   multilineInput: {
//     paddingTop: 0,
//     textAlignVertical: 'top',
//     minHeight: 80,
//   },
//   leftIcon: {
//     marginRight: 4,
//   },
//   eyeBtn: {
//     padding: 4,
//     marginLeft: 4,
//   },
//   errorText: {
//     fontSize: SIZES.xs,
//     color: COLORS.error,
//     marginTop: 6,
//     marginLeft: 4,
//   },
// });

// export default Input;


























// import React, { useState, memo } from 'react';
// import {
//   View,
//   TextInput,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
// } from 'react-native';
// import { COLORS, SIZES, FONTS } from '../constants/config';

// const EyeIcon = ({ visible }) => (
//   <View style={{ width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
//     <View style={{
//       width: 16, height: 10, borderRadius: 8,
//       borderWidth: 1.5, borderColor: COLORS.gray400,
//       justifyContent: 'center', alignItems: 'center'
//     }}>
//       {visible ? (
//         <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: COLORS.gray400 }} />
//       ) : (
//         <View style={{
//           width: 18, height: 1.5, backgroundColor: COLORS.gray400,
//           position: 'absolute', transform: [{ rotate: '45deg' }]
//         }} />
//       )}
//     </View>
//   </View>
// );

// const Input = ({
//   label,
//   value,
//   onChangeText,
//   placeholder,
//   secureTextEntry = false,
//   keyboardType = 'default',
//   autoCapitalize = 'none',
//   error,
//   editable = true,
//   multiline = false,
//   numberOfLines = 1,
//   leftIcon,
//   style,
//   inputStyle,
//   maxLength,
// }) => {
//   const [focused, setFocused] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   return (
//     <View style={[styles.container, style]}>
//       {label && <Text style={styles.label}>{label}</Text>}

//       <View style={[
//         styles.inputWrapper,
//         focused && styles.focused,
//         error && styles.errorBorder,
//       ]}>
//         <TextInput
//           value={value}
//           onChangeText={onChangeText}
//           placeholder={placeholder}
//           placeholderTextColor={COLORS.gray400}
//           secureTextEntry={secureTextEntry && !showPassword}
//           keyboardType={keyboardType}
//           autoCapitalize={autoCapitalize}
//           autoCorrect={false}   // 🔥 IMPORTANT
//           onFocus={() => setFocused(true)}
//           onBlur={() => setFocused(false)}
//           style={styles.input}
//         />

//         {secureTextEntry && (
//           <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//             <EyeIcon visible={showPassword} />
//           </TouchableOpacity>
//         )}
//       </View>

//       {error && <Text style={styles.errorText}>{error}</Text>}
//     </View>
//   );
// };



// import React, { useState, memo } from 'react';
// import {
//   View,
//   TextInput,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
// } from 'react-native';
// import { COLORS, SIZES, FONTS } from '../constants/config';

// const Input = ({
//   label,
//   value,
//   onChangeText,
//   placeholder,
//   secureTextEntry = false,
//   keyboardType = 'default',
//   autoCapitalize = 'none',
//   error,
// }) => {
//   const [showPassword, setShowPassword] = useState(false);

//   return (
//     <View style={styles.container}>
//       {label && <Text style={styles.label}>{label}</Text>}

//       <View style={[
//         styles.inputWrapper,
//         error && styles.errorBorder
//       ]}>
//         <TextInput
//           value={value}
//           onChangeText={onChangeText}
//           placeholder={placeholder}
//           placeholderTextColor={COLORS.gray400}
//           secureTextEntry={secureTextEntry && !showPassword}
//           keyboardType={keyboardType}
//           autoCapitalize={autoCapitalize}
//           autoCorrect={false}
//           style={styles.input}
//         />

//         {secureTextEntry && (
//           <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//             <Text>👁️</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {error && <Text style={styles.errorText}>{error}</Text>}
//     </View>
//   );
// };












import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants/config';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[
        styles.inputWrapper,
        error && styles.errorBorder
      ]}>
        <TextInput
          value={value ?? ''}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray400}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          blurOnSubmit={false}
          style={styles.input}
        />

        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text>👁️</Text>
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};




const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: SIZES.sm,
    fontWeight: FONTS.medium,
    color: COLORS.gray700,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    height: 55,
  },
  focused: {
    borderColor: COLORS.primary,
    backgroundColor: '#FAFAFF',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  errorBorder: {
    borderColor: COLORS.error,
  },
  disabled: {
    backgroundColor: COLORS.gray100,
    borderColor: COLORS.gray300,
  },
  multiline: {
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: SIZES.base,
    color: COLORS.text,
    height: '100%',
    fontWeight: FONTS.regular,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  multilineInput: {
    paddingTop: 0,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  leftIcon: {
    marginRight: 4,
  },
  eyeBtn: {
    padding: 4,
    marginLeft: 4,
  },
  errorText: {
    fontSize: SIZES.xs,
    color: COLORS.error,
    marginTop: 6,
    marginLeft: 4,
  },
});

export default Input;