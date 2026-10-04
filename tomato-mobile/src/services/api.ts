import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system/legacy';
import { WavelengthMeasurements, ClassificationResponse } from '../types';
import { classifySample } from './classifier';

/**
 * Configure API Base URL:
 * Automatically uses your local IP (e.g. 192.168.0.9) or dynamically detects Expo host IP.
 */
const getApiBaseUrl = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:8000';
  }

  // Attempt to extract host IP dynamically from Expo Constants (works automatically on physical devices & Expo Go)
  const debuggerHost = Constants.expoConfig?.hostUri || Constants.experienceUrl;
  if (debuggerHost) {
    const ip = debuggerHost.split(':')[0];
    if (ip) {
      return `http://${ip}:8000`;
    }
  }

  // Explicit Wi-Fi Network IP for physical mobile testing via Expo Go
  return 'http://192.168.0.9:8000';
};

const API_BASE_URL = getApiBaseUrl();

export interface ScanApiRequest {
  medicine: string;
  measurements: WavelengthMeasurements;
}

export interface OcrResponseData {
  medicine_name: string;
  dosage: string;
  confidence: number;
  detected: boolean;
  raw_text?: string;
}

/**
 * Sends uploaded medicine image as Base64 JSON to FastAPI /api/ocr endpoint.
 * Uses legacy Expo FileSystem module for readAsStringAsync compatibility.
 */
export async function analyzeMedicineImage(imageUri: string): Promise<OcrResponseData> {
  try {
    let base64Image = '';

    if (Platform.OS === 'web') {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve(result.includes(',') ? result.split(',')[1] : result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } else {
      base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    }

    const response = await fetch(`${API_BASE_URL}/api/ocr`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        image_base64: base64Image,
        mime_type: 'image/jpeg',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server returned ${response.status}: ${errorText}`);
    }

    const json = await response.json();
    if (!json.success || !json.data) {
      throw new Error(json.detail || 'Invalid response structure from OCR API');
    }

    return json.data;
  } catch (error) {
    console.error(`Failed to analyze medicine image via OCR at ${API_BASE_URL}:`, error);
    throw error;
  }
}

/**
 * Sends 6-wavelength sensor measurements to FastAPI /api/scan endpoint.
 * Evaluated by trained Scikit-Learn SVM model (models/paracetamol_500mg.pkl).
 */
export async function analyzeScan(data: ScanApiRequest): Promise<ClassificationResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        medicine: data.medicine,
        measurements: data.measurements,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      return {
        medicine: result.medicine,
        result: result.result,
        confidence: result.confidence,
        probabilities: result.probabilities,
      };
    }
  } catch (error) {
    console.warn(`Backend /api/scan error or unreachable at ${API_BASE_URL}:`, error);
  }

  // Fallback to local classifier if FastAPI server is unavailable
  return classifySample(data.measurements, data.medicine);
}
