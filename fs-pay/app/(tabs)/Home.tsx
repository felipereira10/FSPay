import React, { useState } from 'react';
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
  const [subModalType, setSubModalType] = useState<'photo' | 'account' | 'security' | 'service' | 'privacy' | 'help' | 'accountpj' | 'about' | null>(null);
  const router = useRouter();
  const balance = 20530.75;

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


  const openSubModal = (type: 'photo' | 'account' | 'security' | 'service' | 'privacy' | 'help' | 'accountpj' | 'about' ) => {
    setSubModalType(type);
    setSubModalVisible(true);
  };

  const closeSubModal = () => {
    setSubModalVisible(false);
    setSubModalType(null);
  };

  const logout = () => {
    // Coloque aqui sua lógica de logout
    console.log('Deslogando...');
    setModalVisible(false);
    router.replace('/login'); // redireciona pro login
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
            style={[styles.optionButton, { marginTop: 30 }]}
            onPress={async () => {
              await AsyncStorage.removeItem('userToken');
              router.replace('/'); // Redireciona pro login
            }}
          >
            <Text style={{ color: 'red' }}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>


      {/* SUBMODAL */}
      <Modal visible={subModalVisible} animationType="fade" transparent onRequestClose={closeSubModal}>
        <View style={styles.subModalBackground}>
          <View style={styles.subModalContainer}>
            {(() => {
              switch (subModalType) {
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#bf930d',
    paddingTop: 60,
    paddingHorizontal: 20,
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
  card: {
    backgroundColor: '#f3ca4c',
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
    borderColor: '#ccc',
  },
  subModalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  subModalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  subModalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sidebarContainer: {
  flex: 1,
  flexDirection: 'row',
  backgroundColor: 'rgba(0,0,0,0.3)',
},
sidebar: {
  width: '75%',
  backgroundColor: 'white',
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
},

});