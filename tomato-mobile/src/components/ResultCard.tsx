import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2, AlertTriangle, XCircle, Cpu } from 'lucide-react-native';
import { ResultType, WavelengthMeasurements, ClassProbabilities } from '../types';
import { TomatoTheme } from '../constants/theme';
import { WavelengthBar } from './WavelengthBar';

interface ResultCardProps {
  result: ResultType;
  medicineName: string;
  dosage: string;
  confidence: number;
  probabilities?: ClassProbabilities | null;
  measurements?: WavelengthMeasurements | null;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  result,
  medicineName,
  dosage,
  confidence,
  probabilities,
  measurements,
}) => {
  const getResultConfig = () => {
    switch (result) {
      case 'reference_consistent':
        return {
          categoryLabel: 'ORIGINAL TABLET',
          title: 'REFERENCE-CONSISTENT',
          badgeText: 'Original Tablet',
          color: TomatoTheme.colors.success,
          bgColor: TomatoTheme.colors.successLight,
          icon: <CheckCircle2 size={48} color={TomatoTheme.colors.success} />,
          message: 'The uploaded sensor readings match the reference specs for an authentic tablet formulation.',
        };
      case 'substandard':
        return {
          categoryLabel: 'SUBSTANDARD TABLET',
          title: 'POSSIBLE SUBSTANDARD',
          badgeText: 'Substandard Tablet',
          color: TomatoTheme.colors.warning,
          bgColor: TomatoTheme.colors.warningLight,
          icon: <AlertTriangle size={48} color={TomatoTheme.colors.warning} />,
          message: 'The measured optical fingerprint differs from the reference specs. The tablet may be substandard or degraded.',
        };
      case 'different':
        return {
          categoryLabel: 'DIFFERENT TABLET',
          title: 'DIFFERENT FROM EXPECTED',
          badgeText: 'Different Tablet',
          color: TomatoTheme.colors.danger,
          bgColor: TomatoTheme.colors.dangerLight,
          icon: <XCircle size={48} color={TomatoTheme.colors.danger} />,
          message: 'The measured optical fingerprint does not match the expected classification. The sample is a different tablet compound.',
        };
    }
  };

  const config = getResultConfig();

  return (
    <View style={styles.container}>
      {/* Banner / Header */}
      <View style={[styles.headerBanner, { backgroundColor: config.bgColor }]}>
        {config.icon}
        <View style={[styles.categoryTag, { backgroundColor: config.color }]}>
          <Text style={styles.categoryTagText}>{config.categoryLabel}</Text>
        </View>
        <Text style={[styles.resultTitle, { color: config.color }]}>{config.title}</Text>
        <Text style={styles.medicineText}>{medicineName} {dosage}</Text>
      </View>

      {/* Confidence Row */}
      <View style={styles.confidenceCard}>
        <View style={styles.confidenceLeft}>
          <Cpu size={22} color={TomatoTheme.colors.primary} />
          <Text style={styles.confidenceLabel}>SVM Model Confidence</Text>
        </View>
        <Text style={[styles.confidenceValue, { color: config.color }]}>
          {Math.round(confidence * 100)}%
        </Text>
      </View>

      {/* Message */}
      <View style={styles.messageBox}>
        <Text style={styles.messageText}>{config.message}</Text>
      </View>

      {/* Class Probabilities Breakdown */}
      {probabilities && (
        <View style={styles.probCard}>
          <Text style={styles.probTitle}>SVM Classification Probabilities</Text>
          <View style={styles.probRow}>
            <View style={styles.probItem}>
              <Text style={styles.probLabel}>Original</Text>
              <Text style={[styles.probVal, result === 'reference_consistent' && { color: TomatoTheme.colors.success }]}>
                {Math.round((probabilities.reference_consistent || 0) * 100)}%
              </Text>
            </View>
            <View style={styles.probDivider} />
            <View style={styles.probItem}>
              <Text style={styles.probLabel}>Substandard</Text>
              <Text style={[styles.probVal, result === 'substandard' && { color: TomatoTheme.colors.warning }]}>
                {Math.round((probabilities.substandard || 0) * 100)}%
              </Text>
            </View>
            <View style={styles.probDivider} />
            <View style={styles.probItem}>
              <Text style={styles.probLabel}>Different</Text>
              <Text style={[styles.probVal, result === 'different' && { color: TomatoTheme.colors.danger }]}>
                {Math.round((probabilities.different || 0) * 100)}%
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Fingerprint Spectral Visualization */}
      {measurements && (
        <View style={styles.fingerprintCard}>
          <Text style={styles.fingerprintTitle}>Optical Fingerprint</Text>
          <Text style={styles.fingerprintSubtitle}>6 Wavelength Measurements from uploaded JSON</Text>
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
  categoryTag: {
    marginTop: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: TomatoTheme.borderRadius.full,
  },
  categoryTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 8,
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
  confidenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  probCard: {
    backgroundColor: TomatoTheme.colors.cardBackground,
    borderRadius: TomatoTheme.borderRadius.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: TomatoTheme.colors.border,
    ...TomatoTheme.shadows.soft,
  },
  probTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: TomatoTheme.colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  probRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  probItem: {
    alignItems: 'center',
    flex: 1,
  },
  probLabel: {
    fontSize: 12,
    color: TomatoTheme.colors.textSecondary,
    fontWeight: '600',
    marginBottom: 2,
  },
  probVal: {
    fontSize: 18,
    fontWeight: '800',
    color: TomatoTheme.colors.textPrimary,
  },
  probDivider: {
    width: 1,
    height: 24,
    backgroundColor: TomatoTheme.colors.border,
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
