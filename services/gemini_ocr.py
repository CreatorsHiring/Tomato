import os
import json
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

def get_gemini_client():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is missing. Please set it in your .env file.")
    return genai.Client(api_key=api_key)

class OcrAnalysisResult(BaseModel):
    medicine_name: str = Field(description="Active pharmaceutical ingredient name, e.g., Paracetamol, Ibuprofen, Amoxicillin")
    dosage: str = Field(description="Dosage strength with unit, e.g., 500 mg, 400 mg")
    confidence: float = Field(description="Confidence score between 0.0 and 1.0")
    detected: bool = Field(description="True if medicine details were clearly identified from the image")
    raw_text: Optional[str] = Field(default="", description="Any additional text detected on medicine packaging")

PROMPT = """
You are an expert pharmaceutical computer vision model. Analyze the provided image of a medicine strip, box, or tablet packaging.

Your task:
1. Identify the active pharmaceutical ingredient (API) / drug name (e.g. "Paracetamol", "Ibuprofen", "Aspirin", "Metformin"). Ignore brand/trade names.
2. Identify the dosage strength (e.g. "500 mg", "400 mg", "1000 mg", "10 mg").
3. Estimate your confidence score between 0.0 and 1.0.

Return ONLY a strict JSON object matching the requested schema.
If no clear medicine text is visible in the image, set detected to false, medicine_name to "Unknown", dosage to "Unknown", and confidence to 0.0.
"""

def analyze_medicine_image(image_bytes: bytes, mime_type: str = "image/jpeg") -> Dict[str, Any]:
    """
    Analyzes a medicine image using Gemini Vision API (gemini-2.5-flash) to extract drug API name and dosage.
    Propagates exceptions cleanly without mock fallbacks.
    """
    client = get_gemini_client()

    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=[
            types.Part.from_bytes(
                data=image_bytes,
                mime_type=mime_type,
            ),
            PROMPT
        ],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=OcrAnalysisResult,
            temperature=0.1,
        ),
    )

    parsed_result = json.loads(response.text)
    return parsed_result
