// // App.js
// import React, { useEffect, useState } from 'react';
// import { StatusBar } from 'expo-status-bar';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import * as SplashScreen from 'expo-splash-screen';
// import AppNavigator from './navigation/AppNavigator';

// // prevent auto hide
// SplashScreen.preventAutoHideAsync();

// export default function App() {
//   const [appReady, setAppReady] = useState(false);

//   useEffect(() => {
//     const prepare = async () => {
//       try {
//         // 🔥 here you can load fonts / API / auth check later
//       } catch (e) {
//         console.log(e);
//       } finally {
//         setAppReady(true);
//         await SplashScreen.hideAsync(); // hide only after ready
//       }
//     };

//     prepare();
//   }, []);

//   // ❗ important
//   if (!appReady) return null;

//   return (
//     <SafeAreaProvider>
//       <StatusBar style="auto" />
//       <AppNavigator />
//     </SafeAreaProvider>
//   );
// }









// // App.js
// import React, { useEffect, useState } from 'react';
// import { StatusBar } from 'expo-status-bar';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { KeyboardAvoidingView, Platform } from 'react-native';
// import * as SplashScreen from 'expo-splash-screen';
// import AppNavigator from './navigation/AppNavigator';
// import { enableScreens } from 'react-native-screens';


// enableScreens(false);
// // prevent auto hide
// SplashScreen.preventAutoHideAsync();

// export default function App() {
//   const [appReady, setAppReady] = useState(false);

//   useEffect(() => {
//     const prepare = async () => {
//       try {
//         // future: fonts / auth check
//       } catch (e) {
//         console.log(e);
//       } finally {
//         setAppReady(true);
//         await SplashScreen.hideAsync();
//       }
//     };

//     prepare();
//   }, []);

//   if (!appReady) return null;

//   return (
//     <SafeAreaProvider>
      
//       {/* 🔥 IMPORTANT FIX */}
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       >
//         <StatusBar style="auto" />
//         <AppNavigator />
//       </KeyboardAvoidingView>

//     </SafeAreaProvider>
//   );
// }





// import { View, TextInput } from 'react-native';

// export default function App() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center' }}>
//       <TextInput
//         placeholder="Test typing"
//         style={{ borderWidth: 1, margin: 20, padding: 10 }}
//       />
//     </View>
//   );
// }






















// App.js
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}