// app/transfer/pix/PixCopyPaste.tsx
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';

export default function PixCopyPaste() {
  const [pixCode, setPixCode] = useState('');
  const router = useRouter();

  const handleSendPix = async () => {
    if (!pixCode) {
      Alert.alert('Erro', 'Cole o código Pix para continuar.');
      return;
    }

    try {
      const res = await fetch('http://SEU_BACKEND/pix/send-copypaste', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pixCode })
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Sucesso', 'Pix enviado com sucesso!');
        router.back(); // ou router.push para outra tela de sucesso
      } else {
        Alert.alert('Erro', data?.message || 'Erro ao enviar Pix.');
      }
    } catch (err) {
      Alert.alert('Erro', 'Falha na conexão com o servidor.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pix Copia e Cola</Text>
      <TextInput
        style={styles.input}
        placeholder="Cole o código Pix aqui"
        value={pixCode}
        onChangeText={setPixCode}
      />
      <TouchableOpacity style={styles.button} onPress={handleSendPix}>
        <Text style={styles.buttonText}>Enviar Pix</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    justifyContent: 'center', 
    backgroundColor: '#118096' 
    },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 22, 
    color: '#fff' 
  },
  input: 
  { borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 20, 
    backgroundColor: '#f0f0f0', 
    fontSize: 16 
  },
  button: 
  { backgroundColor: '#00ced1', 
    padding: 14, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#000' 
  },
  buttonText: { 
    color: '#000', 
    fontWeight: 'bold', 
    textAlign: 'center' 
  },
});
