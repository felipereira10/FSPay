import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, ScrollView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const isExpoGo = Constants.appOwnership === 'expo';

let API_BASE_URL = '';

if (isExpoGo) {
  // ⚠️ Coloque aqui o IP local do seu computador (quando usar Expo Go)
  // IP da rede do trampo
  API_BASE_URL = 'http://192.168.0.177:8000';
  // IP da rede de casa
  // API_BASE_URL = 'http://192.168.1.70:8000';
} else if (Platform.OS === 'android') {
  // Android Studio emulador
  API_BASE_URL = 'http://10.0.2.2:8000';
} else {
  // iOS emulador ou build física
  API_BASE_URL = 'http://localhost:8000';
}

export default function AccountInfo() {
  const [formData, setFormData] = useState({
    fullName: '',
    cpf: '',
    phone: '',
    birthdate: '',
  });

  const [userId, setUserId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await AsyncStorage.getItem('userData');
      const authToken = await AsyncStorage.getItem('userToken');
      if (userData && authToken) {
        const parsed = JSON.parse(userData);
        setUserId(parsed.id);
        setToken(authToken);
        setFormData({
          fullName: parsed.fullName,
          cpf: parsed.cpf,
          phone: parsed.phone,
          birthdate: parsed.birthdate?.slice(0, 10) || '',
        });
      }
    };
    loadUserData();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!userId || !token) return;

    if (!formData.fullName || !formData.cpf || !formData.phone || !formData.birthdate) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // Atualiza localmente
        await AsyncStorage.setItem('userData', JSON.stringify({ ...formData, id: userId }));
        Alert.alert('Sucesso', 'Dados atualizados com sucesso');
      } else {
        console.log(result);
        Alert.alert('Erro', result?.detail || 'Falha ao atualizar os dados');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro de conexão');
    }
  };

  const goToChangePassword = () => {
    // Navegar para modal de alteração de senha
  };

  const goToChangeEmail = () => {
    // Navegar para modal de alteração de e-mail
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Editar Informações da Conta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        value={formData.fullName}
        onChangeText={(text) => handleChange('fullName', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="CPF"
        value={formData.cpf}
        onChangeText={(text) => handleChange('cpf', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Celular"
        value={formData.phone}
        onChangeText={(text) => handleChange('phone', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Data de nascimento"
        value={formData.birthdate}
        onChangeText={(text) => handleChange('birthdate', text)}
      />

      <Button title="Salvar Alterações" onPress={handleSave} />

      <View style={{ marginVertical: 20 }}>
        <Button title="Redefinir Senha" onPress={goToChangePassword} />
        <Button title="Alterar Email" onPress={goToChangeEmail} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFF',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f1f1f1',
    marginBottom: 12,
    padding: 10,
    borderRadius: 6,
  },
});
