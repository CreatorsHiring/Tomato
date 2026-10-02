import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react-native';
import { ResultType, WavelengthMeasurements } from '../types';
import { TomatoTheme } from '../constants/theme';
import { WavelengthBar } from './WavelengthBar';

interface ResultCardProps {
  result: ResultType;
  medicineName: string;
  dosage: string;
  confidence: number;
  measurements?: WavelengthMeasurements | null;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  result,
  medicineName,
  dosage,
  confidence,
  measurements,
}) => {
  const getResultConfig = () => {
    switch (result) {
      case 'reference_consistent':
        return {
          title: 'REFERENCE-CONSISTENT',
          badgeText: 'Reference-Consistent',
          color: TomatoTheme.colors.success,
          bgColor: TomatoTheme.colors.successLight,
          icon: <CheckCircle2 size={48} color={TomatoTheme.colors.success} />,
          message: 'Optical fingerprint is consistent with the reference class.',
        };
      case 'substandard':
        return {
          title: 'POSSIBLE SUBSTANDARD',
          badgeText: 'Possible Substandard',
          color: TomatoTheme.colors.warning,
          bgColor: TomatoTheme.colors.warningLight,
          icon: <AlertTriangle size={48} color={TomatoTheme.colors.warning} />,
          message: 'The measured optical fingerprint differs from the reference class. Consider laboratory verification.',
        };
      case 'different':
        return {
          title: 'DIFFERENT FROM EXPECTED',
          badgeText: 'Different From Expected',
          color: TomatoTheme.colors.danger,
          bgColor: TomatoTheme.colors.dangerLight,
          icon: <XCircle size={48} color={TomatoTheme.colors.danger} />,
          message: 'The measured optical fingerprint does not match the expected classification.',
        };
    }
  };

  const config = getResultConfig();

  return (
    <View style={styles.container}>
      {/* Banner / Header */}
      <View style={[styles.headerBanner, { backgroundColor: config.bgColor }]}>
        {config.icon}
        <Text style={[styles.resultTitle, { color: config.color }]}>{config.title}</Text>
        <Text style={styles.medicineText}>{medicineName} {dosage}</Text>
      </View>

      {/* Confidence Row */}
      <View style={styles.confidenceCard}>
        <Text style={styles.confidenceLabel}>Model Confidence</Text>
        <Text style={[styles.confidenceValue, { color: config.color }]}>
          {Math.round(confidence * 100)}%
        </Text>
      </View>

      {/* Message */}
      <View style={styles.messageBox}>
        <Text style={styles.messageText}>{config.message}</Text>
      </View>

      {/* Fingerprint Spectral Visualization */}
      {measurements && (
        <View style={styles.fingerprintCard}>
          <Text style={styles.fingerprintTitle}>Optical Fingerprint</Text>
          <Text style={styles.fingerprintSubtitle}>6 Wavelength Measurements</Text>
          <View style={styles.barsContainer}>
            {Object.entries(measurements).map(([wl, val]) => (
              <WavelengthBar key={wl} wavelength={wl} value={val} isComplete={true} />
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  headerBanner: {
    borderRadius: TomatoTheme.borderRadius.xl,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 12,
    textAlign: 'center',
  },
  medicineText: {
    fontSize: 16,
    fontWeight: '600',
    color: TomatoTheme.colors.textSecondary,
    marginTop: 4,
  },
  confidenceCard: {
    backgroundColor: TomatoTheme.colors.cardBackground,
    borderRadius: TomatoTheme.borderRadius.lg,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: TomatoTheme.colors.border,
    ...TomatoTheme.shadows.soft,
  },
  confidenceLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: TomatoTheme.colors.textSecondary,
  },
  confidenceValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  messageBox: {
    backgroundColor: TomatoTheme.colors.cardBackground,
    borderRadius: TomatoTheme.borderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: TomatoTheme.colors.border,
  },
  messageText: {
    fontSize: 14,
    color: TomatoTheme.colors.textPrimary,
    lineHeight: 20,
    textAlign: 'center',
  },
  fingerprintCard: {
    backgroundColor: TomatoTheme.colors.cardBackground,
    borderRadius: TomatoTheme.borderRadius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: TomatoTheme.colors.border,
    ...TomatoTheme.shadows.soft,
  },
  fingerprintTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TomatoTheme.colors.textPrimary,
  },
  fingerprintSubtitle: {
    fontSize: 12,
    color: TomatoTheme.colors.textSecondary,
    marginBottom: 12,
  },
  barsContainer: {
    marginTop: 8,
  },
});
