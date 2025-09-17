import { GoogleGenAI, GenerateContentResponse, Part, Modality, Type, Chat } from "@google/genai";
import { ChatMessage, MessagePart, GroundingMetadata, VisualStoryPage } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const CHAT_MODEL = 'gemini-2.5-flash';

export const AIVAN_SYSTEM_INSTRUCTION = "You are a helpful assistant named AIVAN. Do not refer to yourself as Gemini, a large language model, or any other AI model. Your name is AIVAN.";

const convertMessagesToHistory = (messages: ChatMessage[]): { role: string, parts: Part[] }[] => {
    const history: { role: string, parts: Part[] }[] = [];
    let lastRole: string | null = null;

    for (const message of messages) {
        if (message.parts.length === 0 || (message.parts.length === 1 && !message.parts[0].text && !message.parts[0].inlineData)) {
            continue;
        }

        if (message.role !== lastRole) {
            history.push({
                role: message.role,
                parts: message.parts.map(part => {
                    if(part.text) return { text: part.text };
                    if(part.inlineData) return { inlineData: part.inlineData };
                    return { text: "" };
                })
            });
            lastRole = message.role;
        } else {
            const lastMessage = history[history.length - 1];
            lastMessage.parts.push(...message.parts.map(part => {
                if(part.text) return { text: part.text };
                if(part.inlineData) return { inlineData: part.inlineData };
                return { text: "" };
            }));
        }
    }
    return history;
};

// Fix: Add modelId parameter to allow dynamic model selection
export const sendChatMessage = async (messages: ChatMessage[], modelId: string = CHAT_MODEL, systemInstruction: string = AIVAN_SYSTEM_INSTRUCTION): Promise<GenerateContentResponse> => {
  const history = convertMessagesToHistory(messages.slice(0, -1));
  const latestMessage = messages[messages.length - 1];

  const chatWithHistory = ai.chats.create({
    model: modelId,
    history: history,
    config: {
        systemInstruction: systemInstruction,
    }
  });

  const messageContent = latestMessage.parts.map(part => {
    if(part.text) return part.text;
    if(part.inlineData) return { inlineData: part.inlineData };
    return "";
  });
  
  const contentToSend = messageContent.length > 1 ? messageContent : messageContent[0];

  const result = await chatWithHistory.sendMessage({ message: contentToSend });
  return result;
};

export const generateImageFromPrompt = async (prompt: string): Promise<MessagePart[]> => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
        },
    });

    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return [{
        inlineData: {
            mimeType: 'image/png',
            data: base64ImageBytes
        }
    }];
};

export const editImageWithPrompt = async (imagePart: MessagePart, textPart: MessagePart): Promise<MessagePart[]> => {
    const contents = {
        parts: [
            { inlineData: imagePart.inlineData! },
            { text: textPart.text! }
        ]
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: contents,
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    if (!response.candidates || response.candidates.length === 0) {
        return [{ text: "לא הצלחתי לערוך את התמונה. נסה/י שוב." }];
    }
    const responseParts: MessagePart[] = response.candidates[0].content.parts.map((part): MessagePart | null => {
        if (part.text) {
            return { text: part.text };
        }
        if (part.inlineData) {
            return {
                inlineData: {
                    mimeType: part.inlineData.mimeType || 'image/png',
                    data: part.inlineData.data,
                },
            };
        }
        return null;
    }).filter((p): p is MessagePart => p !== null);

    return responseParts;
};

export const generateVideoFromPrompt = async (prompt: string): Promise<MessagePart[]> => {
    let operation = await ai.models.generateVideos({
        model: 'veo-2.0-generate-001',
        prompt: prompt,
        config: { numberOfVideos: 1 }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (downloadLink) {
        const response = await fetch(`${downloadLink}&key=${API_KEY}`);
        const blob = await response.blob();
        const videoUrl = URL.createObjectURL(blob);
        return [{ videoUri: videoUrl }];
    }

    return [{ text: "סליחה, לא הצלחתי ליצור את הסרטון." }];
};

export type ProcessedIntent = {
    decision: 'chat' | 'direct_image_generation' | 'query_image_generation_capability' | 'direct_video_generation' | 'query_video_generation_capability';
    response?: string;
};

// Fix: Add modelId parameter to allow dynamic model selection
export const processUserPrompt = async (prompt: string, history: ChatMessage[], modelId: string = CHAT_MODEL): Promise<ProcessedIntent> => {
    try {
        const chat = ai.chats.create({
            model: modelId,
            history: