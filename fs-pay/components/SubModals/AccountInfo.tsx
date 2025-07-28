import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import LottieView from 'lottie-react-native';

const isExpoGo = Constants.appOwnership === 'expo';

let API_BASE_URL = '';

if (isExpoGo) {
  // ⚠️ Coloque aqui o IP local do seu computador (quando usar Expo Go)
  // IP da rede do trampo
  API_BASE_URL = 'http://192.168.0.177:8000';
  // IP da rede de casa
  // API_BASE_URL = 'http://192.168.1.70:8000';
} else if (Platform.OS === 'android') {
  API_BASE_URL = 'http://10.0.2.2:8000';
} else {
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        const authToken = await AsyncStorage.getItem('userToken');
        if (!userData || !authToken) return;

        const parsed = JSON.parse(userData);
        setUserId(parsed.id);
        setToken(authToken);

        const res = await fetch(`${API_BASE_URL}/users/${parsed.id}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        const data = await res.json();

        if (res.ok) {
          setFormData({
            fullName: data.fullName,
            cpf: data.cpf,
            phone: data.phone,
            birthdate: data.birthdate?.slice(0, 10) || '',
          });
        } else {
          console.log('Erro ao buscar dados do usuário:', data);
        }
      } catch (err) {
        console.error('Erro de rede', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!userId || !token) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Sucesso', 'Informações atualizadas com sucesso!');
      } else {
        Alert.alert('Erro', data?.message || 'Falha ao atualizar dados.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Algo deu errado na requisição.');
    } finally {
      setSaving(false);
    }
  };

  const goToChangePassword = () => {
    // Navegar para modal de alteração de senha
  };

  const goToChangeEmail = () => {
    // Navegar para modal de alteração de e-mail
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

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 2, marginVertical: 12, marginBottom: 5 }}>
        <TouchableOpacity 
          onPress={goToChangePassword} 
          style={styles.buttonPassword}
        >
          <Text style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>
            Redefinir Senha
          </Text>
        </TouchableOpacity>
                <TouchableOpacity 
          onPress={goToChangeEmail} 
          style={styles.buttonEmail}
        >
          <Text style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }} >
            Alterar Email
          </Text> 
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
    textAlign: 'center'
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
  buttonPassword: {
    backgroundColor: '#482060',
    textAlign: 'center',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: '50%',
    borderWidth: 1,
  }, 
  buttonEmail: {
    backgroundColor: '#a856ebff',
    textAlign: 'center',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: '50%',
    borderWidth: 1,
    borderColor: '#fa7f72'
  },
  buttonSave: {
    backgroundColor: '#008000',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ff7fff',
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
});