import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { loginUser } from '../services/api';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  async function handleLogin() {
    try {
      const data = await loginUser(email, password);
      console.log('Logou, token:', data.token);
      // salva token no AsyncStorage ou contexto e navega pro app principal
      router.push('/tabs/index');
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
      <TextInput
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
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
});
