import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { TomatoTheme } from '../constants/theme';

interface DummyTomatoProps {
  isScanning?: boolean;
  activeWavelength?: string | null;
}

const wavelengthColors: Record<string, string> = {
  '405': '#8B5CF6', // Violet
  '450': '#3B82F6', // Blue
  '530': '#10B981', // Green
  '660': '#EF4444', // Red
  '850': '#B91C1C', // Deep Red / IR
  '940': '#991B1B', // Dark IR
};

export const DummyTomato: React.FC<DummyTomatoProps> = ({
  isScanning = false,
  activeWavelength = null,
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let rotateLoop: Animated.CompositeAnimation;
    let pulseLoop: Animated.CompositeAnimation;

    if (isScanning) {
      rotateLoop = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      rotateLoop.start();

      pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      pulseLoop.start();
    } else {
      rotateAnim.setValue(0);
      pulseAnim.setValue(1);
    }

    return () => {
      rotateLoop?.stop();
      pulseLoop?.stop();
    };
  }, [isScanning]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const currentColor = activeWavelength ? wavelengthColors[activeWavelength] || TomatoTheme.colors.primary : TomatoTheme.colors.primary;

  return (
    <View style={styles.container}>
      {/* Glow outer ring when active */}
      <Animated.View
        style={[
          styles.glowRing,
          {
            backgroundColor: currentColor,
            transform: [{ scale: pulseAnim }],
            opacity: isScanning ? 0.25 : 0.08,
          },
        ]}
      />

      {/* Outer Device Sphere */}
      <View style={styles.deviceSphere}>
        {/* Top Stem/Cap */}
        <View style={styles.cap} />

        {/* Liquid Chamber */}
        <View style={styles.chamber}>
          {/* Animated Liquid Whirl */}
          <Animated.View
            style={[
              styles.liquidWhirl,
              {
                borderColor: currentColor,
                transform: [{ rotate: spin }],
              },
            ]}
          >
            <View style={[styles.stirrerBlade, { backgroundColor: currentColor }]} />
          </Animated.View>

          {/* Dissolving Tablet representation */}
          <View style={styles.tablet}>
            <View style={styles.tabletInner} />
          </View>
        </View>

        {/* Optical Sensor LED indicators around chamber */}
        <View style={styles.sensorRow}>
          {['405', '450', '530', '660', '850', '940'].map((wl) => {
            const isActive = activeWavelength === wl;
            const ledColor = wavelengthColors[wl];
            return (
              <View
                key={wl}
                style={[
                  styles.ledDot,
                  { backgroundColor: isActive ? ledColor : '#CBD5E1' },
                  isActive && { shadowColor: ledColor, shadowRadius: 8, shadowOpacity: 0.9, elevation: 4 },
                ]}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    height: 220,
  },
  glowRing: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
  },
  deviceSphere: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    ...TomatoTheme.shadows.medium,
    position: 'relative',
  },
  cap: {
    position: 'absolute',
    top: -12,
    width: 32,
    height: 14,
    borderRadius: 7,
    backgroundColor: TomatoTheme.colors.primary,
  },
  chamber: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#F1F5F9',
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  liquidWhirl: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stirrerBlade: {
    width: 24,
    height: 4,
    borderRadius: 2,
    opacity: 0.8,
  },
  tablet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabletInner: {
    width: 16,
    height: 2,
    backgroundColor: '#94A3B8',
    borderRadius: 1,
  },
  sensorRow: {
    position: 'absolute',
    bottom: 12,
    flexDirection: 'row',
    gap: 6,
  },
  ledDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
