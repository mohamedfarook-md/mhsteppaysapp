import React from 'react';
import { WebView } from 'react-native-webview';
import { Linking } from 'react-native';

const PayUWebView = ({ route, navigation }) => {
  const { paymentData } = route.params;
  const data = paymentData.data;

  const formHtml = `
    <html>
      <body onload="document.forms[0].submit()">
        <form action="${data.payuUrl}" method="post">
          <input type="hidden" name="key" value="${data.key}" />
          <input type="hidden" name="txnid" value="${data.txnid}" />
          <input type="hidden" name="amount" value="${data.amount}" />
          <input type="hidden" name="productinfo" value="${data.productinfo}" />
          <input type="hidden" name="firstname" value="${data.firstname}" />
          <input type="hidden" name="email" value="${data.email}" />
          <input type="hidden" name="phone" value="${data.phone}" />
          <input type="hidden" name="surl" value="${data.surl}" />
          <input type="hidden" name="furl" value="${data.furl}" />
          <input type="hidden" name="hash" value="${data.hash}" />
        </form>
      </body>
    </html>
  `;

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html: formHtml }}

      // 🔥 UPI handler (GPay / PhonePe open)
      onShouldStartLoadWithRequest={(request) => {
        if (
          request.url.startsWith('upi://') ||
          request.url.startsWith('intent://')
        ) {
          Linking.openURL(request.url);
          return false;
        }
        return true;
      }}

      // 🔥 SUCCESS / FAILURE DETECTION
      onNavigationStateChange={(navState) => {
        const url = navState.url;

        console.log("WEBVIEW URL:", url);

        if (url.includes('/api/payment/success')) {
          console.log("✅ Payment Success → Backend hit");

          // 🔥 small delay (backend update complete aaganum)
          setTimeout(() => {
            navigation.replace("Home");
          }, 1500);
        }

        if (url.includes('/api/payment/failure')) {
          console.log("❌ Payment Failed");

          setTimeout(() => {
            navigation.replace("Home");
          }, 1500);
        }
      }}
    />
  );
};

export default PayUWebView;