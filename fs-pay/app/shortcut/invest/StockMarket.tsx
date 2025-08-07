import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FixedIncome() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bolsa de Valores</Text>
      <Text style={styles.desc}>Invista em ações e ETFs.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#014141',
  },
  desc: {
    marginTop: 10,
    fontSize: 16,
  },
});
