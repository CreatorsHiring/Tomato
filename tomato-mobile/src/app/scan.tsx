import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { DummyTomato } from '../components/DummyTomato';
import { ScanProgress } from '../components/ScanProgress';
import { WavelengthBar } from '../components/WavelengthBar';
import { useScanContext } from '../context/ScanContext';
import { analyzeScan } from '../services/api';
import { WavelengthMeasurements } from '../types';
import { TomatoTheme } from '../constants/theme';

const WAVELENGTHS = ['405', '450', '530', '660', '850', '940'];

export default function ScanScreen() {
  const router = useRouter();
  const { scanState, setScanResult } = useScanContext();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  const measurements: WavelengthMeasurements = scanState.sensorMeasurements || {
    '405': 0.33443,
    '450': 0.45163,
    '530': 0.59159,
    '660': 0.64213,
    '850': 0.49823,
    '940': 0.43046,
  };

  useEffect(() => {
    let isMounted = true;

    if (currentStepIndex < WAVELENGTHS.length) {
      // Step through each wavelength every 800ms
      const timer = setTimeout(() => {
        if (isMounted) {
          const finishedWl = WAVELENGTHS[currentStepIndex];
          setCompletedSteps((prev) => [...prev, finishedWl]);
          setCurrentStepIndex((prev) => prev + 1);
        }
      }, 800);

      return () => {
        isMounted = false;
        clearTimeout(timer);
      };
    } else if (currentStepIndex === WAVELENGTHS.length && !analyzing) {
      // All 6 wavelengths complete -> trigger classification analysis
      setAnalyzing(true);

      const performClassification = async () => {
        try {
          const classification = await analyzeScan({
            medicine: scanState.medicineName,
            measurements: measurements,
          });
          if (isMounted) {
            setScanResult(classification);
          }
        } catch (e) {
          console.error('Classification error during scan:', e);
        } finally {
          if (isMounted) {
            router.replace('/result');
          }
        }
      };

      performClassification();
    }

    return () => {
      isMounted = false;
    };
  }, [currentStepIndex, analyzing]);

  const activeWavelength = currentStepIndex < WAVELENGTHS.length ? WAVELENGTHS[currentStepIndex] : null;

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Animated Hardware Dummy */}
      <DummyTomato isScanning={true} activeWavelength={activeWavelength} />

      {/* Progress Bar */}
      <ScanProgress
        currentStep={Math.min(currentStepIndex + 1, 6)}
        totalSteps={6}
        statusText={analyzing ? 'Analyzing sample with SVM model...' : 'Building optical fingerprint...'}
      />

      {/* Sequential Wavelength Measurements Display */}
      <View style={styles.barsCard}>
        <Text style={styles.sectionHeader}>Optical Wavelength Signals</Text>
        {WAVELENGTHS.map((wl) => {
          const isDone = completedSteps.includes(wl);
          const isActive = activeWavelength === wl;
          const val = (measurements as any)[wl] || 0;

          return (
            <WavelengthBar
              key={wl}
              wavelength={wl}
              value={val}
              isActive={isActive}
              isComplete={isDone}
            />
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: TomatoTheme.spacing.lg,
    backgroundColor: TomatoTheme.colors.background,
  },
  barsCard: {
    backgroundColor: TomatoTheme.colors.cardBackground,
    borderRadius: TomatoTheme.borderRadius.xl,
    padding: TomatoTheme.spacing.lg,
    borderWidth: 1,
    borderColor: TomatoTheme.colors.border,
    marginTop: TomatoTheme.spacing.sm,
    ...TomatoTheme.shadows.soft,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: TomatoTheme.colors.textPrimary,
    marginBottom: TomatoTheme.spacing.sm,
  },
});
