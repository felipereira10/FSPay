import { router } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function Invest() {

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Investimentos</Text>

      <TouchableOpacity style={styles.card} onPress={() => router.push('./invest/LittleBox')}>
        <Text style={styles.cardTitle}>Caixinhas de Investimento</Text>
        <Text style={styles.cardDesc}>Crie objetivos e invista neles</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => router.push('./invest/StockMarket')}>
        <Text style={styles.cardTitle}>Bolsa de Valores</Text>
        <Text style={styles.cardDesc}>Invista em ações e ETFs</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.card} onPress={() => router.push('./invest/RealEstateFunds')}>
        <Text style={styles.cardTitle}>Fundos Imobiliários (FIIs)</Text>
        <Text style={styles.cardDesc}>Invista em renda passiva</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => router.push('./invest/FixedIncome')}>
        <Text style={styles.cardTitle}>Renda Fixa</Text>
        <Text style={styles.cardDesc}>CDBs, LCIs, LCAs</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#014141',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#014141',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  cardDesc: {
    color: '#cfcfcf',
    fontSize: 14,
    marginTop: 5,
  },
});