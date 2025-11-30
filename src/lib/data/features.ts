import { Target, Brain, Bot, LucideIcon } from 'lucide-react'

export interface Feature {
  title: string
  description: string
  icon: LucideIcon
}

export const features: Feature[] = [
  {
    title: 'Adaptive AI Agents',
    description: 'AI agents that adapt to user emotions and context in real-time.',
    icon: Bot,
  },
  {
    title: 'Cognitive Signal Layer',
    description: 'Deep understanding of emotions through multimodal signal processing.',
    icon: Brain,
  },
  {
    title: 'Intelligent Automation',
    description: 'Streamline business processes with tailored automation solutions.',
    icon: Target,
  },
]

export const productFeatures = [
  {
    title: 'Emotion API',
    description: 'RESTful API for real-time emotion detection across modalities.',
    code: `// Example API call
const response = await fetch('https://api.soyl.ai/v1/emotion', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' },
  body: JSON.stringify({
    audio: audioData,
    video: videoData,
    text: userInput
  })
});
const { emotion, confidence } = await response.json();`,
  },
  {
    title: 'On-device Inference',
    description: 'Privacy-first emotion detection running locally on edge devices.',
    code: `import { EmotionDetector } from '@soyl/sdk';

const detector = new EmotionDetector();
const result = await detector.detect({
  audio: audioBuffer,
  video: videoFrame
});`,
  },
  {
    title: 'AR Commerce Integration',
    description: 'Seamless integration with AR shopping experiences and virtual try-ons.',
    code: `// AR integration example
import { ARAgent } from '@soyl/sdk-ar';

const agent = new ARAgent();
agent.onEmotionChange((emotion) => {
  updateProductRecommendation(emotion);
});`,
  },
  {
    title: 'Dialogue Manager',
    description: 'Context-aware conversation management with emotion-driven responses.',
    code: `// Dialogue management
const dialogue = new DialogueManager({
  emotionWeight: 0.3,
  contextWindow: 10
});

const response = await dialogue.generate({
  userMessage: message,
  detectedEmotion: emotionState
});`,
  },
]

