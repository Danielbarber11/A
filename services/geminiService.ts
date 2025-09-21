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

// Fix: Implement modifyText for shorten/summarize actions.
export const modifyText = async (textToModify: string, modelId: string = CHAT_MODEL, action: 'shorten' | 'summarize'): Promise<MessagePart[]> => {
    const prompt = action === 'shorten'
        ? `Please shorten the following text:\n\n"${textToModify}"`
        : `Please summarize the following text:\n\n"${textToModify}"`;

    const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: {
            systemInstruction: AIVAN_SYSTEM_INSTRUCTION,
        }
    });
    
    return [{ text: response.text }];
};

// Fix: Implement sendGroundedChatMessage for web search capability.
export const sendGroundedChatMessage = async (messages: ChatMessage[], modelId: string = CHAT_MODEL): Promise<{ text: string, groundingMetadata: GroundingMetadata | null }> => {
    const history = convertMessagesToHistory(messages.slice(0, -1));
    const latestMessage = messages[messages.length - 1];
    
    const chat = ai.chats.create({
        model: modelId,
        history: history,
        config: {
            tools: [{ googleSearch: {} }],
            systemInstruction: AIVAN_SYSTEM_INSTRUCTION
        }
    });
    
    const content = latestMessage.parts.map(p => p.text || "").join(" ");
    const result = await chat.sendMessage({ message: content });
    
    const metadata: GroundingMetadata | null = result.candidates?.[0]?.groundingMetadata ?? null;
    
    return { text: result.text, groundingMetadata: metadata };
};

// Fix: Implement generateChartSVG for chart creation capability.
export const generateChartSVG = async (prompt: string, modelId: string = CHAT_MODEL): Promise<MessagePart[]> => {
    const response = await ai.models.generateContent({
        model: modelId,
        contents: `Based on the following user request, generate a valid SVG string for a chart. The SVG should be well-formed, visually appealing, and accurately represent the data. Do not include any explanation, just the SVG code itself. Request: "${prompt}"`,
        config: {
            systemInstruction: "You are an expert data visualization assistant that only outputs SVG code. Your name is AIVAN.",
            responseMimeType: "image/svg+xml"
        }
    });
    
    const svgText = response.text;
    
    const base64Data = btoa(svgText);
    
    return [{
        inlineData: {
            mimeType: 'image/svg+xml',
            data: base64Data
        }
    }];
};

// Fix: Implement generateInteractiveStory for interactive story capability.
export const generateInteractiveStory = async (prompt: string, history: ChatMessage[], modelId: string = CHAT_MODEL): Promise<{ text: string; choices: string[]; }> => {
    const chat = ai.chats.create({
        model: modelId,
        history: convertMessagesToHistory(history.filter(m => !m.isCapabilityActivation)),
        config: {
            systemInstruction: `You are an interactive storyteller named AIVAN.
- Start a story based on the user's prompt.
- End your response with a paragraph describing the situation.
- Then, provide exactly 3 distinct choices for the user to continue the story.
- Your response MUST be a JSON object.
- Example: {"text": "You stand at a crossroads...", "choices": ["Go left", "Go right", "Wait"]}`,
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    text: { type: Type.STRING },
                    choices: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                },
            }
        }
    });

    const result = await chat.sendMessage({ message: prompt });
    const parsedResult = JSON.parse(result.text.trim());
    return parsedResult;
};

