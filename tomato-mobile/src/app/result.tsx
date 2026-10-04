import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ResultCard } from '../components/ResultCard';
import { Disclaimer } from '../components/Disclaimer';
import { PrimaryButton } from '../components/PrimaryButton';
import { useScanContext } from '../context/ScanContext';
import { TomatoTheme } from '../constants/theme';

export default function ResultScreen() {
  const router = useRouter();
  const { scanState, resetScan } = useScanContext();

  const resultData = scanState.scanResult || {
    medicine: scanState.medicineName || 'Paracetamol',
    result: 'reference_consistent' as const,
    confidence: 0.94,
    probabilities: {
      reference_consistent: 0.94,
      substandard: 0.04,
      different: 0.02,
    },
  };

  const handleDone = () => {
    resetScan();
    router.replace('/');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Result Visual Card with SVM Model Output */}
      <ResultCard
        result={resultData.result}
        medicineName={scanState.medicineName}
        dosage={scanState.dosage}
        confidence={resultData.confidence}
        probabilities={resultData.probabilities}
        measurements={scanState.sensorMeasurements}
      />

      {/* Required Prototype Disclaimer */}
      <Disclaimer />

      {/* Done Action */}
      <PrimaryButton
        title="Done"
        onPress={handleDone}
        style={styles.doneBtn}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: TomatoTheme.spacing.lg,
    backgroundColor: TomatoTheme.colors.background,
    gap: TomatoTheme.spacing.md,
  },
  doneBtn: {
    marginTop: TomatoTheme.spacing.md,
    marginBottom: TomatoTheme.spacing.lg,
  },
});
