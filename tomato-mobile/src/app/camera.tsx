import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera as CameraIcon, RefreshCw } from 'lucide-react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { MedicineInput } from '../components/MedicineInput';
import { useScanContext } from '../context/ScanContext';
import { TomatoTheme } from '../constants/theme';

export default function CameraScreen() {
  const router = useRouter();
  const { setMedicineInfo } = useScanContext();

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [medicineName, setMedicineName] = useState('Paracetamol');
  const [dosage, setDosage] = useState('500 mg');
  const [errors, setErrors] = useState<{ medicine?: string; dosage?: string }>({});

  const handleCapture = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Camera permission is required to capture photos!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setCapturedImage(result.assets[0].uri);
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

    setMedicineInfo(medicineName, dosage, capturedImage);
    router.push('/confirm');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {!capturedImage ? (
        <View style={styles.viewfinderContainer}>
          <Text style={styles.instructionText}>
            Position the medicine name and dosage inside the frame.
          </Text>

          {/* Viewfinder Mock Frame */}
          <View style={styles.cameraPreview}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              <CameraIcon size={40} color={TomatoTheme.colors.primary} opacity={0.6} />
              <Text style={styles.frameHint}>Position Strip Here</Text>
            </View>
          </View>

          <PrimaryButton
            title="Capture Photo"
            onPress={handleCapture}
            icon={<CameraIcon size={20} color="#FFFFFF" />}
            style={styles.captureBtn}
          />
        </View>
      ) : (
        <View style={styles.reviewContainer}>
          <Text style={styles.instructionText}>Captured Strip Photo:</Text>

          <View style={styles.previewBox}>
            <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
            <TouchableOpacity style={styles.retakeBadge} onPress={handleCapture}>
              <RefreshCw size={16} color="#FFFFFF" />
              <Text style={styles.retakeText}>Retake</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Confirm Medicine Details</Text>

            <MedicineInput
              label="Medicine"
              value={medicineName}
              onChangeText={(text) => {
                setMedicineName(text);
                if (errors.medicine) setErrors((prev) => ({ ...prev, medicine: undefined }));
              }}
              error={errors.medicine}
            />

            <MedicineInput
              label="Dosage"
              value={dosage}
              onChangeText={(text) => {
                setDosage(text);
                if (errors.dosage) setErrors((prev) => ({ ...prev, dosage: undefined }));
              }}
              error={errors.dosage}
            />
          </View>

          <PrimaryButton title="Continue" onPress={handleContinue} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: TomatoTheme.spacing.lg,
    backgroundColor: TomatoTheme.colors.background,
  },
  instructionText: {
    fontSize: 15,
    color: TomatoTheme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: TomatoTheme.spacing.lg,
    textAlign: 'center',
  },
  viewfinderContainer: {
    alignItems: 'center',
  },
  cameraPreview: {
    width: '100%',
    height: 280,
    borderRadius: TomatoTheme.borderRadius.xl,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: TomatoTheme.spacing.xl,
    overflow: 'hidden',
  },
  scanFrame: {
    width: '80%',
    height: '70%',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: TomatoTheme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  frameHint: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 8,
    fontWeight: '500',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: TomatoTheme.colors.primary,
  },
  topLeft: { top: -2, left: -2, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 8 },
  topRight: { top: -2, right: -2, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 8 },
  bottomLeft: { bottom: -2, left: -2, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 8 },
  bottomRight: { bottom: -2, right: -2, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 8 },
  captureBtn: {
    width: '100%',
  },
  reviewContainer: {
    width: '100%',
  },
  previewBox: {
    position: 'relative',
    marginBottom: TomatoTheme.spacing.lg,
  },
  capturedImage: {
    width: '100%',
    height: 220,
    borderRadius: TomatoTheme.borderRadius.xl,
  },
  retakeBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: TomatoTheme.borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  retakeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
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
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TomatoTheme.colors.textPrimary,
    marginBottom: TomatoTheme.spacing.md,
  },
});
