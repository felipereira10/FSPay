import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { getAllUsers, deleteUser, approveUser } from '../../services/api';
import Toast from 'react-native-toast-message';


export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const result = await getAllUsers();
      setUsers(result);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível carregar os usuários');
    }
  };

  const handleDelete = async (userId: number) => {
    Alert.alert('Confirmar exclusão', 'Tem certeza que deseja excluir este usuário?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Excluir',
        onPress: async () => {
          try {
            await deleteUser(userId);
            Toast.show({ type: 'alert', text1: 'Usuário deletado com sucesso' });
            fetchUsers(); // Atualiza a lista
          } catch (err) {
            Alert.alert('Erro', 'Erro ao excluir o usuário');
          }
        },
      },
    ]);
  };

  const handleApprove = async (userId: any) => {
    try {
      await approveUser(userId); // nova função no api.js
      Toast.show({ type: 'success', text1: 'Usuário aprovado!' });
      fetchUsers();
    } catch {
      Alert.alert('Erro', 'Não foi possível aprovar o usuário');
    }
  };

  const renderUser = ({ item }: any) => (
    <View style={styles.userCard}>
      <Text style={styles.userText}>Nome: {item.fullName}</Text>
      <Text style={styles.userText}>Email: {item.email}</Text>
      <Text style={styles.userText}>Cargo: {item.role}</Text>
      {item.role !== 'admin' && !item.is_approved && (
        <TouchableOpacity onPress={() => handleApprove(item.id)}>
          <Text style={{ color: 'green' }}>Aprovar</Text>
        </TouchableOpacity>
      )}

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => router.push(`/admin/EditUser/${item.id}`)}>
          <Text style={styles.editBtn}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Text style={styles.deleteBtn}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={renderUser}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  userCard: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 15,
  },
  userText: {
    marginBottom: 5,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
  },
  editBtn: {
    color: 'blue',
    marginRight: 15,
  },
  deleteBtn: {
    color: 'red',
  },
});