import React, { useState } from 'react';
import {
  Image,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { loginUser } from '../services/api';

export default function LoginScreen() {
  const USE_MOCK = false;

  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  async function handleLogin() {
    try {
      if (USE_MOCK) {
        if (email === 'admin@fspay.com' && password === '1234') {
          await AsyncStorage.setItem('userToken', 'fake-token');
          router.push('/Home');
        } else {
          throw new Error('Credenciais mock inválidas');
        }
        return;
      }
      const result  = await loginUser(email, password);
      console.log('Login result:', result);

      if (result.token === undefined) {
        throw new Error('Token não retornado do backend');
      }
      await AsyncStorage.setItem('userToken', result.token);
      router.push('/Home');
    } catch (err: any) {
      console.log(err);
      setError(err.message || 'Erro no login');
      Toast.show({
        type: 'error',
        text1: 'Erro de login',
        text2: err.message || 'Credenciais inválidas.',
        position: 'top',
        topOffset: 50,
      });
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} 
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Image source={require('../../assets/images/FSPayIdea.png')} style={styles.logo} />

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={[styles.input, focusedField === 'email' && styles.inputFocused]}
          onFocus={() => setFocusedField('email')}
          onBlur={() => setFocusedField(null)}
          autoCapitalize="none"
          keyboardType="email-address"
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

        {error && <Text style={{ color: 'red' }}>{error}</Text>}

        <TouchableOpacity onPress={handleLogin} style={styles.buttonLogin}>
          <Text>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/screens/Signup')}>
          <Text style={styles.signupLink}>
            Não tem uma conta? <Text style={styles.signupLinkBold}>Junte-se a nós</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#bf930d',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 350,
    height: 350,
    marginBottom: 10,
  },
  input: {
    width: '80%',
    height: 40,
    backgroundColor: '#fff',
    marginVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputFocused: {
    borderColor: '#f3ca4c',
    borderWidth: 2,
    backgroundColor: '#fffbe6',
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
  },
  toggleButton: {
    marginLeft: 10,
  },
  buttonLogin: {
    backgroundColor: '#f3ca4c',
    textAlign: 'center',
    padding: 20,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    width: '50%',
  },
  signupLink: {
    marginTop: 20,
    color: '#fff',
    textDecorationLine: 'underline',
  },
  signupLinkBold: {
    fontWeight: 'bold',
    color: '#fff',
  },
});
