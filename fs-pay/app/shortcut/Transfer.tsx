import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { Button } from 'react-native'

export default function Transfer() {
  // Função que mostra o Toast
  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Transferência realizada!',
      text2: 'Você realizou uma transferência com sucesso 👋'
    });
  }

  return (
    <View style={styles.container}>
      {/* Botão para mostrar o Toast */}
      <Button
        title="Show Toast"
        onPress={showToast}
      />
      <Text style={styles.title}>Tela de Transferências</Text>
      <Text style={styles.description}>Aqui você pode realizar transferências para outros usuários.</Text>
      
      {/* Botão personalizado */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Transferir Agora</Text>
      </TouchableOpacity>

      {/* Coloca o Toast aqui para exibição global */}
      <Toast />
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
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});