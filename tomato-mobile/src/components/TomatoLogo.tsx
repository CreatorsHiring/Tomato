import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TomatoTheme } from '../constants/theme';

interface TomatoLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const TomatoLogo: React.FC<TomatoLogoProps> = ({ size = 'md', showSubtitle = false }) => {
  const iconSize = size === 'sm' ? 24 : size === 'md' ? 36 : 48;
  const fontSize = size === 'sm' ? 18 : size === 'md' ? 24 : 32;

  return (
    <View style={styles.container}>
      <View style={styles.logoRow}>
        <View style={[styles.iconContainer, { width: iconSize, height: iconSize, borderRadius: iconSize / 2 }]}>
          <View style={styles.tomatoShape}>
            <View style={styles.leaf} />
          </View>
        </View>
        <Text style={[styles.wordmark, { fontSize }]}>
          TOMATO<Text style={styles.dot}>.</Text>
        </Text>
      </View>
      {showSubtitle && (
        <Text style={styles.subtitle}>Tiny Lab Technician</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconContainer: {
    backgroundColor: TomatoTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: TomatoTheme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  tomatoShape: {
    width: '60%',
    height: '60%',
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leaf: {
    position: 'absolute',
    top: -2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  wordmark: {
    fontWeight: '800',
    color: TomatoTheme.colors.textPrimary,
    letterSpacing: 1.5,
  },
  dot: {
    color: TomatoTheme.colors.primary,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: TomatoTheme.colors.textSecondary,
    letterSpacing: 0.5,
    marginTop: 2,
  },
});
