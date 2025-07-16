import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Modal, Dimensions, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import Loading from '@/components/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Submodals
import UsersAdmin from '@/app/admin/UsersAdmin';
import AccountInfo from '@/components/SubModals/AccountInfo';
import SecurityCenter from '@/components/SubModals/SecurityCenter';
import PrivacySettings from '@/components/SubModals/Privacy';
import HelpCenter from '@/components/SubModals/HelpCenter';
import MyServices from '@/components/SubModals/MyServices';
import AboutApp from '@/components/SubModals/AboutApp';
import BusinessAccount from '@/components/SubModals/BusinessAccount';

const screenWidth = Dimensions.get('window').width;

export default function Home() {
  const [showBalance, setShowBalance] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [subModalVisible, setSubModalVisible] = useState(false);
  const [subModalType, setSubModalType] = useState< 'admin' | 'adminMenu' | 'adminUsers' | 'photo' | 'account' | 'security' | 'service' | 'privacy' | 'help' | 'accountpj' | 'about' | null>(null);
  const router = useRouter();
  const balance = 20530.75;
  const [confirmLogoutVisible, setConfirmLogoutVisible] = useState(false);
  const [authData, setAuthData] = useState<any>(null);

  useEffect(() => {
    const loadAuthData = async () => {
      const token = await AsyncStorage.getItem('userData');
      if (token) {
        setAuthData(JSON.parse(token));
      }
    };
    loadAuthData();
  }, []);


  const toggleBalance = () => setShowBalance(!showBalance);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);

      const formData = new FormData();
      formData.append("file", {
        uri,
        name: "profile.jpg",
        type: "image/jpeg",
      } as any);

      const token = await AsyncStorage.getItem("userToken");

      await fetch("http://SEU_IP:8000/users/upload-profile-pic", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
    }
  };


  const openSubModal = (type: 'admin' | 'adminMenu' | 'adminUsers' | 'photo' | 'account' | 'security' | 'service' | 'privacy' | 'help' | 'accountpj' | 'about' ) => {
    setSubModalType(type);
    setSubModalVisible(true);
  };

  const closeSubModal = () => {
    setSubModalVisible(false);
    setSubModalType(null);
  };

  const initialCards = [
    { id: '1', name: 'Transferir', icon: 'add-circle-outline', route: '/shortcut/Transfer' },
    { id: '2', name: 'Investimentos', icon: 'trending-up', route: '/shortcut/Invest' },
    { id: '3', name: 'Cartões', icon: 'card-outline', route: '/shortcut/Cards' },
    { id: '4', name: 'Empréstimos', icon: 'cash-outline', route: '/shortcut/Loans' },
  ];

  return isLoading ? <Loading /> : (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Ionicons name="person-circle-outline" size={52} color="#fff" />
          )}
        </TouchableOpacity>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconSpacing}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="help-circle-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Saldo */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Saldo disponível</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceValue}>
            {showBalance ? balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '••••••••'}
          </Text>
          <TouchableOpacity onPress={toggleBalance} style={{ marginLeft: 10 }}>
            <Ionicons name={showBalance ? 'eye-off' : 'eye'} size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Acessos */}
      <ScrollView contentContainerStyle={styles.cardContainer}>
        {initialCards.map((card) => (
          <TouchableOpacity key={card.id} style={styles.card} onPress={() => router.push(card.route)}>
            <Ionicons name={card.icon as any} size={34} color="#000" />
            <Text style={styles.cardText}>{card.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* MODAL LATERAL */}
      <Modal visible={modalVisible} animationType="slide" transparent>
      <View style={styles.sidebarContainer}>
        <View style={styles.sidebar}>
          <View style={styles.sidebarHeader}>
            <Text style={styles.sidebarTitle}>Perfil</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {authData?.role === 'admin' && (
          <TouchableOpacity style={styles.optionButton} onPress={() => openSubModal('adminMenu')}>
            <View style={styles.optionContent}>
              <Ionicons name="people-outline" size={20} color="#333" style={styles.optionIcon} />
              <Text style={styles.optionText}>Administração</Text>
              <Ionicons name="chevron-forward-outline" size={18} color="#888" />
            </View>
          </TouchableOpacity>

          )}
          <TouchableOpacity style={styles.optionButton} onPress={() => openSubModal('photo')}>
            <View style={styles.optionContent}>
              <Ionicons name="image-outline" size={20} color="#333" style={styles.optionIcon} />
              <Text style={styles.optionText}>Mudar foto de perfil</Text>
              <Ionicons name="chevron-forward-outline" size={18} color="#888" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={() => openSubModal('account')}>
            <View style={styles.optionContent}>
              <Ionicons name="person-outline" size={20} color="#333" style={styles.optionIcon} />
              <Text style={styles.optionText}>Minha conta</Text>
              <Ionicons name="chevron-forward-outline" size={18} color="#888" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={() => openSubModal('security')}>
            <View style={styles.optionContent}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#333" style={styles.optionIcon} />
              <Text style={styles.optionText}>Central de segurança</Text>
              <Ionicons name="chevron-forward-outline" size={18} color="#888" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={() => openSubModal('service')}>
            <View style={styles.optionContent}>
              <Ionicons name="briefcase-outline" size={20} color="#333" style={styles.optionIcon} />
              <Text style={styles.optionText}>Meus serviços</Text>
              <Ionicons name="chevron-forward-outline" size={18} color="#888" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={() => openSubModal('privacy')}>
            <View style={styles.optionContent}>
              <Ionicons name="lock-closed-outline" size={20} color="#333" style={styles.optionIcon} />
              <Text style={styles.optionText}>Privacidade</Text>
              <Ionicons name="chevron-forward-outline" size={18} color="#888" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={() => openSubModal('help')}>
            <View style={styles.optionContent}>
              <Ionicons name="help-circle-outline" size={20} color="#333" style={styles.optionIcon} />
              <Text style={styles.optionText}>Central de ajuda</Text>
              <Ionicons name="chevron-forward-outline" size={18} color="#888" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={() => openSubModal('help')}>
            <View style={styles.optionContent}>
              <Ionicons name="business-outline" size={20} color="#333" style={styles.optionIcon} />
              <Text style={styles.optionText}>Abrir conta PJ</Text>
              <Ionicons name="chevron-forward-outline" size={18} color="#888" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={() => openSubModal('help')}>
            <View style={styles.optionContent}>
              <Ionicons name="information-circle-outline" size={20} color="#333" style={styles.optionIcon} />
              <Text style={styles.optionText}>Sobre o aplicativo</Text>
              <Ionicons name="chevron-forward-outline" size={18} color="#888" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setConfirmLogoutVisible(true)}
          >
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>

          <Modal
            visible={confirmLogoutVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setConfirmLogoutVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.confirmModal}>
                <Text style={styles.modalLogoutTitle}>Deseja realmente sair?</Text>
                <View style={styles.modalButtonRow}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setConfirmLogoutVisible(false)}
                  >
                    <Text style={styles.cancelText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={async () => {
                      await AsyncStorage.removeItem('userToken');
                      setConfirmLogoutVisible(false);
                      router.replace('/');
                    }}
                  >
                    <Text style={styles.confirmText}>Sair</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </Modal>


      {/* SUBMODAL */}
      <Modal visible={subModalVisible} animationType="fade" transparent onRequestClose={closeSubModal}>
        <View style={styles.subModalBackground}>
          <View style={styles.subModalContainer}>
            {(() => {
              switch (subModalType) {
                case 'adminMenu':
                  return (
                    <View>
                      <Text style={{ fontSize: 18, padding: 10, fontWeight: 'bold', }}>Central Administrativa</Text>
                      <TouchableOpacity
                        onPress={() => {
                          closeSubModal();
                          router.push('/admin/UsersAdmin');
                        }}
                      >
                        <Text style={{ fontSize: 18, padding: 10, }}>Visualizar usuários</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => {/* outra opção admin */}}>
                        <Text style={{ fontSize: 18, padding: 10 }}>Outra ação</Text>
                      </TouchableOpacity>
                    </View>
                  );
                case 'adminUsers':
                  return <UsersAdmin />;
                case 'photo':
                  return (
                    <TouchableOpacity onPress={pickImage} style={styles.optionButton}>
                      <Text>Selecionar Imagem</Text>
                    </TouchableOpacity>
                  );
                case 'account':
                  return <AccountInfo />;
                case 'security':
                  return <SecurityCenter />;
                case 'service':
                  return <MyServices />;
                case 'privacy':
                  return <PrivacySettings />;
                case 'help':
                  return <HelpCenter />;
                case 'accountpj':
                  return <BusinessAccount />;
                case 'about':
                  return <AboutApp />;
                default:
                  return null;
              }
            })()}
            <TouchableOpacity onPress={closeSubModal} style={{ marginTop: 20 }}>
              <Text style={{ color: 'blue' }}>Voltar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* NAVBAR */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/tabs/Home')}>
          <Ionicons name="cash-outline" size={26} color="#000" />
          <Text style={styles.navText}>Conta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/shortcut/Invest')}>
          <Ionicons name="trending-up-outline" size={26} color="#000" />
          <Text style={styles.navText}>Investimentos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/shortcut/Cards')}>
          <Ionicons name="card-outline" size={26} color="#000" />
          <Text style={styles.navText}>Cartões</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setModalVisible(true)}>
          <Ionicons name="menu-outline" size={26} color="#000" />
          <Text style={styles.navText}>Menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#118096',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#00ced1',
    borderRadius: 12, 
    width: '47%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderColor: '#000',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconSpacing: {
    marginRight: 15,
  },
  profileImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  balanceContainer: {
    marginTop: 40,
  },
  balanceLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    color: '#fff',
  },
  balanceValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    // borderColor: '#fff',
    // borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: screenWidth * 0.6,
    maxWidth: '100%',
    flexShrink: 1, // Permite que o texto encolha se necessário
    lineHeight: 32, // Ajuste a altura da linha para melhor legibilidade
  },
  cardContainer: {
    marginTop: 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 20,
  },
  cardText: {
    marginTop: 10,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  sidebarBackground: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 99,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  optionButton: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#000',
  
  },
  sidebarContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sidebar: {
    width: '75%',
    backgroundColor: '#00ced1',
    padding: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
// Submodals:
  subModalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  subModalContainer: {
    width: '100%',
    backgroundColor: '#00ced1',
    borderRadius: 10,
    padding: 20,
  },
  subModalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionIcon: {
    marginRight: 10,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    // backgroundColor: 'rgba(255, 255, 255, 0.1)',
    // borderRadius: 8,
  },
// Navbar:
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#00ced1',
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderColor: '#000',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
    color: '#000',
  },
  navText: {
    fontSize: 12,
    color: '#000',
    marginTop: 2,
  },
// Logout:
  logoutButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#bf1e2e',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
  },
  logoutText: {
    color: '#bf1e2e',
    fontWeight: 'bold',
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  confirmModal: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalLogoutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#999',
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 10,
    borderRadius: 8,
    backgroundColor: '#bf1e2e',
    alignItems: 'center',
  },
  cancelText: {
    color: '#333',
    fontWeight: 'bold',
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
  },



});