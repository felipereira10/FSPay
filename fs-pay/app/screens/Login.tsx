import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { loginUser } from '../services/api';
import { useRouter } from 'expo-router';

// Mock da função loginUser (sem importar do serviço real)
async function loginUser(email: string, password: string, router: any) {
  // Simula sucesso se o email e senha forem corretos
  if (email === 'admin@fspay.com' && password === '1234') {
    await AsyncStorage.setItem('userToken', 'fake-token');  // Salvar o token
      router.push('/Home'); // Navegar para a home
    } else {
      alert('Credenciais inválidas!');
    }
  };

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

    async function handleLogin() {
      try {
        const mockMode = true;

        if (mockMode) {
          await loginUser(email, password, router); // Passar o router para a função loginUser
          console.log('Mock logado!');
        } else {
          // Aqui entraria o login real, caso estivesse com backend ativo
          // const data = await loginUser(email, password);
          // console.log('Logou, token:', data.token);
          // router.push('/');
        }
      } catch (err: any) {
        setError(err.message || 'Erro no login');
      }
    }
  

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Senha"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          style={[styles.input, { flex: 1, marginVertical: 0 }]}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.toggleButton}>
          <Text>{showPassword ? '🙈' : '👁️'}</Text>
        </TouchableOpacity>
      </View>

      {error && <Text style={{color: 'red'}}>{error}</Text>}

      <TouchableOpacity onPress={handleLogin} style={styles.buttonLogin}>
        <Text>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001f2f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 220,
    height: 220,
    marginBottom: 20,
  },
  slogan: {
    color: '#ffffff',
    fontSize: 16,
    fontStyle: 'italic',
  },
  // buttonSignup: {
  //   backgroundColor: '#fff',
  //   textAlign: 'center',
  //   padding: 20,
  //   borderRadius: 8,
  //   marginTop: 20,
  //   alignItems: 'center',
  //   width: '80%',
  // },
  input: {
    width: '80%',
    height: 40,
    backgroundColor: '#fff',
    marginVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonLogin: {
    backgroundColor: '#d4edda',
    textAlign: 'center',
    padding: 20,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    width: '50%',
  },
    passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginVertical: 10,
    width: '80%',
    paddingHorizontal: 10,
  },
  toggleButton: {
    marginLeft: 10,
  },
});
