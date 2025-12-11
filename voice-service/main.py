from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import base64
import httpx

VOICE_TTS_VOICE = os.getenv("VOICE_TTS_VOICE", "nova")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

app = FastAPI(title="SOYL Voice Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class HistoryItem(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    audio: str | None = None  # base64 audio (webm/mp3)
    text: str | None = None
    conversationHistory: list[HistoryItem] = []


class ChatResponse(BaseModel):
    text: str
    audio: str  # data:audio/mpeg;base64,...
    transcription: str


async def openai_chat(messages: list[dict]) -> str:
    if not OPENAI_API_KEY:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not configured")
    url = "https://api.openai.com/v1/chat/completions"
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}"}
    payload = {
        "model": "gpt-4o-mini",
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 300,
    }
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post(url, json=payload, headers=headers)
        r.raise_for_status()
        data = r.json()
        return data["choices"][0]["message"]["content"]


async def openai_tts(text: str) -> str:
    if not OPENAI_API_KEY:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not configured")
    url = "https://api.openai.com/v1/audio/speech"
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}"}
    payload = {"model": "tts-1", "voice": VOICE_TTS_VOICE, "input": text}
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post(url, json=payload, headers=headers)
        r.raise_for_status()
        audio_bytes = r.content
        b64 = base64.b64encode(audio_bytes).decode()
        return f"data:audio/mpeg;base64,{b64}"


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    if not req.audio and not req.text:
        raise HTTPException(status_code=400, detail="audio or text required")

    transcription = req.text or ""

    # TODO: add local Whisper; for now assume text input or handle externally
    if not transcription:
        # If audio is provided but no transcription pipeline, reject for now.
        raise HTTPException(status_code=400, detail="transcription not implemented in Python service")

    messages = [{"role": "system", "content": "You are SOYL's AI assistant."}]
    for m in req.conversationHistory[-10:]:
        messages.append({"role": m.role, "content": m.content})
    messages.append({"role": "user", "content": transcription})

    ai_text = await openai_chat(messages)
    audio = await openai_tts(ai_text)

    return ChatResponse(text=ai_text, audio=audio, transcription=transcription)

