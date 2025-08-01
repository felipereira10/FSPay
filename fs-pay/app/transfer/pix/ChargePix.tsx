import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { api } from '../../../services/api'; // garante que api está exportado corretamente

export default function ChargePix() {
  const [valor, setValor] = useState('');

  const handleCharge = async () => {
    try {
      const response = await api.post('/pix/charge', { valor });
      Alert.alert('Cobrança criada', response.data.msg || 'Sucesso!');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as any;
        console.error('Erro:', error.response?.data || error.message);
        Alert.alert('Erro', error.response?.data?.msg || 'Erro ao cobrar');
      } else {
        console.error('Erro desconhecido:', err);
        Alert.alert('Erro', 'Erro desconhecido');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Valor para cobrar:</Text>
      <TextInput
        style={styles.input}
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
        placeholder="R$ 0,00"
        placeholderTextColor="#ccc"
      />
      <TouchableOpacity style={styles.button} onPress={handleCharge}>
        <Text style={styles.buttonText}>Cobrar Pix</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#118096',
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#118096',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
