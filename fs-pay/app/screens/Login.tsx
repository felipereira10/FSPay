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
import { loginUser } from '../../services/api';
import Loading from '@/components/Loading';

export default function LoginScreen() {

  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    try {
      const result = await loginUser(email, password);

      if (result.token === undefined) {
        throw new Error('Token não retornado do backend');
      }

      await AsyncStorage.setItem('userToken', result.token);
      await AsyncStorage.setItem('userData', JSON.stringify(result.user));

      Toast.show({
        type: 'success',
        text1: 'Login realizado com sucesso!',
      });
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

  return isLoading ? <Loading /> : (
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

        {error && <Text style={{ color: 'red', backgroundColor: '#fff' }}>{error}</Text>}

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
    backgroundColor: '#118096',
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
    borderColor: '#00ced1',
    borderWidth: 2,
    backgroundColor: '#c6efef',
    borderRadius: 18
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
    backgroundColor: '#00ced1',
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
