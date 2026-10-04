import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Sparkles } from 'lucide-react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { MedicineInput } from '../components/MedicineInput';
import { UploadCard } from '../components/UploadCard';
import { useScanContext } from '../context/ScanContext';
import { analyzeMedicineImage } from '../services/api';
import { TomatoTheme } from '../constants/theme';

export default function UploadScreen() {
  const router = useRouter();
  const { setMedicineInfo } = useScanContext();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errors, setErrors] = useState<{ medicine?: string; dosage?: string }>({});

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setSelectedImage(uri);
      
      // Perform Gemini Vision / OCR Analysis
      setIsAnalyzing(true);
      try {
        const ocrData = await analyzeMedicineImage(uri);
        if (ocrData && ocrData.medicine_name) {
          setMedicineName(ocrData.medicine_name);
          setDosage(ocrData.dosage);
        }
      } catch (e) {
        console.warn('OCR error:', e);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleContinue = () => {
    if (!medicineName.trim() || !dosage.trim()) {
      setErrors({
        medicine: !medicineName.trim() ? 'Medicine name is required' : undefined,
        dosage: !dosage.trim() ? 'Dosage is required' : undefined,
      });
      return;
    }

    setMedicineInfo(medicineName, dosage, selectedImage);
    router.push('/confirm');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.description}>
        Upload a clear photo of the back of the medicine strip where the medicine name and dosage are visible.
      </Text>

      {selectedImage ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          <SecondaryButton
            title="Change Photo"
            onPress={pickImage}
            style={styles.changeBtn}
          />
        </View>
      ) : (
        <UploadCard
          title="Upload Image"
          subtitle="Select strip photo from library"
          onPress={pickImage}
          style={styles.uploadCard}
        />
      )}

      {/* Confirmation & manual review inputs */}
      <View style={styles.formCard}>
        <View style={styles.titleRow}>
          <Text style={styles.formTitle}>Confirm Medicine Information</Text>
          {isAnalyzing && (
            <View style={styles.aiBadge}>
              <Sparkles size={14} color={TomatoTheme.colors.primary} />
              <Text style={styles.aiText}>AI Analyzing...</Text>
            </View>
          )}
        </View>

        <MedicineInput
          label="Medicine (Active Ingredient)"
          placeholder="e.g. Paracetamol"
          value={medicineName}
          onChangeText={(text) => {
            setMedicineName(text);
            if (errors.medicine) setErrors((prev) => ({ ...prev, medicine: undefined }));
          }}
          error={errors.medicine}
        />

        <MedicineInput
          label="Dosage"
          placeholder="e.g. 500 mg"
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
        loading={isAnalyzing}
        disabled={!medicineName.trim() || !dosage.trim()}
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
  uploadCard: {
    marginBottom: TomatoTheme.spacing.lg,
  },
  imageContainer: {
    marginBottom: TomatoTheme.spacing.lg,
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 220,
    borderRadius: TomatoTheme.borderRadius.xl,
    backgroundColor: TomatoTheme.colors.border,
  },
  changeBtn: {
    marginTop: TomatoTheme.spacing.md,
    width: '100%',
  },
  formCard: {
    backgroundColor: TomatoTheme.colors.cardBackground,
    borderRadius: TomatoTheme.borderRadius.xl,
    padding: TomatoTheme.spacing.lg,
    borderWidth: 1,
    borderColor: TomatoTheme.colors.border,
    marginBottom: TomatoTheme.spacing.lg,
    ...TomatoTheme.shadows.soft,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: TomatoTheme.spacing.md,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TomatoTheme.colors.textPrimary,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: TomatoTheme.colors.primaryLight,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: TomatoTheme.borderRadius.sm,
  },
  aiText: {
    fontSize: 12,
    fontWeight: '600',
    color: TomatoTheme.colors.primary,
  },
  continueBtn: {
    marginTop: TomatoTheme.spacing.xs,
  },
});
