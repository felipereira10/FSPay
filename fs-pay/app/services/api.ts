import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// const LOCAL = true; // true = backend no PC, false = produção

const USE_MOCK =
  Constants.expoConfig?.extra?.USE_MOCK ??
  Constants.manifest?.extra?.USE_MOCK ??
  false;

console.log('USE_MOCK está como:', USE_MOCK);

const isExpoGo = Constants.appOwnership === 'expo';

let API_BASE_URL = '';

if (isExpoGo) {
  // ⚠️ Coloque aqui o IP local do seu computador (quando usar Expo Go)
  // IP da rede do trampo
  // API_BASE_URL = 'http://192.168.0.53:8000';
  // IP da rede de casa
  API_BASE_URL = 'http://192.168.1.70:8000';
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
  console.log('USE_MOCK está como:', USE_MOCK);
  if (USE_MOCK) {
    console.warn('[loginUser] Modo mock ativado.');
    return mockLogin(email, password);
  }
  try {
    console.log('[loginUser] Enviando para backend:', email, password);
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    });

    console.log('[loginUser] Resposta do backend:', response.data);

    const { access_token, user } = response.data;

    if (!access_token || !user) {
      throw new Error('Token ou usuário não retornado do backend');
    }

    return {
      token: access_token,
      user: {
        email: user.email,
        name: user.fullName || user.name || '', // fallback
        role: user.role || 'user',
      },
    };
  } catch (err: any) {
    console.log('[loginUser] Erro no backend:', err.response?.data || err.message);
    throw new Error('Falha ao conectar com o backend');
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