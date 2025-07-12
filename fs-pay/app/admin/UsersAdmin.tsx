import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { getAllUsers, deleteUser, approveUser } from '../../services/api';
import Toast from 'react-native-toast-message';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';

export default function UsersAdmin() {
  type User = {
    id: number;
    fullName: string;
    email: string;
    cpf: string;
    phone: string;
    birthdate: string;
    role: string;
    is_approved: boolean;
  };

  const [users, setUsers] = useState<User[]>([]);
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<null | boolean>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const fetchUsers = async () => {
    try {
      const result = await getAllUsers();
      setUsers(result);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível carregar os usuários');
    }
  };

    useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (userId: number) => {
      setSelectedUserId(userId);
      setShowDeleteConfirm(true);
    };

  const confirmDelete = async () => {
    if (!selectedUserId) return;
    try {
      await deleteUser(selectedUserId);
      setShowDeleteConfirm(false);
      setShowDeleteSuccess(true);
      fetchUsers();
      setTimeout(() => setShowDeleteSuccess(false), 2000);
    } catch {
      Alert.alert('Erro', 'Erro ao excluir o usuário');
    }
  };

  const handleApprove = async (userId: any) => {
    try {
      await approveUser(userId);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        fetchUsers();
      }, 2000);
    } catch {
      Alert.alert('Erro', 'Não foi possível aprovar o usuário');
    }
  };

  const renderUser = ({ item }: { item: User }) => {
    return (
      <View style={styles.userCard}>
        <Text style={styles.userText}>Nome: {item.fullName}</Text>
        <Text style={styles.userText}>Email: {item.email}</Text>
        <Text style={styles.userText}>CPF: {item.cpf}</Text>
        <Text style={styles.userText}>Celular: {item.phone}</Text>
        <Text style={styles.userText}>Nascimento: {item.birthdate?.toString()}</Text>
        <Text style={styles.userText}>Cargo: {item.role}</Text>


        {item.role !== 'admin' && !item.is_approved && (
          <TouchableOpacity onPress={() => handleApprove(item.id)}>
            <Text style={{ color: 'green' }}>Aprovar</Text>
          </TouchableOpacity>
        )}

        <View style={styles.actions}>
          <TouchableOpacity onPress={() => {
            console.log("Navegando para:", `/admin/EditUser/${item.id}`);
            router.push(`/admin/EditUser/${item.id}`);
          }}>
            <Text style={styles.editBtn}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Text style={styles.deleteBtn}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    const matchesText =
      user.fullName.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.cpf.includes(term) ||
      user.phone.includes(term);

    const matchesStatus =
      filterStatus === null || user.is_approved === filterStatus;

    return matchesText && matchesStatus;
  });



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome, email, CPF ou telefone"
          placeholderTextColor="#888"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity style={styles.reloadButton} onPress={fetchUsers}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>⟳</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterButtons}>
        <TouchableOpacity
          onPress={() => setFilterStatus(null)}
          style={[styles.filterBtn, filterStatus === null && styles.activeFilter]}
        >
          <Text>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilterStatus(true)}
          style={[styles.filterBtn, filterStatus === true && styles.activeFilter]}
        >
          <Text>Aprovados</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilterStatus(false)}
          style={[styles.filterBtn, filterStatus === false && styles.activeFilter]}
        >
          <Text>Pendentes</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredUsers}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={renderUser}
      />
    


      <Modal isVisible={showSuccess}>
        <View style={styles.modalContentSucess}>
          <LottieView source={require('../../assets/check-success.json')} autoPlay loop={false} style={{ width: 150, height: 150 }} />
          <Text style={{ color: 'green', fontSize: 18, marginTop: 10, fontWeight: 'bold', }}>Aprovado com sucesso!</Text>
        </View>
      </Modal>

      <Modal isVisible={showDeleteConfirm}>
        <View style={styles.modalContentDelete}>
          <Text style={styles.modalDeleteTitle}>Tem certeza que deseja excluir?</Text>
          <View style={{ flexDirection: 'row', marginTop: 1 }}>
            <TouchableOpacity onPress={confirmDelete} style={styles.deleteButton}>
              <Text style={{ color: 'white', fontWeight: 'bold', }}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowDeleteConfirm(false)} style={styles.cancelButton}>
              <Text style={{ color: 'black', fontWeight: 'bold', }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal isVisible={showDeleteSuccess}>
        <View style={styles.modalContentDeleteSuccess}>
          <LottieView
            source={require('../../assets/check-error.json')}
            autoPlay
            loop={false}
            style={{ width: 150, height: 150 }}
          />
          <Text style={{ color: 'white', fontSize: 18, marginTop: 20, fontWeight: 'bold', textAlign: 'center' }}>Usuário excluído com sucesso!</Text>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#bf930d',
  },
  button: {
    backgroundColor: '#1976d2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  userCard: {
    padding: 15,
    borderWidth: 3,
    borderColor: '#000',
    backgroundColor: '#fff',
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
  modalContentSucess: { 
    backgroundColor: '#a2eba2e3', 
    padding: 10, 
    alignItems: 'center', 
    borderRadius: 10,
    width: '70%',
    height: '40%',
    alignSelf: 'center',
  },
  modalContentDelete: { 
    backgroundColor: '#fff', 
    padding: 20, 
    alignItems: 'center', 
    borderRadius: 10,
    width: '70%',
    height: '20%',
    alignSelf: 'center',
  },
  modalContentDeleteSuccess: { 
    backgroundColor: '#b95252d2',
    padding: 10, 
    alignItems: 'center', 
    borderRadius: 10,
    width: '80%',
    height: '40%',
    alignSelf: 'center',
  },
  modalDeleteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  deleteButton: {
    backgroundColor: 'red',
    flex: 1,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#999',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'white',
    flex: 1,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#999',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
},
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: '#f1f1f1',
  },
  reloadButton: {
    backgroundColor: '#f3ca4c',
    padding: 10,
    borderRadius: 5,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  activeFilter: {
    backgroundColor: '#f3ca4c',
  },
});