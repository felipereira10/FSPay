import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Constants from 'expo-constants';

export default function AboutApp() {

  const version = Constants.expoConfig?.extra?.appVersion || '1.0.0';
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sobre o aplicativo</Text>
      <Text style={styles.text}>
        O FSPay é uma solução digital desenvolvida para facilitar a gestão financeira pessoal
        e empresarial. Com ele, você pode realizar transferências, acompanhar seus investimentos,
        solicitar empréstimos e muito mais — tudo em um só lugar, com segurança e praticidade.
        {"\n\n"}
        Nosso compromisso é com a inovação, conectando tecnologia a um serviço humanizado,
        pensado para você. Atualizações constantes garantem melhorias na experiência do usuário
        e novas funcionalidades.
        {"\n\n"}
        Versão: {version}{'\n'}
        Desenvolvido por: Felipe Pereira
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#00ced1',
    flexGrow: 1,
    borderWidth: 3,
    borderRadius: 8,
    borderColor: '#014141',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 15,
    color: '#014141',
  },
  text: {
    fontSize: 16,
    color: '#000',
    lineHeight: 24,
  },
});

