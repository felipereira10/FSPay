import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Loading from '@/components/Loading';

export default function Home() {
  const [showBalance, setShowBalance] = useState(true);
  const balance = 20530.75;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

    const navigateToRoute = (
      route: '/shortcut/Transfer' | '/shortcut/Invest' | '/shortcut/Cards' | '/shortcut/Loans'
    ) => {
      router.push(route);
    };

    const initialCards: {
      id: string;
      name: string;
      icon: string;
      route: '/shortcut/Transfer' | '/shortcut/Invest' | '/shortcut/Cards' | '/shortcut/Loans';
    }[] = [
      { id: '1', name: 'Transferir', icon: 'add-circle-outline', route: '/shortcut/Transfer' },
      { id: '2', name: 'Investimentos', icon: 'trending-up', route: '/shortcut/Invest' },
      { id: '3', name: 'Cartões', icon: 'card-outline', route: '/shortcut/Cards' },
      { id: '4', name: 'Empréstimos', icon: 'cash-outline', route: '/shortcut/Loans' },
    ];



  const toggleBalance = () => setShowBalance(!showBalance);

  return isLoading ? <Loading /> : (
    <View style={styles.container}>
      {/* Topo */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="person-circle-outline" size={32} color="#fff" />
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
            {showBalance ? `$ ${balance.toFixed(2)}` : '••••••••'}
          </Text>
          <TouchableOpacity onPress={toggleBalance} style={{ marginLeft: 10 }}>
            <Ionicons name={showBalance ? 'eye-off' : 'eye'} size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Acessos rápidos */}
      <ScrollView contentContainerStyle={styles.cardContainer}>
        {initialCards.map((card) => (
          <TouchableOpacity key={card.id} style={styles.card} onPress={() => navigateToRoute(card.route)}>
            <Ionicons name={card.icon as any} size={24} color="#014141" />
            <Text style={styles.cardText}>{card.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#014141',
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
  balanceContainer: {
    marginTop: 40,
  },
  balanceLabel: {
    color: '#d4edda',
    fontSize: 16,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  balanceValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardContainer: {
    marginTop: 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 20,
  },
  card: {
    backgroundColor: '#d4edda',
    borderRadius: 12,
    width: '47%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  cardText: {
    marginTop: 10,
    fontWeight: 'bold',
    color: '#014141',
    textAlign: 'center',
  },
});