import { WavelengthMeasurements, ClassificationResponse } from '../types';
import { classifySample } from './classifier';

export interface ScanApiRequest {
  medicine: string;
  measurements: WavelengthMeasurements;
}

/**
 * Placeholder API service for future FastAPI backend migration.
 * Currently delegates to local classifier mock.
 * 
 * FUTURE INTEGRATION:
 * export async function analyzeScan(data: ScanApiRequest): Promise<ClassificationResponse> {
 *   const response = await fetch('http://<API_URL>/api/scan', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(data),
 *   });
 *   return await response.json();
 * }
 */
export async function analyzeScan(data: ScanApiRequest): Promise<ClassificationResponse> {
  return classifySample(data.measurements, data.medicine);
}
