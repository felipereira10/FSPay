import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const LOCAL = true; // true = backend no PC, false = produção

const isExpoGo = Constants.appOwnership === 'expo';

let API_BASE_URL = '';

if (isExpoGo) {
  // ⚠️ Coloque aqui o IP local do seu computador (quando usar Expo Go)
  // IP da rede do trampo
  API_BASE_URL = 'http://192.168.0.53:8000';
  // IP da rede de casa
  // API_BASE_URL = 'http://192.168.0.53:8000';
} else if (Platform.OS === 'android') {
  // Android Studio emulador
  API_BASE_URL = 'http://10.0.2.2:8000';
} else {
  // iOS emulador ou build física
  API_BASE_URL = 'http://localhost:8000';
}

// Fallback: dados mock para testes offline
const mockLogin = async (email: string, password: string) => {
  if (email === 'admin@fspay.com' && password === '1234') {
    return {
      token: 'fake-token',
      user: {
        email,
        role: 'admin',
        name: 'Admin FSPay',
      },
    };
  } else {
    throw new Error('Credenciais inválidas (modo mock)');
  }
};

// Cria uma instância do axios com base na URL
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Login
export async function loginUser(email: string, password: string) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (err) {
    console.warn('[loginUser] Backend offline, usando modo mock.');
    return mockLogin(email, password); // fallback aqui
  }
}

// Signup
export const signupUser = async (email: string, password: string, extraData: { fullName: string; cpf: string; birthdate: string; phone: string; }) => {
  try {
    const res = await api.post('/auth/signup', {
      email,
      password,
      ...extraData,
    });
    return res.data;
  } catch (err) {
    console.warn('[signupUser] Backend offline, mock não disponível para cadastro.');
    throw new Error('Backend offline. Não foi possível cadastrar.');
  }
};