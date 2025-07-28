import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import { getUserByIdSelf, updateUserSelf } from '../../services/api';

export default function AccountInfo() {
  const [formData, setFormData] = useState({
    fullName: '',
    cpf: '',
    phone: '',
    birthdate: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = await AsyncStorage.getItem('userToken');
        if (!authToken) return;

        setToken(authToken);
        const data = await getUserByIdSelf();

        setUserId(data.id); // salva ID pra usar no update
        setFormData({
          fullName: data.fullName,
          cpf: data.cpf,
          phone: data.phone,
          birthdate: data.birthdate?.slice(0, 10) || '',
        });
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  console.log('[AccountInfo] Token:', token);

  const handleSave = async () => {
    if (!userId || !token) return;
    setSaving(true);
    try {
      await updateUserSelf(userId, formData);
      Alert.alert('Sucesso', 'Informações atualizadas com sucesso!');
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Algo deu errado na requisição.');
    } finally {
      setSaving(false);
    }
  };


  const goToChangePassword = () => {
    // TODO: implementar navegação para modal de senha
  };

  const goToChangeEmail = () => {
    // TODO: implementar navegação para modal de email
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          source={require('../../assets/loading-fingers.json')}
          autoPlay
          loop
          style={{ width: 150, height: 150 }}
        />
      </View>
    );
  }

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

      <TouchableOpacity
        style={[styles.buttonSave, saving && styles.disabledButton]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.buttonSaveText}>
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </Text>
      </TouchableOpacity>

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={goToChangePassword} style={styles.buttonSecondary}>
          <Text style={styles.secondaryText}>Redefinir Senha</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToChangeEmail} style={styles.buttonSecondary}>
          <Text style={styles.secondaryText}>Alterar Email</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#00ced1',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f1f1f1',
    marginBottom: 12,
    padding: 10,
    borderRadius: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  buttonSave: {
    backgroundColor: '#008606',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#adb5bd',
  },
  buttonSaveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
  buttonSecondary: {
    backgroundColor: '#6c2194',
    padding: 10,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  secondaryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});