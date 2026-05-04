import { View, Text } from 'react-native';

export default function KYCPending() {
  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <Text style={{ fontSize:18, fontWeight:'bold' }}>KYC Under Review</Text>
      <Text>Please wait for approval</Text>
    </View>
  );
}