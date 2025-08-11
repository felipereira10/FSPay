import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  UIManager
} from 'react-native';
import axios from 'axios';
import LottieView from 'lottie-react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const API_URL = 'http://SEU_BACKEND:PORT/api/invest/caixinhas';

interface Caixinha {
  id: number;
  name: string;
  current_value: number;
  target_value: number;
}

export default function InvestBoxes() {
  const [caixinhas, setCaixinhas] = useState<Caixinha[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState('');
  const [meta, setMeta] = useState('');

  useEffect(() => {
    carregarCaixinhas();
  }, []);

  const carregarCaixinhas = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/1`);
      setCaixinhas(res.data);
    } catch (err) {
      console.log('Erro ao carregar caixinhas', err);
    } finally {
      setLoading(false);
    }
  };

  const adicionarCaixinha = async () => {
    if (!nome.trim() || !meta.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    try {
      await axios.post(API_URL, {
        user_id: 1,
        name: nome,
        target_value: parseFloat(meta),
      });
      LayoutAnimation.easeInEaseOut();
      setModalVisible(false);
      setNome('');
      setMeta('');
      carregarCaixinhas();
    } catch (err) {
      console.log('Erro ao criar caixinha', err);
    }
  };

  const removerCaixinha = (id: number) => {
    Alert.alert('Confirmar', 'Deseja remover esta caixinha?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/${id}`);
            LayoutAnimation.easeInEaseOut();
            carregarCaixinhas();
          } catch (err) {
            console.log('Erro ao remover', err);
          }
        },
      },
    ]);
  };

  const renderCaixinha = ({ item }: { item: Caixinha }) => {
    const porcentagem = (item.current_value / item.target_value) * 100;
    return (
      <TouchableOpacity
        style={styles.caixinha}
        onLongPress={() => removerCaixinha(item.id)}
      >
        <Text style={styles.nome}>{item.name}</Text>
        <Text style={styles.meta}>
          R$ {item.current_value.toFixed(2)} / {item.target_value.toFixed(2)}
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${porcentagem}%` }]} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Minhas Caixinhas</Text>

      {loading ? (
        <LottieView
          source={require('../../assets/Loading.json')}
          autoPlay
          loop
          style={{ height: 150 }}
        />
      ) : (
        <FlatList
          data={caixinhas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCaixinha}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma caixinha criada ainda.</Text>}
        />
      )}

      {/* Botão Flutuante */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitulo}>Nova Caixinha</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={nome}
              onChangeText={setNome}
            />
            <TextInput
              style={styles.input}
              placeholder="Meta (R$)"
              keyboardType="numeric"
              value={meta}
              onChangeText={setMeta}
            />
            <TouchableOpacity style={styles.botaoSalvar} onPress={adicionarCaixinha}>
              <Text style={styles.botaoTexto}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ color: 'red', marginTop: 10 }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#014141' },
  caixinha: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  nome: { fontSize: 18, fontWeight: '600', color: '#333' },
  meta: { marginTop: 4, fontSize: 14, color: '#555' },
  progressBar: {
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 6,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: 10,
    backgroundColor: '#014141',
    borderRadius: 6,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#888',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#014141',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
    elevation: 5,
  },
  modalTitulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    marginTop: 10,
    borderRadius: 8,
  },
  botaoSalvar: {
    backgroundColor: '#014141',
    padding: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  botaoTexto: { color: '#fff', fontSize: 16 },
});