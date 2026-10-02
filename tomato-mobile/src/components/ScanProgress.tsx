import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TomatoTheme } from '../constants/theme';

interface ScanProgressProps {
  currentStep: number;
  totalSteps?: number;
  statusText?: string;
}

export const ScanProgress: React.FC<ScanProgressProps> = ({
  currentStep,
  totalSteps = 6,
  statusText = 'Building optical fingerprint...',
}) => {
  const percentage = Math.min((currentStep / totalSteps) * 100, 100);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.statusText}>{statusText}</Text>
        <Text style={styles.stepCounter}>
          {currentStep} / {totalSteps}
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percentage}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: TomatoTheme.colors.textSecondary,
  },
  stepCounter: {
    fontSize: 14,
    fontWeight: '700',
    color: TomatoTheme.colors.primary,
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: TomatoTheme.colors.primary,
    borderRadius: 4,
  },
});
