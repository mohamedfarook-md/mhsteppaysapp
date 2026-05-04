// navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Splash from '../screens/Splash';
import Login from '../screens/Login';
import Register from '../screens/Register';
import KYC from '../screens/KYC';
import Home from '../screens/Home';
import Scanner from '../screens/Scanner';
import Payment from '../screens/Payment';
import History from '../screens/History';
import Support from '../screens/Support';
import KYCPending from '../screens/KYCPending';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      {/* <Stack.Navigator
        initialRouteName="Login"
     
        screenOptions={{
          headerShown: false,
          
        }}
      > */}
      <Stack.Navigator
  initialRouteName="Home"
  screenOptions={{
    headerShown: false,
    animation: 'none',   // 🔥 IMPORTANT
  }}
>
        {/* <Stack.Screen
          name="Splash"
          component={Splash}
          options={{ animation: 'fade' }}
        /> */}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="KYCPending" component={KYCPending} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="KYC" component={KYC} />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ animation: 'fade', gestureEnabled: false }}
        />
        <Stack.Screen
          name="Scanner"
          component={Scanner}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="History" component={History} />
        <Stack.Screen name="Support" component={Support} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
