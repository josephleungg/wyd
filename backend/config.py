from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    DATABASE_URL = os.getenv("DATABASE_URL")

    AI_API_KEY = os.getenv("ELEVENLABS_API_KEY")
    AI_AGENT_ID = os.getenv("ELEVENLABS_AGENT_ID")

    GEMINI_AI_KEY = os.getenv("GEMINI_API_KEY")

    SECRET_KEY = os.getenv("SECRET_KEY")
    ALGORITHM = os.getenv("ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))