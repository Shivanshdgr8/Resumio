import axios from 'axios'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export interface GenerateCoverLetterRequest {
    resumeText: string
    jobDescription: string
    companyName: string
    jobRole: string
    tone?: string
}

export interface GenerateCoverLetterResponse {
    content: string
}

export const generateCoverLetter = async (
    data: GenerateCoverLetterRequest
): Promise<GenerateCoverLetterResponse> => {
    const response = await axios.post(`${API_URL}/api/cover-letter/generate`, data)
    return response.data
}
