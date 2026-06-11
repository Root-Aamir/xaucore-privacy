import React, { useEffect } from 'react';
import { StyleSheet, View, Animated, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export default function AnimatedSplash({ onAnimationEnd }) {
  // Animation states initializing
  const rotateAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.3);
  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    // 🎥 RUN CINEMATIC TIMELINE SEQUENCE
    Animated.sequence([
      // 1. Logo smooth spin and scale up synchronously
      Animated.parallel([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 1800,
          useNativeDriver: true,
        }),
      ]),
      // 2. Chota sa overshoot scale down stable feel ke liye
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // 3. Poori screen ka fade out animation exit pipeline
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Animation khatam hote hi main app render unlock karo
      if (onAnimationEnd) onAnimationEnd();
    });
  }, []);

  // Map rotation value to degrees (360° spin node)
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Animated.View style={{ transform: [{ rotate: spin }, { scale: scaleAnim }] }}>
        
        {/* 🎨 AAPKA EMBEDDED DYNAMIC ICON (Vector Circle + V Triangle Path) */}
        <Svg width={140} height={140} viewBox="0 0 100 100">
          {/* Main Dark Circular Tracking Node */}
          <Path
            d="M 50,50 m -45,0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0"
            fill="#082930"
          />
          {/* Left Wing (Silver Line) */}
          <Path
            d="M 32 38 L 46 72 L 53 72 L 42 38 Z"
            fill="#a6a6a6"
          />
          {/* Right Wing (Rust Orange Arrow Triangle) */}
          <Path
            d="M 48 38 L 52 48 L 65 38 Z"
            fill="#a93d22"
          />
          {/* Center Connector Bridge Path */}
          <Path
            d="M 45 45 L 53 62 L 58 45 Z"
            fill="#082930"
          />
        </Svg>

      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, // Hamesha top view layer par rahega
  },
});