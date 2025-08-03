import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router'; // se estiver usando expo-router

export default function SecurityCenter() {
  const router = useRouter(); // só se estiver usando expo-router

  const handleOptionPress = (optionName: string) => {
    Alert.alert('Ação', `Você clicou em: ${optionName}`);
    // ou use: router.push('/rota-segura') se quiser navegar
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Central de Segurança</Text>
      <Text style={styles.text}>
        Aumente a proteção da sua conta ativando todas as camadas de segurança disponíveis.
        Gerencie recursos como biometria, senha, localização e dispositivos autorizados.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nível de Proteção</Text>
        <Text style={styles.text}>Proteção média – 3 de 5 ativos</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleOptionPress('Modo Seguro')}
        >
          <Text style={styles.buttonText}>Ativar Modo Seguro</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Proteções Ativadas</Text>

        {[
          { name: 'Proteções inteligentes', status: 'Ativo' },
          { name: 'Proteção ao acesso', status: 'Ativo' },
          { name: 'Validação de identidade', status: 'Ativo' },
          { name: 'Geolocalização', status: 'Inativo' },
          { name: 'Modo seguro', status: 'Inativo' },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={() => handleOptionPress(item.name)}
          >
            <Text style={styles.optionText}>{item.name}</Text>
            <Text
              style={[
                styles.status,
                { backgroundColor: item.status === 'Ativo' ? '#DFF7E4' : '#FFF3CD', color: item.status === 'Ativo' ? '#1E7E34' : '#856404' },
              ]}
            >
              {item.status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Outras opções</Text>

        {[
          'Seguro celular',
          'Gestão de dispositivos',
          'Escanear QR Code',
          'Meus limites diários',
          'Senha',
          'Biometria no pagamento',
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={() => handleOptionPress(item)}
          >
            <Text style={styles.optionText}>{item}</Text>
            <Text style={styles.chevron}>{'>'}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
    borderRadius: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 10,
    color: '#014141',
  },
  text: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginBottom: 15,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#014141',
    marginBottom: 10,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  optionText: {
    fontSize: 16,
    color: '#222',
  },
  status: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 13,
    overflow: 'hidden',
  },
  chevron: {
    fontSize: 18,
    color: '#888',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#00ced1',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#014141',
    fontWeight: 'bold',
    fontSize: 16,
  },
});