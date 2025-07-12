import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getUserById, updateUser } from '../../../services/api';
import Toast from 'react-native-toast-message';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import MaskInput, { Masks } from 'react-native-mask-input';

export default function EditUser() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    cpf: '',
    birthdate: '',
    role: '',
    createdAt: '',
    updatedAt: '',
  });

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
        birthdate: formatDateBR(data.birthdate),
        role: data.role || '',
        createdAt: data.createdAt || '',
        updatedAt: data.updatedAt || '',
      });
    } catch {
      Toast.show({ type: 'error', text1: 'Erro ao carregar usuário' });
    }
  };

  const formatDateBR = (iso: string) => {
    if (!iso) return '';
    const [year, month, day] = iso.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  };

  const parseDateToISO = (brDate: string) => {
    const [day, month, year] = brDate.split('/');
    return `${year}-${month}-${day}`;
  };

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        ...form,
        birthdate: parseDateToISO(form.birthdate),
      };
      await updateUser(Number(id), payload);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.back();
      }, 2000);
    } catch {
      Toast.show({ type: 'error', text1: 'Erro ao atualizar usuário' });
    }
  };

  const displayDate = form.updatedAt || form.createdAt;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {displayDate && (
        <Text style={styles.dateInfo}>
          Última edição: {formatDateBR(displayDate)}
        </Text>
      )}

      <Text style={styles.label}>Nome</Text>
      <MaskInput
        value={form.fullName}
        onChangeText={(v) => handleChange('fullName', v)}
        style={styles.input}
      />

      <Text style={styles.label}>Email</Text>
      <MaskInput
        value={form.email}
        editable={false}
        style={[styles.input, { backgroundColor: '#eee' }]}
      />

      <Text style={styles.label}>Telefone</Text>
      <MaskInput
        value={form.phone}
        onChangeText={(masked, unmasked) => handleChange('phone', unmasked)}
        mask={Masks.BRL_PHONE}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>CPF</Text>
      <MaskInput
        value={form.cpf}
        onChangeText={(masked, unmasked) => handleChange('cpf', unmasked)}
        mask={Masks.BRL_CPF}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Data de Nascimento</Text>
      <MaskInput
        value={form.birthdate}
        onChangeText={(masked) => handleChange('birthdate', masked)}
        mask={Masks.DATE_DDMMYYYY}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Função</Text>
      <View style={styles.roleContainer}>
        {['admin', 'user', 'employee'].map((role) => (
          <TouchableOpacity
            key={role}
            onPress={() => handleChange('role', role)}
            style={[
              styles.roleButton,
              form.role === role && styles.roleButtonSelected,
            ]}
          >
            <Text style={{ color: form.role === role ? '#fff' : '#000' }}>
              {role}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={handleUpdate} style={styles.button}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>

      <Modal isVisible={showSuccess}>
        <View style={styles.modalContentSucess}>
          <LottieView
            source={require('../../../assets/check-success.json')}
            autoPlay
            loop={false}
            style={{ width: 200, height: 200 }}
          />
          <Text style={{ color: 'green', fontSize: 18, marginTop: 10, fontWeight: 'bold' }}>
            Alterado com sucesso!
          </Text>
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
  dateInfo: {
    fontSize: 14,
    marginBottom: 15,
    color: '#888',
    textAlign: 'right',
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
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  roleButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    minWidth: 80,
    alignItems: 'center',
  },
  roleButtonSelected: {
    backgroundColor: '#f3ca4c',
  },
});
