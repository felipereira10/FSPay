import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import LoginScreen from './app/screens/Login'; // Ou qualquer tela de login
import TransferScreen from './app/shortcut/Transfer'; // Exemplo de outra tela

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Transfer" component={TransferScreen} />
      </Stack.Navigator>

      {/* Componente Toast global */}
      <Toast />
    </NavigationContainer>
  );
}
