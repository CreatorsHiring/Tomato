export interface WavelengthMeasurements {
  '405': number;
  '450': number;
  '530': number;
  '660': number;
  '850': number;
  '940': number;
}

export interface SensorPayload {
  device_id: string;
  medicine: string;
  measurements: WavelengthMeasurements;
}

export type ResultType = 'reference_consistent' | 'substandard' | 'different';

export interface ClassProbabilities {
  reference_consistent: number;
  substandard: number;
  different: number;
}

export interface ClassificationResponse {
  medicine: string;
  result: ResultType;
  confidence: number;
  probabilities: ClassProbabilities;
}

export interface ScanState {
  medicineName: string;
  dosage: string;
  imageUri?: string | null;
  sensorMeasurements?: WavelengthMeasurements | null;
  scanResult?: ClassificationResponse | null;
  timestamp?: string;
}

export interface HistoryItem {
  id: string;
  medicineName: string;
  dosage: string;
  result: ResultType;
  confidence: number;
  timestamp: string;
  measurements: WavelengthMeasurements;
}
