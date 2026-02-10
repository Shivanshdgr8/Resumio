"""Cover Letter generator router."""
import os
import logging
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from app.config import settings

router = APIRouter()
logger = logging.getLogger(__name__)

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
else:
    logger.warning("GEMINI_API_KEY not found in environment variables")

class CoverLetterRequest(BaseModel):
    resumeText: str
    jobDescription: str
    companyName: str
    jobRole: str
    tone: Optional[str] = "Professional"

class CoverLetterResponse(BaseModel):
    content: str

@router.post("/generate", response_model=CoverLetterResponse)
async def generate_cover_letter(request: CoverLetterRequest):
    """
    Generate a professional cover letter using Google Gemini.
    """
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="AI service is not configured (missing API key)"
        )

    try:
        model = genai.GenerativeModel('gemini-flash-latest')
        
        prompt = f"""
        Write a professional cover letter for the role of {request.jobRole} at {request.companyName}.
        
        Tone: {request.tone}
        
        Using the following Resume and Job Description:
        
        RESUME:
        {request.resumeText}
        
        JOB DESCRIPTION:
        {request.jobDescription}
        
        Requirements:
        1. Keep it concise (300-400 words).
        2. Highlight relevant skills from the resume that match the job description.
        3. Use standard business letter formatting.
        4. Do not include placeholders like "[Your Name]" if possible, inferred from resume, otherwise use generic placeholders.
        5. Return ONLY the body of the letter.
        """
        
        response = await model.generate_content_async(prompt)
        
        return CoverLetterResponse(content=response.text)
        
    except Exception as e:
        logger.error(f"Gemini API Error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate cover letter: {str(e)}"
        )
