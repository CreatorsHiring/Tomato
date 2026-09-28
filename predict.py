import os
import pandas as pd
import numpy as np
import joblib

MODEL_PATH = os.path.join("models", "paracetamol_500mg.pkl")

FEATURE_COLUMNS = [
    "wavelength_405nm",
    "wavelength_450nm",
    "wavelength_530nm",
    "wavelength_660nm",
    "wavelength_850nm",
    "wavelength_940nm"
]

def load_model(model_path=MODEL_PATH):
    """Load the trained model pipeline from disk."""
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at '{model_path}'. Please run 'python train.py' first.")
    return joblib.load(model_path)

def predict_paracetamol(wavelengths, model_path=MODEL_PATH):
    """
    Predict sample authenticity for Paracetamol 500mg using 6 spectral wavelength measurements.

    Parameters:
        wavelengths: list or dict
            If list: [405nm, 450nm, 530nm, 660nm, 850nm, 940nm]
            If dict: mapping containing either 'wavelength_405nm' or '405nm' keys.
        model_path: str
            Path to the saved scikit-learn Pipeline pickle.

    Returns:
        dict:
        {
            "medicine": "paracetamol_500mg",
            "prediction": "original",
            "confidence": 0.94,
            "probabilities": {
                "original": 0.94,
                "substandard": 0.04,
                "different": 0.02
            }
        }
    """
    pipeline = load_model(model_path)

    # Standardize input format into a pandas DataFrame matching feature names
    if isinstance(wavelengths, (list, tuple, np.ndarray)):
        if len(wavelengths) != 6:
            raise ValueError(f"Expected 6 wavelength measurements, but received {len(wavelengths)}.")
        features_dict = dict(zip(FEATURE_COLUMNS, wavelengths))
    elif isinstance(wavelengths, dict):
        # Normalize dictionary keys
        features_dict = {}
        for col in FEATURE_COLUMNS:
            short_col = col.replace("wavelength_", "")
            if col in wavelengths:
                features_dict[col] = wavelengths[col]
            elif short_col in wavelengths:
                features_dict[col] = wavelengths[short_col]
            else:
                raise KeyError(f"Missing required wavelength key '{col}' or '{short_col}' in input dictionary.")
    else:
        raise TypeError("Input 'wavelengths' must be a list of 6 values or a dictionary.")

    df_input = pd.DataFrame([features_dict], columns=FEATURE_COLUMNS)

    # Inference
    probabilities = pipeline.predict_proba(df_input)[0]
    classes = pipeline.classes_

    # Map class -> probability
    prob_dict = {cls: float(round(prob, 4)) for cls, prob in zip(classes, probabilities)}
    
    # Sort or find max confidence
    top_class = max(prob_dict, key=prob_dict.get)
    top_confidence = prob_dict[top_class]

    result = {
        "medicine": "paracetamol_500mg",
        "prediction": top_class,
        "confidence": top_confidence,
        "probabilities": prob_dict
    }

    return result

def print_prediction_results(input_wavelengths, result):
    """Format and print prediction outputs matching CLI specifications."""
    print("=" * 60)
    print(" PARACETAMOL 500mg MULTISPECTRAL AUTHENTICATION SYSTEM")
    print("=" * 60)
    print("\nInput Wavelength Measurements:")
    
    if isinstance(input_wavelengths, (list, tuple, np.ndarray)):
        wavelength_names = ["405nm", "450nm", "530nm", "660nm", "850nm", "940nm"]
        for name, val in zip(wavelength_names, input_wavelengths):
            print(f"  {name} = {val:.5f}")
    elif isinstance(input_wavelengths, dict):
        for k, v in input_wavelengths.items():
            print(f"  {k} = {v:.5f}")

    print("-" * 60)
    print(f"Predicted Class:  {result['prediction']}")
    print(f"Model Confidence: {result['confidence'] * 100:.2f}%")
    print("-" * 60)
    print("Class Probabilities:")
    for cls, prob in result['probabilities'].items():
        print(f"  {cls}: {prob * 100:.2f}%")
    print("=" * 60)

if __name__ == "__main__":
    # Sample 1: Input values provided in user prompt
    sample_input = [
        0.33443,  # 405nm
        0.45163,  # 450nm
        0.59159,  # 530nm
        0.64213,  # 660nm
        0.49823,  # 850nm
        0.43046   # 940nm
    ]

    res = predict_paracetamol(sample_input)
    print_prediction_results(sample_input, res)

    # Sample 2: Example row from original test dataset (Sample ID: original_0904)
    original_sample_input = {
        "wavelength_405nm": 0.29675,
        "wavelength_450nm": 0.41590,
        "wavelength_530nm": 0.59846,
        "wavelength_660nm": 0.71818,
        "wavelength_850nm": 0.46364,
        "wavelength_940nm": 0.43313
    }
    print("\n--- Additional Test Demonstration: Original Sample Row ---")
    res_orig = predict_paracetamol(original_sample_input)
    print_prediction_results(original_sample_input, res_orig)

