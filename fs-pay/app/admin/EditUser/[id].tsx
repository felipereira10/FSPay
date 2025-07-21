import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getUserById, updateUser } from '../../../services/api';
import Toast from 'react-native-toast-message';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import MaskInput, { Masks } from 'react-native-mask-input';
import AnimatedScaleButton from '@/components/Buttons/AnimatedScaleButton';
import AnimatedFadeButton from '@/components/Buttons/AnimatedFadeButton';


export default function EditUser() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };


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
      console.log("Enviando payload:", payload);
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
        style={[
          styles.input,
          focusedField === 'fullName' && styles.inputFocused
        ]}
        onFocus={() => setFocusedField('fullName')}
        onBlur={() => setFocusedField(null)}
      />

      <Text style={styles.label}>Email</Text>
      <MaskInput
        value={form.email}
        editable={false}
        style={[styles.input, { backgroundColor: '#999' }]}
      />

      <Text style={styles.label}>Telefone</Text>
      <MaskInput
        value={form.phone}
        onChangeText={(masked, unmasked) => handleChange('phone', unmasked)}
        mask={Masks.BRL_PHONE}
        keyboardType="numeric"
        style={[
          styles.input,
          focusedField === 'phone' && styles.inputFocused
        ]}
        onFocus={() => setFocusedField('phone')}
        onBlur={() => setFocusedField(null)}
      />

      <Text style={styles.label}>CPF</Text>
      <MaskInput
        value={form.cpf}
        onChangeText={(masked, unmasked) => handleChange('cpf', unmasked)}
        mask={Masks.BRL_CPF}
        keyboardType="numeric"
        style={[
          styles.input,
          focusedField === 'cpf' && styles.inputFocused
        ]}
        onFocus={() => setFocusedField('cpf')}
        onBlur={() => setFocusedField(null)}
      />

      <Text style={styles.label}>Data de Nascimento</Text>
      <MaskInput
        value={form.birthdate}
        onChangeText={(masked) => handleChange('birthdate', masked)}
        mask={Masks.DATE_DDMMYYYY}
        keyboardType="numeric"
        style={[
          styles.input,
          focusedField === 'birthdate' && styles.inputFocused
        ]}
        onFocus={() => setFocusedField('birthdate')}
        onBlur={() => setFocusedField(null)}
      />    


      <Text style={styles.label}>Função</Text>
      <View style={styles.roleContainer}>
        {['admin', 'user', 'employee'].map((role) => (
          <AnimatedScaleButton
            key={role}
            onPress={() => handleChange('role', role)}
            style={[
              styles.roleButton,
              form.role === role && styles.roleButtonSelected,
            ]}
          >
            <Text style={{ color: form.role === role ? '#000' : '#fff', fontWeight: 'bold' }}>
              {role}
            </Text>
          </AnimatedScaleButton>
        ))}
      </View>

      <AnimatedFadeButton onPress={handleUpdate} style={styles.button}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </AnimatedFadeButton>

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
    backgroundColor: '#118096',
  },
  dateInfo: {
    fontSize: 14,
    marginBottom: 15,
    color: '#000',
    textAlign: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#00ced1',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 8,
    width: '60%',
  },
  label: {
    color: '#fff',
    marginBottom: 3,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#00ced1'
  },
  button: {
    backgroundColor: '#00ced1',
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
    borderWidth: 3,
    borderColor: '#00ced1',
    borderRadius: 5,
    minWidth: 80,
    alignItems: 'center',
  },
  roleButtonSelected: {
    backgroundColor: '#00ced1',
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  inputFocused: {
    borderColor: '#00ced1',
    borderWidth: 2,
    borderRadius: 18,
    backgroundColor: '#c6efef',
  },
});
