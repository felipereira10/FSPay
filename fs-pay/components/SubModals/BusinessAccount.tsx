import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AccountInfo() {
  return (
    <View>
      <Text style={styles.title}>Solicitação de Conta PJ</Text>
      <Text style={styles.text}>Nome, email, CPF, data de nascimento etc...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
  },
});

