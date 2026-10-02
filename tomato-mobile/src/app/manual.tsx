import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { PrimaryButton } from '../components/PrimaryButton';
import { MedicineInput } from '../components/MedicineInput';
import { useScanContext } from '../context/ScanContext';
import { TomatoTheme } from '../constants/theme';

export default function ManualScreen() {
  const router = useRouter();
  const { setMedicineInfo } = useScanContext();

  const [medicineName, setMedicineName] = useState('Paracetamol');
  const [dosage, setDosage] = useState('500 mg');
  const [errors, setErrors] = useState<{ medicine?: string; dosage?: string }>({});

  const handleContinue = () => {
    const newErrors: { medicine?: string; dosage?: string } = {};
    if (!medicineName.trim()) {
      newErrors.medicine = 'Medicine name is required';
    }
    if (!dosage.trim()) {
      newErrors.dosage = 'Dosage is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setMedicineInfo(medicineName, dosage);
    router.push('/confirm');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.description}>
        Enter the target medicine name and dosage strength for optical screening.
      </Text>

      <View style={styles.formCard}>
        <MedicineInput
          label="Medicine Name"
          placeholder="Paracetamol"
          value={medicineName}
          onChangeText={(text) => {
            setMedicineName(text);
            if (errors.medicine) setErrors((prev) => ({ ...prev, medicine: undefined }));
          }}
          error={errors.medicine}
        />

        <MedicineInput
          label="Dosage"
          placeholder="500 mg"
          value={dosage}
          onChangeText={(text) => {
            setDosage(text);
            if (errors.dosage) setErrors((prev) => ({ ...prev, dosage: undefined }));
          }}
          error={errors.dosage}
        />
      </View>

      <PrimaryButton
        title="Continue"
        onPress={handleContinue}
        style={styles.continueBtn}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: TomatoTheme.spacing.lg,
    backgroundColor: TomatoTheme.colors.background,
  },
  description: {
    fontSize: 15,
    color: TomatoTheme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: TomatoTheme.spacing.lg,
  },
  formCard: {
    backgroundColor: TomatoTheme.colors.cardBackground,
    borderRadius: TomatoTheme.borderRadius.xl,
    padding: TomatoTheme.spacing.lg,
    borderWidth: 1,
    borderColor: TomatoTheme.colors.border,
    marginBottom: TomatoTheme.spacing.xl,
    ...TomatoTheme.shadows.soft,
  },
  continueBtn: {
    marginTop: TomatoTheme.spacing.xs,
  },
});
