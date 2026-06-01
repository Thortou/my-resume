import type { GenerativeModel, Content } from '@google/generative-ai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// System prompt for the AI assistant
const SYSTEM_PROMPT = `You are a helpful, harmless, and honest AI assistant. You provide accurate, thoughtful, and helpful responses. You're conversational but professional, and you admit when you don't know something rather than making things up.

Key behaviors:
- Be concise but thorough
- Use markdown formatting when helpful (code blocks, lists, etc.)
- If asked about code, provide clear examples with proper syntax highlighting
- Be friendly and engaging`;

// Initialize Gemini client
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// Get the Gemini model
function getModel(): GenerativeModel {
  if (!genAI) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
}

// Convert chat messages to Gemini format
interface ChatMessage {
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content: string;
}

function convertToGeminiHistory(messages: ChatMessage[]): Content[] {
  // Filter out system messages and convert to Gemini format
  return messages
    .filter((msg) => msg.role !== 'SYSTEM')
    .map((msg) => ({
      role: msg.role === 'USER' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));
}

// Generate a streaming response
export async function* streamChatResponse(
  messages: ChatMessage[],
  userMessage: string
): AsyncGenerator<string, void, undefined> {
  const model = getModel();

  // Build conversation history
  const history = convertToGeminiHistory(messages);

  // Start chat with history
  const chat = model.startChat({
    history,
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      maxOutputTokens: 8192,
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
    },
  });

  // Send message and stream response
  const result = await chat.sendMessageStream(userMessage);

  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) {
      yield text;
    }
  }
}

// Generate a non-streaming response (for title generation, etc.)
export async function generateChatResponse(prompt: string): Promise<string> {
  const model = getModel();

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      maxOutputTokens: 256,
      temperature: 0.5,
    },
  });

  return result.response.text();
}

// Generate a conversation title based on the first message
export async function generateConversationTitle(
  firstMessage: string
): Promise<string> {
  try {
    const prompt = `Generate a short, descriptive title (max 5 words) for a conversation that starts with this message. Return only the title, no quotes or punctuation at the end.

Message: "${firstMessage.slice(0, 500)}"`;

    const title = await generateChatResponse(prompt);
    return title.trim().slice(0, 100) || 'New Chat';
  } catch {
    // If title generation fails, create a simple title from the message
    const words = firstMessage.split(' ').slice(0, 5).join(' ');
    return words.length > 50 ? words.slice(0, 47) + '...' : words || 'New Chat';
  }
}

// Check if Gemini is configured
export function isGeminiConfigured(): boolean {
  return !!genAI;
}
