import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserByIdSelf, updateUserSelf } from '../../services/api';
import LottieView from 'lottie-react-native';
import MaskInput, { Masks } from 'react-native-mask-input';
import Modal from 'react-native-modal';
import { router } from 'expo-router';

export default function AccountInfo() {
  const [formData, setFormData] = useState({
    fullName: '',
    cpf: '',
    phone: '',
    birthdate: '',
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
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
          birthdate: data.birthdate ? formatDateToBR(data.birthdate) : '',
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

  const formatDateToBR = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const isValidDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    return (
      date.getDate() === day &&
      date.getMonth() === month - 1 &&
      date.getFullYear() === year
    );
  };


  const parseDateToISO = (brDate: string) => {
    const [day, month, year] = brDate.split('/');
    if (!day || !month || !year) return '';
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const handleSave = async () => {
    if (!userId || !token) return;
    setSaving(true);

    try {
      const isoDate = parseDateToISO(formData.birthdate);

      if (!isoDate || isoDate.length !== 10) {
        Alert.alert('Erro', 'Data de nascimento inválida');
        return;
      }

      const payload = {
        ...formData,
        birthdate: isoDate,
      };

      await updateUserSelf(userId, payload);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.back();
      }, 2000);
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

      <Text style={styles.label}>Nome completo</Text>
      <MaskInput
        value={formData.fullName}
        onChangeText={(text) => handleChange('fullName', text)}
        style={[
          styles.input,
          focusedField === 'fullName' && styles.inputFocused,
        ]}
        onFocus={() => setFocusedField('fullName')}
        onBlur={() => setFocusedField(null)}
      />

      <Text style={styles.label}>CPF</Text>
      <MaskInput
        value={formData.cpf}
        onChangeText={(masked, unmasked) => handleChange('cpf', unmasked)}
        mask={Masks.BRL_CPF}
        keyboardType="numeric"
        style={[
          styles.input,
          focusedField === 'cpf' && styles.inputFocused,
        ]}
        onFocus={() => setFocusedField('cpf')}
        onBlur={() => setFocusedField(null)}
      />

      <Text style={styles.label}>Celular</Text>
      <MaskInput
        value={formData.phone}
        onChangeText={(masked, unmasked) => handleChange('phone', unmasked)}
        mask={Masks.BRL_PHONE}
        keyboardType="numeric"
        style={[
          styles.input,
          focusedField === 'phone' && styles.inputFocused,
        ]}
        onFocus={() => setFocusedField('phone')}
        onBlur={() => setFocusedField(null)}
      />

      <Text style={styles.label}>Data de nascimento</Text>
      <MaskInput
        value={formData.birthdate}
        onChangeText={(masked) => handleChange('birthdate', masked)}
        mask={Masks.DATE_DDMMYYYY}
        keyboardType="numeric"
        style={[
          styles.input,
          focusedField === 'birthdate' && styles.inputFocused,
        ]}
        onFocus={() => setFocusedField('birthdate')}
        onBlur={() => setFocusedField(null)}
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

      <Modal isVisible={showSuccess}>
        <View style={styles.modalContentSucess}>
          <LottieView
            source={require('../../assets/check-success.json')}
            autoPlay
            loop={false}
            style={{ width: 200, height: 200 }}
          />
          <Text style={{ color: 'green', fontSize: 18, marginTop: 10, fontWeight: 'bold' }}>
            Alterado com sucesso!
          </Text>
        </View>
      </Modal>

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
  label: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f1f1f1',
    marginBottom: 12,
    padding: 10,
    borderRadius: 6,
  },
  inputFocused: {
    borderColor: '#00ced1',
    borderWidth: 2,
    borderRadius: 18,
    backgroundColor: '#c6efef',
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
  modalContentSucess: {
    backgroundColor: '#a2eba2e3',
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    width: '70%',
    height: '40%',
    alignSelf: 'center',
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