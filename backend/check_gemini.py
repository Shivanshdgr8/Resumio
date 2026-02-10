import os
from dotenv import load_dotenv

load_dotenv()

try:
    import google.generativeai as genai
    print("google-generativeai is installed.")
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY not found in .env")
        exit(1)
        
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content("Hello, can you hear me?")
    print("API Response:", response.text)
    
except ImportError:
    print("google-generativeai is NOT installed.")
except Exception as e:
    print(f"Error: {e}")
