"""Resume Roaster router."""
import os
import logging
import re
import json
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
import google.generativeai as genai
from app.config import settings
from app.utils_parse import parse_resume_file

router = APIRouter()
logger = logging.getLogger(__name__)

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

class RoastResponse(BaseModel):
    roast: str

@router.post("/roast", response_model=RoastResponse)
async def roast_resume(
    file: UploadFile = File(...)
):
    """
    Roast a resume using Google Gemini.
    """
    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="AI service is not configured (missing API key)"
        )

    # 1. Parse File
    try:
        file_content = await file.read()
        file_ext = file.filename.split(".")[-1].lower() if file.filename else ""
        resume_text = await parse_resume_file(file_content, file_ext)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse resume: {str(e)}")

    if not resume_text or len(resume_text) < 50:
        raise HTTPException(status_code=400, detail="Resume content is too short or empty.")

    # 2. Generate Roast
    try:
        model = genai.GenerativeModel('gemini-flash-latest')
        
        prompt = f"""
        You are a professional comedian and strict career coach. Your task is to "roast" the following resume.
        
        RESUME CONTENT:
        {resume_text[:15000]}
        
        INSTRUCTIONS:
        1. Be brutally honest but constructively helpful.
        2. Use humor, sarcasm, and wit. Make it funny!
        3. Structure the response with these sections (use Markdown):
           - 🔥 **First Impression**: A quick, biting opening.
           - 💼 **Experience Roast**: Poke fun at vague descriptions or weak verbs.
           - 🎯 **Skills Reality Check**: Call out buzzwords or generic skills.
           - 🌟 **Achievement Check**: Are they bragging about nothing?
           - 💡 **The Real Talk** (Constructive Feedback): 3-5 actual, serious tips to improve.
           - 🎪 **The Verdict**: A final summary rating or closing thought.
           
        4. Do NOT be mean-spirited or offensive (no racism, sexism, etc.). Keep it professional-roast style.
        """
        
        response = await model.generate_content_async(prompt)
        return RoastResponse(roast=response.text)
        
    except Exception as e:
        logger.error(f"Roaster API Error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to roast resume: {str(e)}"
        )
