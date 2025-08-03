import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';

export default function LoadingScreen() {
  const animationRef = useRef(null);
  const [useFingerLoading, setUseFingerLoading] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carregando...</Text>

      <LottieView
        ref={animationRef}
        source={
          useFingerLoading
            ? require('../../assets/loading-fingers.json')
            : require('../../assets/Loading.json')
        }
        autoPlay
        loop
        style={{ width: 200, height: 200 }}
      />

      <TouchableOpacity
        onPress={() => setUseFingerLoading(!useFingerLoading)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Trocar Animação</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    color: '#014141',
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#014141',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
