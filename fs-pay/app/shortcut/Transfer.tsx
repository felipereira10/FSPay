import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions,
} from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;
const cardSize = (screenWidth - 60) / 2; // 2 cards por linha com margem lateral

export default function Transfer() {
  const [activeTab, setActiveTab] = useState<'pix' | 'conv' | 'boleto' | 'history'>('pix');

  const renderCard = (icon: React.ReactNode, label: string, onPress?: () => void) => (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon}
      <Text style={styles.cardText}>{label}</Text>
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'pix':
        return (
          <View style={styles.cardGrid}>
            {renderCard(<MaterialIcons name="content-copy" size={28} color="#014141" />, 'Pix Copia e Cola')}
            {renderCard(<Ionicons name="qr-code-outline" size={28} color="#014141" />, 'Ler QR Code')}
            {renderCard(<MaterialIcons name="vpn-key" size={28} color="#014141" />, 'Chave Pix')}
            {renderCard(<MaterialIcons name="schedule" size={28} color="#014141" />, 'Agendar Pix')}
            {renderCard(<MaterialCommunityIcons name="qrcode-plus" size={28} color="#014141" />, 'Cobrar com Pix')}
            {renderCard(<MaterialIcons name="download" size={28} color="#014141" />, 'Depositar com Pix')}
          </View>
        );
      case 'conv':
        return (
          <View style={styles.cardGrid}>
            {renderCard(<MaterialIcons name="account-balance" size={28} color="#014141" />, 'Transf. Bancária')}
            {renderCard(<MaterialIcons name="schedule-send" size={28} color="#014141" />, 'Agendar Transf.')}
          </View>
        );
      case 'boleto':
        return (
          <View style={styles.cardGrid}>
            {renderCard(<MaterialCommunityIcons name="barcode-scan" size={28} color="#014141" />, 'Ler Código')}
            {renderCard(<FontAwesome5 name="money-check-alt" size={24} color="#014141" />, 'Digitar Código')}
          </View>
        );
      case 'history':
        return (
          <View style={styles.cardGrid}>
            {renderCard(<Ionicons name="document-text-outline" size={28} color="#014141" />, 'Histórico de Transfs.')}
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transferir</Text>

      <View style={styles.tabs}>
        <Tab label="Pix" isActive={activeTab === 'pix'} onPress={() => setActiveTab('pix')} />
        <Tab label="Convencional" isActive={activeTab === 'conv'} onPress={() => setActiveTab('conv')} />
        <Tab label="Boleto" isActive={activeTab === 'boleto'} onPress={() => setActiveTab('boleto')} />
        <Tab label="Histórico" isActive={activeTab === 'history'} onPress={() => setActiveTab('history')} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {renderContent()}
      </ScrollView>
    </View>
  );
}

function Tab({ label, isActive, onPress }: { label: string; isActive: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.tab, isActive && styles.activeTab]}
    >
      <Text style={[styles.tabText, isActive && { color: '#fff' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00ced1',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 4,
  },
  tab: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#014141',
  },
  tabText: {
    color: '#014141',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  card: {
    width: cardSize,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  cardText: {
    marginTop: 12,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#014141',
  },
});
