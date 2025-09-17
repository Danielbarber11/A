export type Role = 'user' | 'model';

export interface GroundingMetadata {
  groundingChunks: {
    web: {
      uri: string;
      title: string;
    }
  }[];
}

export interface MessagePart {
  text?: string;
  inlineData?: {
    mimeType: string;

    data: string;
  };
  videoUri?: string;
}

export interface VisualStoryPage {
    text: string;
    imageB64: string;
}

export interface ChatMessage {
  role: Role;
  parts: MessagePart[];
  timestamp: number;
  isCapabilityActivation?: boolean;
  interactiveElement?: 'upload_image' | 'story_choice' | 'surprise_me_story';
  groundingMetadata?: GroundingMetadata | null;
  storyContent?: {
    text: string;
    choices: string[];
  } | null;
  visualStoryPages?: VisualStoryPage[];
}