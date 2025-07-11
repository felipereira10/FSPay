import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getUserById, updateUser } from '../../../services/api';
import Toast from 'react-native-toast-message';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';

export default function EditUser() {
  const { id } = useLocalSearchParams();
  const [users, setUsers] = useState([]);
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    cpf: '',
    birthdate: '',
    role: '',
  });
  
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const data = await getUserById(Number(id));
      setForm({
        fullName: data.fullName || '',
        email: data.email || '',
        phone: data.phone || '',
        cpf: data.cpf || '',
        birthdate: data.birthdate?.split('T')[0] || '',
        role: data.role || '',
      });
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível carregar os dados');
    }
  };

  const handleUpdate = async () => {
    try {
      await updateUser(Number(id), form);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.back();
      }, 2000);
    } catch (err) {
      Alert.alert('Erro', 'Erro ao atualizar o usuário');
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput
        value={form.fullName}
        onChangeText={(v) => handleChange('fullName', v)}
        style={styles.input}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={form.email}
        editable={false}
        style={[styles.input, { backgroundColor: '#eee' }]}
      />

      <Text style={styles.label}>Telefone</Text>
      <TextInput
        value={form.phone}
        onChangeText={(v) => handleChange('phone', v)}
        style={styles.input}
      />

      <Text style={styles.label}>CPF</Text>
      <TextInput
        value={form.cpf}
        onChangeText={(v) => handleChange('cpf', v)}
        style={styles.input}
      />

      <Text style={styles.label}>Data de Nascimento</Text>
      <TextInput
        value={form.birthdate}
        onChangeText={(v) => handleChange('birthdate', v)}
        placeholder="YYYY-MM-DD"
        style={styles.input}
      />

      <Text style={styles.label}>Função (role)</Text>
      <TextInput
        value={form.role}
        onChangeText={(v) => handleChange('role', v)}
        style={styles.input}
      />

      <TouchableOpacity onPress={handleUpdate} style={styles.button}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>

      {/* Modal de sucesso */}
      <Modal isVisible={showSuccess}>
        <View style={styles.modalContentSucess}>
          <LottieView source={require('../../../assets/check-success.json')} autoPlay loop={false} style={{ width: 200, height: 200 }} />
          <Text style={{ color: 'green', fontSize: 18, marginTop: 10, fontWeight: 'bold', }}>Alterado com sucesso!</Text>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#f3ca4c',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    fontWeight: 'bold',
  },
  modalContentSucess: { 
    backgroundColor: '#a2eba2e3', 
    padding: 10, 
    alignItems: 'center', 
    borderRadius: 10,
    width: '70%',
    height: '40%',
    alignSelf: 'center',
  },
});
