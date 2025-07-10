import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { signupUser } from '../../services/api';
import { MaterialIcons } from '@expo/vector-icons';
import FloatingDollar from '../implements/FloatingDollar';

export default function SignupScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setshowConfirmPassword] = useState(false);

  function validateEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email);
  }

  function validateCPF(cpf: string) {
    return cpf.replace(/\D/g, '').length === 11;
  }

  // Máscara CPF: 12345678901 -> 123.456.789-01
  function formatCpf(value: string) {
    const onlyNumbers = value.replace(/\D/g, '');
    let formatted = onlyNumbers;
    if (onlyNumbers.length > 3) {
      formatted = onlyNumbers.slice(0, 3) + '.' + onlyNumbers.slice(3);
    }
    if (onlyNumbers.length > 6) {
      formatted = formatted.slice(0, 7) + '.' + onlyNumbers.slice(6);
    }
    if (onlyNumbers.length > 9) {
      formatted = formatted.slice(0, 11) + '-' + onlyNumbers.slice(9, 11);
    }
    return formatted.slice(0, 14);
  }

  // Máscara data: 01011990 -> 01/01/1990
  function formatDate(value: string) {
    const onlyNumbers = value.replace(/\D/g, '');
    let formatted = onlyNumbers;
    if (onlyNumbers.length > 2) {
      formatted = onlyNumbers.slice(0, 2) + '/' + onlyNumbers.slice(2);
    }
    if (onlyNumbers.length > 4) {
      formatted = formatted.slice(0, 5) + '/' + onlyNumbers.slice(4, 8);
    }
    return formatted.slice(0, 10);
  }

  // Máscara telefone: 11987654321 -> (11) 98765-4321
  function formatPhone(value: string) {
    const onlyNumbers = value.replace(/\D/g, '');
    let formatted = onlyNumbers;

    if (onlyNumbers.length > 0) {
      formatted = '(' + onlyNumbers.slice(0, 2);
    }
    if (onlyNumbers.length >= 3) {
      formatted += ') ' + onlyNumbers.slice(2, 7);
    }
    if (onlyNumbers.length >= 8) {
      formatted += '-' + onlyNumbers.slice(7, 11);
    }
    return formatted.slice(0, 15);
  }

  async function handleSignup() {
    if (!fullName.trim()) return Toast.show({ type: 'error', text1: 'Preencha o nome completo' });
    if (!validateEmail(email)) return Toast.show({ type: 'error', text1: 'Email inválido' });
    if (password.length < 6) return Toast.show({ type: 'error', text1: 'Senha muito curta' });
    if (password !== confirmPassword) {
        return Toast.show({ type: 'error', text1: 'As senhas não coincidem' });
    }
    if (!validateCPF(cpf)) return Toast.show({ type: 'error', text1: 'CPF inválido' });
    if (!birthdate) return Toast.show({ type: 'error', text1: 'Data de nascimento é obrigatória' });

    setLoading(true);

async function handleSignup() {
  // ... tuas validações

  setLoading(true);

  try {
    const isoBirthdate = birthdate.split('/').reverse().join('-');

    const data = await signupUser(email, password, {
      fullName,
      cpf: cpf.replace(/\D/g, ''),
      birthdate: isoBirthdate,
      phone: phone.replace(/\D/g, ''),
    });

    console.log('[handleSignup] Resposta:', data);

    Toast.show({
      type: 'success',
      text1: 'Cadastro enviado para análise!',
      text2: 'Aguarde aprovação para acessar o app.',
    });

    router.push('/screens/Login');

  } catch (error: any) {
    const detail = error.message;
    // teus erros continuam
  } finally {
    setLoading(false);
  }
}

  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >

        {/* <FloatingDollar /> */}

        <TextInput
          placeholder="Nome completo"
          value={fullName}
          onChangeText={setFullName}
          style={[styles.input, focusedField === 'fullName' && styles.inputFocused]}
          onFocus={() => setFocusedField('fullName')}
          onBlur={() => setFocusedField(null)}
        />
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={[styles.input, focusedField === 'email' && styles.inputFocused]}
          onFocus={() => setFocusedField('email')}
          onBlur={() => setFocusedField(null)}
          autoCapitalize="none"
        />
        <View style={[styles.passwordContainer, focusedField === 'password' && styles.inputFocused]}>
            <TextInput
            placeholder="Senha"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            style={[styles.input, { flex: 1, marginVertical: 0 }]}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.toggleButton}>
            <MaterialIcons
                name={showPassword ? 'visibility-off' : 'visibility'}
                size={24}
                color="gray"
            />
            </TouchableOpacity>
        </View>
        <View style={[styles.passwordContainer, focusedField === 'confirmPassword' && styles.inputFocused]}>
            <TextInput
                placeholder="Confirme sua senha"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={[styles.input, { flex: 1, marginVertical: 0 }]}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField(null)}
            />
            <TouchableOpacity onPress={() => setshowConfirmPassword(!showConfirmPassword)} style={styles.toggleButton}>
                <MaterialIcons
                name={showConfirmPassword ? 'visibility-off' : 'visibility'}
                size={24}
                color="gray"
                />
            </TouchableOpacity>
        </View>
        <TextInput
          placeholder="CPF"
          value={cpf}
          onChangeText={(text) => setCpf(formatCpf(text))}
          style={[styles.input, focusedField === 'cpf' && styles.inputFocused]}
          onFocus={() => setFocusedField('cpf')}
          onBlur={() => setFocusedField(null)}
          keyboardType="numeric"
          maxLength={14}
        />
        <TextInput
          placeholder="Data de nascimento"
          value={birthdate}
          onChangeText={(text) => setBirthdate(formatDate(text))}
          style={[styles.input, focusedField === 'birthdate' && styles.inputFocused]}
          onFocus={() => setFocusedField('birthdate')}
          onBlur={() => setFocusedField(null)}
          maxLength={10}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Telefone"
          value={phone}
          onChangeText={(text) => setPhone(formatPhone(text))}
          style={[styles.input, focusedField === 'phone' && styles.inputFocused]}
          onFocus={() => setFocusedField('phone')}
          onBlur={() => setFocusedField(null)}
          keyboardType="phone-pad"
          maxLength={15}
        />

        <TouchableOpacity onPress={handleSignup} style={styles.button} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Cadastrando...' : 'Cadastrar'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#bf930d',
    flexGrow: 1,
    justifyContent: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    height: 40,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '80%',
    alignSelf: 'center',
    marginVertical: 10,
  },
  inputFocused: {
    borderColor: '#f3ca4c',
    borderWidth: 2,
    backgroundColor: '#fffbe6',
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#f3ca4c',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    width: '50%',
    marginTop: 20,
  },
  buttonText: {
    color: '#222',
    fontWeight: 'bold',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginVertical: 10,
    width: '80%',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignSelf: 'center',
  },
  toggleButton: {
    marginLeft: 10,
  },
});

