import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { api } from '../../../services/api';

const SendPix = () => {
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');

  const handleSend = async () => {
    try {
      const response = await api.post('/pix/pix-key', { receiver, amount });
      Alert.alert('Pix enviado com sucesso!', response.data.message);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as any;
        Alert.alert('Erro ao enviar Pix', error.response?.data?.detail || 'Erro desconhecido');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Chave Pix do destinatário:</Text>
      <TextInput style={styles.input} value={receiver} onChangeText={setReceiver} />
      <Text style={styles.label}>Valor:</Text>
      <TextInput style={styles.input} value={amount} onChangeText={setAmount} keyboardType="numeric" />
      <TouchableOpacity style={styles.button} onPress={handleSend}>
        <Text style={styles.buttonText}>Enviar Pix</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SendPix;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
    backgroundColor: '#118096',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#00ced1',
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
