import { WavelengthMeasurements, ClassificationResponse, ResultType } from '../types';

/**
 * Demo local classifier function.
 * Evaluates simulated 6-wavelength spectrum against reference signatures.
 */
export async function classifySample(
  measurements: WavelengthMeasurements,
  medicineName: string = 'Paracetamol'
): Promise<ClassificationResponse> {
  // Simulate minor network/processing delay (800ms)
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Extract wavelength values
  const v405 = measurements['405'];
  const v450 = measurements['450'];
  const v530 = measurements['530'];
  const v660 = measurements['660'];
  const v850 = measurements['850'];
  const v940 = measurements['940'];

  // Calculate simple spectral shape signature (sum and peak ratio)
  const totalAbsorbance = v405 + v450 + v530 + v660 + v850 + v940;
  const ratio660To405 = v660 / (v405 || 1);

  let result: ResultType = 'reference_consistent';
  let confidence = 0.94;
  let probabilities = {
    reference_consistent: 0.94,
    substandard: 0.04,
    different: 0.02,
  };

  // Rule-based classification mock simulation
  if (totalAbsorbance < 1.5) {
    result = 'different';
    confidence = 0.91;
    probabilities = {
      reference_consistent: 0.03,
      substandard: 0.06,
      different: 0.91,
    };
  } else if (ratio660To405 < 1.4 || totalAbsorbance < 2.5) {
    result = 'substandard';
    confidence = 0.87;
    probabilities = {
      reference_consistent: 0.08,
      substandard: 0.87,
      different: 0.05,
    };
  } else {
    result = 'reference_consistent';
    confidence = 0.94;
    probabilities = {
      reference_consistent: 0.94,
      substandard: 0.04,
      different: 0.02,
    };
  }

  return {
    medicine: medicineName,
    result,
    confidence,
    probabilities,
  };
}
