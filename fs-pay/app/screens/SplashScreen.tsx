import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/FSPay.jpg')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.slogan}>Tecnologia com assinatura própria.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001f2f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 220,
    height: 220,
    marginBottom: 20,
  },
  slogan: {
    color: '#ffffff',
    fontSize: 16,
    fontStyle: 'italic',
  },
});
