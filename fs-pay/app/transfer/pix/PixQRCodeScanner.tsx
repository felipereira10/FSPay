// PixQRCodeScanner.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { api } from '../../../services/api';

const PixQRCodeScanner = () => {
  const [code, setCode] = useState('');

  const handleScan = async () => {
    try {
      const response = await api.post('/pix/read-qrcode', { code });
      Alert.alert('QR Code lido com sucesso!', response.data.message);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as any;
        Alert.alert('Erro ao ler QR Code', error.response?.data?.detail || 'Erro desconhecido');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Código do QR Code:</Text>
      <TextInput
        placeholder="Cole o código aqui"
        style={styles.input}
        value={code}
        onChangeText={setCode}
      />
      <TouchableOpacity style={styles.button} onPress={handleScan}>
        <Text style={styles.buttonText}>Ler QR Code</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PixQRCodeScanner;

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
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#00ced1',
    padding: 14,
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