// Fix: Implement generateVisualStory for visual story capability.
export const generateVisualStory = async (prompt: string, modelId: string = CHAT_MODEL): Promise<VisualStoryPage[]> => {
    const scriptGenerationResponse = await ai.models.generateContent({
        model: modelId,
        contents: `Create a short children's story based on the prompt: "${prompt}". The story should have 3 pages. For each page, provide a short paragraph of text (2-3 sentences) and a simple, clear visual description for an illustration.

Format your response as a JSON array, where each object has "text" and "image_prompt" keys.
Example:
[
  {
    "text": "Once upon a time, a brave little robot named Sparky explored a magical forest.",
    "image_prompt": "A small, friendly robot with big blue eyes, standing in a vibrant, glowing forest. cartoon style."
  },
  {
    "text": "Sparky met a wise old owl with glasses perched on a branch.",
    "image_prompt": "A wise, old, cartoon owl with round glasses, sitting on a tree branch, talking to the small robot."
  },
  {
    "text": "They decided to go on an adventure together to find the legendary Crystal Cave.",
    "image_prompt": "The small robot and the wise owl walking side-by-side on a path through the magical forest. digital art."
  }
]`,
        config: {
            systemInstruction: "You are a children's story writer. Your name is AIVAN.",
            responseMimeType: "application/json",
        }
    });

    const storyScript = JSON.parse(scriptGenerationResponse.text.trim());
    
    const pages: VisualStoryPage[] = [];

    for (const page of storyScript) {
        if (page.image_prompt && page.text) {
            const imageParts = await generateImageFromPrompt(page.image_prompt);
            if (imageParts.length > 0 && imageParts[0].inlineData) {
                pages.push({
                    text: page.text,
                    imageB64: imageParts[0].inlineData.data
                });
            }
        }
    }
    
    return pages;
};

export type ProcessedIntent = {
    decision: 'chat' | 'direct_image_generation' | 'query_image_generation_capability' | 'direct_video_generation' | 'query_video_generation_capability';
    response?: string;
};

// Fix: Add modelId parameter to allow dynamic model selection and complete function implementation.
export const processUserPrompt = async (prompt: string, history: ChatMessage[], modelId: string = CHAT_MODEL): Promise<ProcessedIntent> => {
    try {
        const chat = ai.chats.create({
            model: modelId,
            history: convertMessagesToHistory(history),
            config: {
                systemInstruction: `You are an intent detection agent. Analyze the user's latest prompt to determine their intent.
Your response MUST be a JSON object with a 'decision' property.

Possible values for 'decision':
- 'chat': For general conversation, questions, or requests not covered by other categories.
- 'direct_image_generation': If the user explicitly asks to create, generate, or draw an image, and provides a clear description. e.g., "create a picture of a cat", "draw a robot".
- 'query_image_generation_capability': If the user asks IF you can create an image, but doesn't provide a prompt. e.g., "can you make images?".
- 'direct_video_generation': If the user explicitly asks to create or generate a video and provides a description. e.g., "make a video of a sunset".
- 'query_video_generation_capability': If the user asks IF you can create a video. e.g., "can you generate videos?".

If the decision is 'chat', also include a 'response' property with a direct, helpful answer to the user's prompt, as if you were AIVAN the assistant.
Do not add any other text or explanation outside of the JSON object.`,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        decision: {
                            type: Type.STRING,
                            description: "The determined intent.",
                        },
                        response: {
                            type: Type.STRING,
                            description: "The chat response, if decision is 'chat'.",
                        }
                    }
                }
            }
        });

        const result = await chat.sendMessage({ message: prompt });
        const jsonText = result.text.trim();
        const parsedResult = JSON.parse(jsonText);

        if (parsedResult && typeof parsedResult.decision === 'string') {
            return parsedResult as ProcessedIntent;
        }

        const fallbackResponse = await sendChatMessage([...history, { role: 'user', parts: [{ text: prompt }], timestamp: Date.now() }], modelId, AIVAN_SYSTEM_INSTRUCTION);
        return { decision: 'chat', response: fallbackResponse.text };

    } catch (error) {
        console.error("Error processing user prompt:", error);
        try {
             const fallbackResponse = await sendChatMessage([...history, { role: 'user', parts: [{ text: prompt }], timestamp: Date.now() }], modelId, AIVAN_SYSTEM_INSTRUCTION);
            return { decision: 'chat', response: fallbackResponse.text };
        } catch (fallbackError) {
            console.error("Error in fallback chat:", fallbackError);
            return { decision: 'chat', response: "Sorry, I had trouble understanding your request." };
        }
    }
};
