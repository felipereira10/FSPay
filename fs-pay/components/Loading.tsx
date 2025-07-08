import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, ActivityIndicator } from 'react-native';

export default function Loading() {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/images/FSPayIdeaClean.png')}
        style={[styles.image, { transform: [{ translateY: floatAnim }] }]}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#f3ca4c" style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#bf930d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
  spinner: {
    marginTop: 20,
  },
});