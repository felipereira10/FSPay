import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // pega o user/token

export default function AccountInfo() {
  const { authData } = useAuth();
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    cpf: '',
    phone: '',
    birthdate: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authData?.user) {
      const { fullName, cpf, phone, birthdate } = authData.user;
      setUserInfo({ fullName, cpf, phone, birthdate });
    }
  }, [authData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await axios.put(
        `http://SEU_BACKEND/users/${authData.user.id}`,
        userInfo,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        }
      );
      Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível atualizar os dados.');
    } finally {
      setLoading(false);
    }
  };

  const openPasswordModal = () => {
    // você pode usar um Modal ou navegar para outra tela
    Alert.alert('Redefinir Senha', 'Funcionalidade ainda não implementada.');
  };

  const openEmailModal = () => {
    // você pode usar um Modal ou navegar para outra tela
    Alert.alert('Alterar Email', 'Funcionalidade ainda não implementada.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        value={userInfo.fullName}
        onChangeText={(text) => setUserInfo({ ...userInfo, fullName: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="CPF"
        keyboardType="numeric"
        value={userInfo.cpf}
        onChangeText={(text) => setUserInfo({ ...userInfo, cpf: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Celular"
        keyboardType="phone-pad"
        value={userInfo.phone}
        onChangeText={(text) => setUserInfo({ ...userInfo, phone: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Data de nascimento (YYYY-MM-DD)"
        value={userInfo.birthdate}
        onChangeText={(text) => setUserInfo({ ...userInfo, birthdate: text })}
      />

      <Button title={loading ? 'Salvando...' : 'Salvar Alterações'} onPress={handleSave} />

      <View style={{ height: 30 }} />

      <Button title="Alterar Senha" color="#FF9800" onPress={openPasswordModal} />
      <View style={{ height: 10 }} />
      <Button title="Alterar Email" color="#2196F3" onPress={openEmailModal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
});
