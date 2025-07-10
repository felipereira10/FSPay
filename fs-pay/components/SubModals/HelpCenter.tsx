import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

function HelpOption({ title, description }: { title: string; description: string }) {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.helpOptionContainer}>
      <TouchableOpacity onPress={toggle} style={styles.optionHeader}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Ionicons
          name={expanded ? 'chevron-up-outline' : 'chevron-down-outline'}
          size={20}
          color="#555"
        />
      </TouchableOpacity>
      {expanded && <Text style={styles.optionDescription}>{description}</Text>}
    </View>
  );
}

export default function HelpCenter() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Precisa de ajuda?</Text>

      <HelpOption
        title="Como redefinir minha senha?"
        description="Para redefinir sua senha, acesse as configurações do aplicativo e siga as instruções na seção de segurança."
      />
      <HelpOption
        title="Problemas com pagamento"
        description="Verifique se seus dados estão atualizados e tente novamente. Caso o problema persista, entre em contato com o suporte."
      />
      <HelpOption
        title="Como atualizar meus dados?"
        description="Acesse o menu de configurações e selecione a opção para atualizar seus dados pessoais."
      />
      <HelpOption
        title="Falar com o suporte"
        description="Nosso suporte está disponível 24h para te ajudar. Utilize o botão de contato abaixo."
      />

      <View style={styles.contactContainer}>
        <Text style={styles.contactTitle}>Entre em contato conosco</Text>
        <Text style={styles.contactPhone}>0800 123 4567</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 20,
  },
  helpOptionContainer: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#555',
    paddingBottom: 10,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  optionDescription: {
    marginTop: 8,
    fontSize: 14,
    color: '#555',
  },
  contactContainer: {
    marginTop: 30,
  },
  contactTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  contactPhone: {
    fontSize: 14,
    color: '#333',
  },
});