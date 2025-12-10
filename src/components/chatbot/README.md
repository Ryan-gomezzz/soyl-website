# SOYL Voice Assistant

A production-ready, AI-powered voice assistant component for the SOYL marketing website. The assistant uses OpenAI's Whisper API for speech-to-text, GPT-4 for conversational AI, and TTS API for text-to-speech responses.

## Features

- **Voice Interaction**: Push-to-talk voice recording with real-time transcription
- **AI-Powered**: Uses GPT-4 with comprehensive product knowledge system prompt
- **Text-to-Speech**: Natural voice responses using OpenAI TTS API
- **Non-blocking Panel**: Slide-in right panel that doesn't block page interactions by default
- **Pin & Minimize**: Pin panel to keep it open across navigation, minimize to launcher bubble
- **Modal Assist Mode**: Optional focus trap mode for accessibility
- **Session Persistence**: Conversation history saved in sessionStorage
- **Rate Limited**: API endpoint protected with rate limiting (10 requests/minute)
- **Input Validation**: Audio size limits, conversation history limits, input sanitization
- **Accessible**: Keyboard navigation (spacebar to record), screen reader support, ARIA labels
- **Responsive**: Full-screen overlay on mobile, slide-in panel on desktop

## Architecture

### Components

- **VoiceBotPanel**: Main voice interaction panel with chat interface
- **ChatbotLauncher**: Floating microphone button to open the assistant
- **ChatbotProvider**: Context provider managing conversation state, recording, and playback
- **Hooks**:
  - `useVoiceRecording`: Handles microphone access and audio recording
  - `useAudioPlayback`: Manages TTS audio playback
  - `useConversation`: Manages conversation history and API calls

### API Endpoint

The voice chat API (`/api/voice/chat`) handles:
1. **Speech-to-Text**: Transcribes audio using OpenAI Whisper API
2. **AI Response**: Generates response using GPT-4 with product knowledge
3. **Text-to-Speech**: Converts response to audio using OpenAI TTS API

### Security Features

- **Rate Limiting**: 10 requests per minute per IP address
- **Input Validation**: 
  - Audio size limit: 10MB
  - Conversation history limit: Last 10 messages
  - Base64 format validation
  - Text sanitization
- **Error Handling**: Generic error messages for clients, detailed logs on server
- **Session Management**: Conversation history stored client-side only

## Usage

### Basic Integration

The voice assistant is automatically included in the main layout:

```typescript
// src/app/layout.tsx
import { Chatbot } from '@/components/chatbot'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Chatbot />
      </body>
    </html>
  )
}
```

### Programmatic Control

Use `ChatbotController` to programmatically control the assistant:

```typescript
import { ChatbotController } from '@/components/chatbot/controller'

// Open the panel
ChatbotController.open()

// Close the panel
ChatbotController.close()

// Toggle panel
ChatbotController.toggle()
```

### Event-Based Integration

Listen for custom events:

```typescript
window.addEventListener('soyl-chatbot-open', () => {
  // Panel opened
})

window.addEventListener('soyl-chatbot-close', () => {
  // Panel closed
})
```

## Configuration

### Environment Variables

Required:
```bash
OPENAI_API_KEY=sk-...  # OpenAI API key
```

Optional (for admin):
```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
```

### Product Knowledge

The system prompt is defined in `src/lib/prompts/productKnowledge.ts`. Update this file to modify the assistant's knowledge about SOYL products, features, and pricing.

## Accessibility

- **Keyboard Shortcuts**: 
  - Spacebar: Start/stop recording (when panel is open)
  - ESC: Close panel (or minimize if pinned)
- **Screen Reader Support**: ARIA labels, semantic HTML
- **Focus Management**: Optional focus trap in modal mode
- **Reduced Motion**: Respects `prefers-reduced-motion` media query

## Privacy & Security

- **No PII Collection**: Conversation history stored client-side only
- **Session Storage**: Conversations cleared when browser session ends
- **Rate Limiting**: Prevents abuse and API cost attacks
- **Input Sanitization**: All user input is sanitized before processing
- **Error Messages**: Generic error messages don't expose system internals

## File Structure

```
src/components/chatbot/
├── index.tsx                    # Main chatbot component
├── ChatbotLauncher.tsx          # Floating microphone button
├── VoiceBotPanel.tsx            # Voice interaction panel
├── ChatbotProvider.tsx          # Context provider
├── ChatbotStyles.css            # Custom styles
├── controller.ts                # Programmatic API
├── hooks/
│   ├── useVoiceRecording.ts     # Audio recording hook
│   ├── useAudioPlayback.ts      # Audio playback hook
│   ├── useConversation.ts       # Conversation management
│   ├── useChatbotState.ts       # Panel state management
│   └── useSessionId.ts          # Session ID generation
└── README.md                    # This file
```

## API Endpoints

### POST `/api/voice/chat`

Processes voice input and returns AI response with audio.

**Request:**
```json
{
  "audio": "base64-encoded-audio",
  "conversationHistory": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

**Response:**
```json
{
  "text": "AI response text",
  "audio": "base64-encoded-audio",
  "transcription": "User's transcribed speech"
}
```

**Rate Limits:**
- 10 requests per minute per IP
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Customization

### Styling

Styles are in `ChatbotStyles.css`. The component uses Tailwind CSS primarily, with custom CSS for:
- Launcher button positioning and animations
- Panel overlay behavior
- Recording indicators

### Panel Dimensions

- **Desktop**: 420px wide, fixed right position
- **Mobile**: Full-width overlay

### Audio Settings

Audio recording uses:
- Echo cancellation
- Noise suppression
- Auto gain control

## Testing

Test the voice assistant:
1. Click the microphone button
2. Press and hold to record
3. Speak your question
4. Release to send
5. Listen to the AI response

## Troubleshooting

### Microphone Permission Denied
- Check browser permissions
- Ensure HTTPS (required for microphone access)
- Try a different browser

### Rate Limit Exceeded
- Wait 1 minute between requests
- Check rate limit headers in response

### Audio Playback Issues
- Check browser audio permissions
- Ensure audio codec support
- Try refreshing the page

## Support

For questions or issues:
- Email: `hello@soyl.ai`
- See main README for contribution guidelines
