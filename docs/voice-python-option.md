# Voice Service: Node vs Python FastAPI (Design Note)

## Current (Node/Next API Route)
- **Flow:** `/api/voice/chat` → validate input → Whisper transcription → GPT (gpt-4o-mini) → TTS (tts-1, mp3) → returns text + `data:audio/mpeg;base64,...`.
- **Pros:** Single deployment with Next, no cross-service auth, minimal latency hops, easy env mgmt.
- **Risks:** Route shares resources with web requests; cold starts can affect voice latency; limited concurrency controls vs dedicated worker.

## Python/FastAPI Option
- **Flow:** Next frontend posts audio to `voice-gateway` (FastAPI) → Whisper (local or cloud) → LLM (OpenAI or vLLM) → TTS (Azure/Edge/Piper) → returns `audio/mp3` + text.
- **Pros:** 
  - Python ecosystem for audio/ML (ffmpeg, pydub, faster-whisper, onnx/ggml).
  - Easier to run local/CPU/GPU Whisper variants; can batch or stream.
  - Can scale independently (HPA) and isolate spikes.
- **Cons:** Additional service + auth (JWT/shared secret), deploy + monitoring surface area, CORS to manage.

## Suggested Python Stack
- **App:** FastAPI + uvicorn, route `/chat` accepting `{ audio_base64?, text?, history[] }`.
- **Transcription:** `faster-whisper` with small/medium model on CPU/GPU; fallback to OpenAI Whisper if GPU unavailable.
- **LLM:** OpenAI (gpt-4o-mini) or self-hosted `vLLM` (mixtral/llama-3.1-8b-instruct) behind API key.
- **TTS:** 
  - Cloud: Azure Speech (neural voices) or OpenAI TTS (mp3) for quality.
  - Local: Piper or Coqui XTTS for self-hosting; return mp3/ogg.
- **Auth:** `Authorization: Bearer <shared-secret>`; rotate via env/Secrets Manager.
- **Observability:** Structured JSON logs, latency histograms (Prometheus + Grafana), request IDs propagated from Next.

## Deploy Considerations
- **Container:** Slim base with `ffmpeg`; build GPU variant if needed.
- **Scaling:** Autoscale on CPU/GPU usage; pre-warm pods to avoid TTS/Whisper cold starts.
- **Networking:** Expose internal service behind API Gateway/ALB; Next calls internal URL.
- **Fallbacks:** If Python service unreachable, Next can fall back to current Node route (feature flag).

## Frontend Integration Changes
- Move `/api/voice/chat` to proxy to Python URL when `process.env.VOICE_BACKEND=python`.
- Ensure responses include `audio/mime` and base64; reuse existing `useConversation` audio handling.


