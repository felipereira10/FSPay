import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const LOCAL = true; // true = backend no PC, false = produção

const USE_MOCK =
  Constants.expoConfig?.extra?.USE_MOCK ??
  Constants.manifest?.extra?.USE_MOCK ??
  false;

console.log('USE_MOCK resolve como:', USE_MOCK, 'Tipo:', typeof USE_MOCK);

const isExpoGo = Constants.appOwnership === 'expo';

let API_BASE_URL = '';

if (isExpoGo) {
  // ⚠️ Coloque aqui o IP local do seu computador (quando usar Expo Go)
  // IP da rede do trampo
  API_BASE_URL = 'http://192.168.0.53:8000';
  // IP da rede de casa
  //API_BASE_URL = 'http://192.168.1.70:8000';
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
    console.log('[loginUser] Enviando para backend:', email);
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
      const status = err?.response?.status;
      const data = err?.response?.data;

      if (status === 401) {
        const detail = data?.detail || 'Credenciais inválidas';
        throw new Error(detail);
      }

      console.log('[loginUser] Erro inesperado:', data || err.message);
      throw new Error('Erro inesperado ao conectar com o backend');
    }
  }

// Signup
export const signupUser = async (
  email: string,
  password: string,
  extraData: { fullName: string; cpf: string; birthdate: string; phone: string; }
) => {
  try {
    const res = await api.post('/auth/signup', {
      email,
      password,
      ...extraData,
    });
    return res.data;
  } catch (err: any) {
    const status = err?.response?.status;
    const detail = err?.response?.data?.detail;

    console.warn('[signupUser] Erro:', status, detail);

    if (status === 400 && detail) {
      throw new Error(detail);
    }

    throw new Error('Erro inesperado no cadastro');
  }
};


// Get user by ID
export const getAllUsers = async () => {
  const token = await AsyncStorage.getItem('userToken');
  const res = await api.get('/users/admin', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Delete user
export const deleteUser = async (userId: number) => {
  const token = await AsyncStorage.getItem('userToken');
  await api.delete(`/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get user by ID
// Usado na tela de edição de usuário
export const getUserById = async (userId: number) => {
  const token = await AsyncStorage.getItem('userToken');
  const res = await api.get(`/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Update user
// Usado na tela de edição de usuário
export const updateUser = async (userId: number, updatedData: any) => {
  const token = await AsyncStorage.getItem('userToken');
  await api.put(`/users/${userId}`, updatedData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const approveUser = async (userId: any) => {
  const token = await AsyncStorage.getItem('userToken');
  await api.put(`/users/${userId}/approve`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
