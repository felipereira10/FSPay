import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { api } from '../../../services/api';

const DepositPix = () => {
  const [amount, setAmount] = useState('');

  const handleDeposit = async () => {
    try {
      const response = await api.post('/pix/deposit', { amount });
      Alert.alert('Depósito realizado!', response.data.message);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as any;
        Alert.alert('Erro ao depositar', error.response?.data?.detail || 'Erro desconhecido');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Valor do Depósito:</Text>
      <TextInput
        placeholder="R$ 0,00"
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TouchableOpacity style={styles.button} onPress={handleDeposit}>
        <Text style={styles.buttonText}>Depositar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DepositPix;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#118096',
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    color: 'white',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});