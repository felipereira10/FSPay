import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PrivacySettings() {
  return (
    <View>
      <Text style={styles.title}>Privacidade dos Dados</Text>
      <Text style={styles.text}>
        ...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
  },
});

