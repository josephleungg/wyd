from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from crud import entries as entries_crud
from db import schema, conn
from config import Config
import requests
import json

router = APIRouter()

def get_conversation_id(API_KEY: str) -> str:
    url = f"https://api.elevenlabs.io/v1/convai/conversations"
    headers = {
        "xi-api-key": API_KEY
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)  # 10 second timeout
        
        if response.status_code == 200:
            conversations = response.json()
            if conversations and len(conversations) > 0:
                print(conversations["conversations"][0]["conversation_id"])
                return conversations["conversations"][0]["conversation_id"]
            else:
                raise Exception("No conversations found")
        else:
            raise Exception(f"Failed to get conversations. Status: {response.status_code}")
    except requests.exceptions.Timeout:
        raise Exception("Request to ElevenLabs API timed out")
    except requests.exceptions.RequestException as e:
        raise Exception(f"Error connecting to ElevenLabs API: {str(e)}")

def get_conversation_details(API_KEY: str, conversation_id: str) -> dict:
    url = f"https://api.elevenlabs.io/v1/convai/conversations/{conversation_id}"
    headers = {
        "xi-api-key": API_KEY
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)  # 10 second timeout

        if response.status_code == 200:
            transcript = response.json()

            transcript_filtered = []

            for item in transcript["transcript"]:
                message_obj = {
                    "role": item["role"],
                    "message": item["message"]
                }
                transcript_filtered.append(message_obj)

            return transcript_filtered
        else:
            raise Exception(f"Failed to retrieve conversation details. Status: {response.status_code}")
    except requests.exceptions.Timeout:
        raise Exception("Request to ElevenLabs API timed out")
    except requests.exceptions.RequestException as e:
        raise Exception(f"Error connecting to ElevenLabs API: {str(e)}")

def summarize_with_gemini(API_KEY: str, text: dict) -> str:
    from google import genai
    from google.genai import types

    client = genai.Client()

    prompt = f"""
You are a skilled journal writer. Given the following conversation data, do the following:

1. Write a short, natural-sounding journal entry in first person. Do not mention 'agent', 'user', or system details. Make it feel personal, conversational, and emotionally aware. Keep it concise but expressive. Give 4-5 sentences.

2. Analyze the sentiment: return 'positive', 'negative', or 'neutral'.

3. Classify the journal entry into one of these categories: 'work', 'personal', 'health', 'travel', 'education', 'goal','other'.

Return ONLY a valid JSON object with the following keys:
{{
    "entry": "...",
    "sentiment": "...",
    "category": "..."
}}

Do not send it as a Markdown code block. Ensure the JSON is properly formatted.

Conversation data: {text}
"""

    resp = client.models.generate_content(
        model="gemini-2.0-flash-lite",
        contents=(prompt,),
        config=types.GenerateContentConfig(
            thinking_config=types.ThinkingConfig(thinking_budget=0)
        ),
    )

    print("Gemini response:", resp.text)

    resp_text = resp.text.strip()

    if resp_text.startswith("```") and resp_text.endswith("```"):
        resp_text = "\n".join(resp_text.splitlines()[1:-1])

    result = json.loads(resp_text)

    journal_entry = result["entry"]
    sentiment = result["sentiment"]
    entry_type = result["category"]

    return journal_entry, sentiment, entry_type

@router.post("/upload")
async def upload_entry(entry_data: schema.entries.EntriesCreateRequest, db: Session = Depends(conn.get_db)):
    print("Received entry data:", entry_data)
    
    API_KEY = Config.AI_API_KEY
    GEMINI_AI_KEY = Config.GEMINI_AI_KEY

    try:
        conversation_id = get_conversation_id(API_KEY)
        conversation_details = get_conversation_details(API_KEY, conversation_id)
        summary, sentiment, entry_type = summarize_with_gemini(GEMINI_AI_KEY, conversation_details)

        return entries_crud.create_entry(db, conversation_id, summary, sentiment, entry_type, None, entry_data.imgur_url)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload entry: {str(e)}")

@router.get("/transcript/{id}", response_model=schema.entries.TranscriptResponse)
async def get_transcript(id: str, db: Session = Depends(conn.get_db)):
    API_KEY = Config.AI_API_KEY
    
    try:
        conversation_id = entries_crud.get_conversation_id_with_id(db, id)
        conversation_details = get_conversation_details(API_KEY, conversation_id)
        return {"transcript": conversation_details}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get transcript: {str(e)}")

@router.get("/", response_model=list[schema.entries.EntriesResponse])
async def get_entries(db: Session = Depends(conn.get_db)):
    return entries_crud.list_entries(db)

@router.get("/summary/{id}", response_model=dict)
async def get_summary(id: str, db: Session = Depends(conn.get_db)):
    summary = entries_crud.get_summary_with_id(db, id)
    if summary:
        return {"summary": summary}
    return {"message": "Summary not found"}