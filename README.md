# Paracetamol 500 mg Multispectral Medicine Authenticator

A prototype machine learning system for non-destructive authentication and quality analysis of **Paracetamol 500 mg** tablets using **multispectral optical reflectance spectroscopy**.

---

## 📌 Project Overview

Counterfeit and substandard pharmaceuticals pose a critical global health threat. Multispectral optical measurements capture unique spectral signatures (reflectance/absorbance profile) of active pharmaceutical ingredients (APIs) and excipients across visible and near-infrared (NIR) spectrum bands.

This project trains a high-precision **Support Vector Machine (SVM)** classifier to evaluate multispectral optical readings and classify sample pills into three target categories:
- **`original`**: Authentic Paracetamol 500 mg tablet meeting standard formulation specs.
- **`substandard`**: Formulated with wrong API concentration or compromised binding agents.
- **`different`**: Completely different drug compound or counterfeit material.

---

## 📊 Dataset & Features

The model is trained on a synthetic dataset (`paracetamol_500mg_synthetic_multispectral_dataset.csv`) containing 3,000 samples (1,000 per class).

### Input Features (6 Optical Wavelengths)
1. **`wavelength_405nm`**: Violet/UV boundary region (surface coating & API absorption)
2. **`wavelength_450nm`**: Blue spectrum region
3. **`wavelength_530nm`**: Green spectrum region
4. **`wavelength_660nm`**: Red spectrum region
5. **`wavelength_850nm`**: Near-Infrared (NIR) band 1 (molecular vibrational overtones)
6. **`wavelength_940nm`**: Near-Infrared (NIR) band 2 (moisture & organic structure)

### Target Label
- **`label`**: Categorical label (`original`, `substandard`, `different`)

---

## 🎯 Model Framing & Design Decisions

### 1. Why Classification (Not Regression)?
The objective is to classify an unknown medicine sample into discrete authentication status categories (`original`, `substandard`, `different`), rather than estimating a continuous numerical quantity. Therefore, multi-class classification is the appropriate mathematical formulation.

### 2. Why SVM Classifier with RBF Kernel?
- **Effective in Spectral Feature Spaces**: Optical spectrum measurements exhibit complex, non-linear relationships across wavelength bands. The Radial Basis Function (RBF) kernel maps features into an infinite-dimensional space, enabling smooth separation of complex spectral clusters.
- **Sample Efficiency & Robustness**: SVM max-margin hyperplanes provide strong generalization performance on medium-sized sensor datasets without overfitting.
- **Feature Standardization**: `StandardScaler` ensures all 6 wavelength intensities contribute equally to distance calculations in the RBF kernel space.
- **Probability Estimation**: Enabling `probability=True` applies Platt scaling, allowing the model to produce confidence scores and probability distributions across all candidate classes.

---

## 📁 Project Structure

```
medicine-authenticator/
│
├── data/
│   └── paracetamol_500mg_synthetic_multispectral_dataset.csv
│
├── models/
│   └── paracetamol_500mg.pkl
│
├── train.py
├── predict.py
├── requirements.txt
└── README.md
```

---

## ⚙️ Installation

1. Clone or navigate to the project repository directory:
   ```bash
   cd medicine-authenticator
   ```

2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

---

## 🚀 Training the Model

Execute `train.py` to inspect the dataset, perform stratified train-test splitting (80/20), execute 5-fold cross-validation, evaluate on the test split, and save the full pipeline (`StandardScaler` + `SVC`):

```bash
python train.py
```

### Expected Output Summary:
- **Missing / Invalid Values**: 0 missing values, 0 duplicate rows
- **Class Balance**: 1,000 samples per class (Balanced 33.33% each)
- **5-Fold Cross-Validation Accuracy**: `98.37% ± 0.52%`
- **Test Set Accuracy**: `99.00%`
- **Saved Artifact**: `models/paracetamol_500mg.pkl`

---

## 🔮 Running Predictions

Execute `predict.py` to run sample predictions:

```bash
python predict.py
```

### Programmatic Usage

You can import the reusable function `predict_paracetamol` in Python:

```python
from predict import predict_paracetamol

# Input format Option 1: List of 6 float values in wavelength order [405nm, 450nm, 530nm, 660nm, 850nm, 940nm]
sample_list = [0.33443, 0.45163, 0.59159, 0.64213, 0.49823, 0.43046]

result = predict_paracetamol(sample_list)
print(result)
```

#### Input Format Options:
1. **List of 6 floats**: `[0.33443, 0.45163, 0.59159, 0.64213, 0.49823, 0.43046]`
2. **Dictionary**:
   ```python
   {
       "wavelength_405nm": 0.33443,
       "wavelength_450nm": 0.45163,
       "wavelength_530nm": 0.59159,
       "wavelength_660nm": 0.64213,
       "wavelength_850nm": 0.49823,
       "wavelength_940nm": 0.43046
   }
   ```

#### Output Format:
```json
{
    "medicine": "paracetamol_500mg",
    "prediction": "substandard",
    "confidence": 1.00,
    "probabilities": {
        "different": 0.00,
        "original": 0.00,
        "substandard": 1.00
    }
}
```

---

## 🏆 Performance Summary

| Metric | Score |
| :--- | :--- |
| **5-Fold CV Mean Accuracy** | 98.37% |
| **Test Set Accuracy** | 99.00% |
| **Precision (macro avg)** | 99.00% |
| **Recall (macro avg)** | 99.00% |
| **F1-Score (macro avg)** | 99.00% |
