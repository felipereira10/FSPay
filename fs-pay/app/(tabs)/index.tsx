import { StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import React from 'react';
import Toast from 'react-native-toast-message';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';


// export default function TabOneScreen() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Tab One</Text>
//       <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
//       <EditScreenInfo path="app/(tabs)/index.tsx" />
//     </View>
//   );
// }
export default function Index() {
  return(
    <>    
    <Redirect href="/screens/Login" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
