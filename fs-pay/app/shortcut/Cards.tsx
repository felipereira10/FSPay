import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Cartao {
  id: string;
  nome: string;
  numero: string;
  validade: string;
  bandeira: string;
}

export default function Cards() {
  const [cartoes, setCartoes] = useState<Cartao[]>([
    {
      id: '1',
      nome: 'FSPay Black',
      numero: '**** **** **** 9832',
      validade: '12/28',
      bandeira: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg',
    },
  ]);

  const adicionarCartao = () => {
    const novoCartao: Cartao = {
      id: (Math.random() * 100000).toFixed(0),
      nome: `FSPay Gold`,
      numero: `**** **** **** ${Math.floor(Math.random() * 9000 + 1000)}`,
      validade: '10/27',
      bandeira: 'https://upload.wikimedia.org/wikipedia/commons/4/41/MasterCard_Logo.svg',
    };

    setCartoes((prev) => [...prev, novoCartao]);
  };

  const confirmarRemocao = (id: string) => {
    Alert.alert(
      'Remover Cartão',
      'Você tem certeza que deseja remover este cartão?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: () => removerCartao(id) },
      ],
      { cancelable: true }
    );
  };

  const removerCartao = (id: string) => {
    setCartoes((prev) => prev.filter((cartao) => cartao.id !== id));
  };

  const renderCartao = ({ item }: { item: Cartao }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.nome}</Text>
      <Text style={styles.cardNumber}>{item.numero}</Text>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Validade:</Text>
        <Text style={styles.cardValue}>{item.validade}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Bandeira:</Text>
        <Image source={{ uri: item.bandeira }} style={styles.brandLogo} resizeMode="contain" />
      </View>

      <TouchableOpacity
        onPress={() => confirmarRemocao(item.id)}
        style={styles.deleteButton}
      >
        <Ionicons name="trash-outline" size={18} color="#fff" />
        <Text style={styles.deleteText}>Remover</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seus Cartões</Text>
      <Text style={styles.description}>
        Visualize e gerencie seus cartões FSPay.
      </Text>

      <FlatList
        data={cartoes}
        keyExtractor={(item) => item.id}
        renderItem={renderCartao}
        style={{ width: '100%' }}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <TouchableOpacity style={styles.button} onPress={adicionarCartao}>
        <Ionicons name="add-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.buttonText}>Adicionar Cartão</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fefd',
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#014141',
  },
  description: {
    marginVertical: 15,
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
  },
  card: {
    backgroundColor: '#014141',
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
  },
  cardTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  cardNumber: {
    fontSize: 20,
    color: '#fff',
    letterSpacing: 2,
    marginVertical: 10,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cardLabel: {
    color: '#b0fdfc',
    fontSize: 14,
  },
  cardValue: {
    color: '#fff',
    fontSize: 14,
  },
  brandLogo: {
    width: 50,
    height: 20,
  },
  button: {
    backgroundColor: '#014141',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#d9534f',
    marginTop: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deleteText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 6,
  },
});