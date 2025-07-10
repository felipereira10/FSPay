import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

export default function AccountInfo() {
  return (
    <View>
        <Feather name="help-circle" size={14} color="black" />
        <Text style={styles.title}>Central de ajuda</Text>
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


