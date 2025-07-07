import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

export default function FloatingDollar() {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      }),
    ).start();
  }, [rotateAnim]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.dollar,
        {
          transform: [{ rotate: rotateInterpolate }],
          top: 30,
          left: Dimensions.get('window').width / 2 - 15,
          position: 'absolute',
          zIndex: 1000,
        },
      ]}
    >
      <Text style={styles.dollarText}>$</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  dollar: {
    width: 30,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dollarText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#f3ca4c',
  },
});
