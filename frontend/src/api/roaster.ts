import axios from 'axios'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export interface RoastResponse {
    roast: string
}

export const roastResume = async (file: File): Promise<RoastResponse> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await axios.post(`${API_URL}/api/roaster/roast`, formData)
    return response.data
}
