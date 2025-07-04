import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Loans() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela de Empréstimos</Text>
      <Text style={styles.description}>Aqui você pode solicitar empréstimos ou verificar seus empréstimos ativos.</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Solicitar Empréstimo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#014141',
  },
  description: {
    marginVertical: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
  },
  button: {
    backgroundColor: '#014141',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
