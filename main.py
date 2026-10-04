from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Optional
import json
import base64
import traceback

from predict import predict_paracetamol
from services.gemini_ocr import analyze_medicine_image

app = FastAPI(
    title="TOMATO — Tiny Lab Technician Backend",
    description="FastAPI service for medicine OCR/Vision via Gemini API and multispectral SVM classification.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class OcrJsonRequest(BaseModel):
    image_base64: str
    mime_type: Optional[str] = "image/jpeg"


class ScanRequest(BaseModel):
    medicine: str = Field(default="paracetamol_500mg")
    measurements: Dict[str, float]


@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "TOMATO Backend API",
        "endpoints": ["/api/ocr", "/api/scan"]
    }


@app.post("/api/ocr")
async def process_ocr(
    request: Request,
    file: Optional[UploadFile] = File(None)
):
    """
    Accepts either:
    1. JSON body: { "image_base64": "<base64_string>", "mime_type": "image/jpeg" }
    2. Multipart form-data with a "file" field (e.g. from Swagger UI)
    
    Uses Gemini Vision API to extract active pharmaceutical ingredient and dosage.
    """
    image_bytes = None
    mime_type = "image/jpeg"
    content_type = request.headers.get("content-type", "")

    try:
        if file is not None and "multipart/form-data" in content_type:
            image_bytes = await file.read()
            if file.content_type and file.content_type.startswith("image/"):
                mime_type = file.content_type
            print(f"[OCR] Received file upload: {len(image_bytes)} bytes, mime={mime_type}")
        elif "application/json" in content_type or not content_type:
            body = await request.json()
            b64_str = body.get("image_base64", "")
            mime_type = body.get("mime_type", "image/jpeg") or "image/jpeg"

            if not b64_str:
                raise HTTPException(status_code=400, detail="Missing 'image_base64' in JSON payload.")

            if "," in b64_str:
                b64_str = b64_str.split(",", 1)[1]

            image_bytes = base64.b64decode(b64_str)
            print(f"[OCR] Received Base64 JSON payload: {len(image_bytes)} bytes, mime={mime_type}")
        else:
            # Fallback parse body as JSON or Form
            try:
                form = await request.form()
                uploaded_file = form.get("file")
                if uploaded_file and hasattr(uploaded_file, "read"):
                    image_bytes = await uploaded_file.read()
                    if hasattr(uploaded_file, "content_type") and uploaded_file.content_type:
                        mime_type = uploaded_file.content_type
            except Exception:
                pass

            if not image_bytes:
                body = await request.json()
                b64_str = body.get("image_base64", "")
                mime_type = body.get("mime_type", "image/jpeg") or "image/jpeg"
                if "," in b64_str:
                    b64_str = b64_str.split(",", 1)[1]
                image_bytes = base64.b64decode(b64_str)

        if not image_bytes or len(image_bytes) < 10:
            raise HTTPException(status_code=400, detail="Provided image data is empty or invalid.")

        ocr_result = analyze_medicine_image(image_bytes, mime_type=mime_type)
        print(f"[OCR] Success: {ocr_result}")

        return {
            "success": True,
            "data": ocr_result
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"[OCR ERROR] {type(e).__name__}: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Gemini OCR error: {str(e)}")


@app.post("/api/scan")
def process_scan(request: ScanRequest):
    """
    Accepts 6 multispectral wavelength measurements and runs SVM inference.
    Returns: reference_consistent | substandard | different
    """
    measurements = request.measurements
    required_keys = ["405", "450", "530", "660", "850", "940"]

    for k in required_keys:
        if k not in measurements:
            raise HTTPException(status_code=400, detail=f"Missing wavelength key '{k}'.")

    try:
        wavelength_list = [float(measurements[k]) for k in required_keys]
        ml_response = predict_paracetamol(wavelength_list)

        result_mapping = {
            "original": "reference_consistent",
            "substandard": "substandard",
            "different": "different"
        }
        raw = ml_response["prediction"]
        mapped = result_mapping.get(raw, raw)

        return {
            "medicine": request.medicine,
            "raw_prediction": raw,
            "result": mapped,
            "confidence": ml_response["confidence"],
            "probabilities": {
                "reference_consistent": ml_response["probabilities"].get("original", 0.0),
                "substandard": ml_response["probabilities"].get("substandard", 0.0),
                "different": ml_response["probabilities"].get("different", 0.0),
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Classification error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
