import os
import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix
)

# -----------------------------------------------------------------------------
# Configuration & Constants
# -----------------------------------------------------------------------------
DATASET_PATH = os.path.join("data", "paracetamol_500mg_synthetic_multispectral_dataset.csv")
MODEL_DIR = "models"
MODEL_SAVE_PATH = os.path.join(MODEL_DIR, "paracetamol_500mg.pkl")

FEATURE_COLUMNS = [
    "wavelength_405nm",
    "wavelength_450nm",
    "wavelength_530nm",
    "wavelength_660nm",
    "wavelength_850nm",
    "wavelength_940nm"
]
TARGET_COLUMN = "label"
EXPECTED_LABELS = ["original", "substandard", "different"]
RANDOM_STATE = 42

def load_and_inspect_data(file_path):
    """Load the dataset and check for missing values, duplicates, and invalid values."""
    print("=" * 70)
    print("1. DATASET LOADING & INSPECTION")
    print("=" * 70)
    
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Dataset file not found at: {file_path}")
        
    df = pd.read_csv(file_path)
    print(f"Dataset Path: {file_path}")
    print(f"Total Rows: {len(df)}")
    print(f"Total Columns: {len(df.columns)}")
    print(f"Columns: {list(df.columns)}\n")

    # Missing values check
    missing_counts = df.isnull().sum()
    print("--- Missing Values ---")
    print(missing_counts[missing_counts > 0] if missing_counts.sum() > 0 else "No missing values found.")
    
    # Duplicates check
    duplicate_rows = df.duplicated().sum()
    print(f"\n--- Duplicate Rows ---")
    print(f"Number of duplicate rows: {duplicate_rows}")
    
    # Class distribution check
    print("\n--- Class Imbalance / Distribution ---")
    class_counts = df[TARGET_COLUMN].value_counts()
    class_props = df[TARGET_COLUMN].value_counts(normalize=True) * 100
    for cls in class_counts.index:
        print(f"  {cls}: {class_counts[cls]} samples ({class_props[cls]:.2f}%)")

    # Feature value inspection
    print("\n--- Feature Summary Statistics ---")
    print(df[FEATURE_COLUMNS].describe().T[["min", "mean", "std", "max"]])

    return df

def prepare_data(df):
    """Extract features and target, and split into train and test sets (80/20 stratified)."""
    print("\n" + "=" * 70)
    print("2. FEATURE SELECTION & TRAIN/TEST SPLIT")
    print("=" * 70)
    
    X = df[FEATURE_COLUMNS]
    y = df[TARGET_COLUMN]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        stratify=y,
        random_state=RANDOM_STATE
    )

    print(f"Features Used ({len(FEATURE_COLUMNS)}): {FEATURE_COLUMNS}")
    print(f"Target Column: {TARGET_COLUMN}")
    print(f"Training Set Size: {X_train.shape[0]} samples (80%)")
    print(f"Test Set Size:     {X_test.shape[0]} samples (20%)")
    
    print("\nTraining Class Distribution:")
    for cls, cnt in y_train.value_counts().items():
        print(f"  {cls}: {cnt}")

    print("\nTesting Class Distribution:")
    for cls, cnt in y_test.value_counts().items():
        print(f"  {cls}: {cnt}")

    return X_train, X_test, y_train, y_test

def build_pipeline():
    """Create a Pipeline containing StandardScaler and SVC with RBF kernel and probability enabled."""
    pipeline = Pipeline([
        ("scaler", StandardScaler()),
        ("svm", SVC(
            kernel="rbf",
            probability=True,
            random_state=RANDOM_STATE
        ))
    ])
    return pipeline

def perform_cross_validation(pipeline, X_train, y_train):
    """Perform 5-fold stratified cross-validation on the training set."""
    print("\n" + "=" * 70)
    print("3. STRATIFIED CROSS-VALIDATION (5-Fold)")
    print("=" * 70)

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_STATE)
    cv_scores = cross_val_score(pipeline, X_train, y_train, cv=cv, scoring="accuracy")

    print(f"5-Fold CV Accuracy Scores: {[round(score, 4) for score in cv_scores]}")
    print(f"CV Accuracy Mean:  {cv_scores.mean() * 100:.2f}%")
    print(f"CV Accuracy Std:   {cv_scores.std() * 100:.2f}%")

    return cv_scores

def train_and_evaluate(pipeline, X_train, X_test, y_train, y_test):
    """Train the model on the full training set and evaluate on test data."""
    print("\n" + "=" * 70)
    print("4. MODEL TRAINING & TEST SET EVALUATION")
    print("=" * 70)

    # Train
    pipeline.fit(X_train, y_train)
    print("Pipeline training completed successfully.")

    # Predict
    y_pred = pipeline.predict(X_test)
    y_proba = pipeline.predict_proba(X_test)

    # Metrics
    acc = accuracy_score(y_test, y_pred)
    prec_macro = precision_score(y_test, y_pred, average="macro")
    rec_macro = recall_score(y_test, y_pred, average="macro")
    f1_macro = f1_score(y_test, y_pred, average="macro")

    print("\n--- Test Set Performance Metrics ---")
    print(f"Accuracy:        {acc * 100:.2f}%")
    print(f"Precision (macro): {prec_macro * 100:.2f}%")
    print(f"Recall (macro):    {rec_macro * 100:.2f}%")
    print(f"F1-score (macro):  {f1_macro * 100:.2f}%")

    print("\n--- Classification Report ---")
    clf_report = classification_report(y_test, y_pred, digits=4)
    print(clf_report)

    print("--- Confusion Matrix ---")
    labels_order = pipeline.classes_
    cm = confusion_matrix(y_test, y_pred, labels=labels_order)
    cm_df = pd.DataFrame(cm, index=[f"Actual: {l}" for l in labels_order], columns=[f"Pred: {l}" for l in labels_order])
    print(cm_df)

    return pipeline, y_pred, y_proba

def save_pipeline(pipeline, save_path):
    """Save the full trained pipeline using joblib."""
    print("\n" + "=" * 70)
    print("5. SAVING MODEL PIPELINE")
    print("=" * 70)

    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    joblib.dump(pipeline, save_path)
    print(f"Successfully saved trained Pipeline (StandardScaler + SVC) to:\n -> {save_path}")

def main():
    # 1. Load and inspect
    df = load_and_inspect_data(DATASET_PATH)

    # 2. Split data
    X_train, X_test, y_train, y_test = prepare_data(df)

    # 3. Build pipeline
    pipeline = build_pipeline()

    # 4. Cross validation
    perform_cross_validation(pipeline, X_train, y_train)

    # 5. Train and evaluate
    trained_pipeline, _, _ = train_and_evaluate(pipeline, X_train, X_test, y_train, y_test)

    # 6. Save model
    save_pipeline(trained_pipeline, MODEL_SAVE_PATH)
    print("\nTraining pipeline executed successfully.")

if __name__ == "__main__":
    main()
