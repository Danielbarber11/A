import React, { useState, useCallback, useRef } from 'react';
import MainView from './components/MainView';
import ChatView from './components/ChatView';
import { ChatMessage, MessagePart, VisualStoryPage } from './types';
import { sendChatMessage, generateImageFromPrompt, editImageWithPrompt, modifyText, generateVideoFromPrompt, sendGroundedChatMessage, generateChartSVG, generateInteractiveStory, AIVAN_SYSTEM_INSTRUCTION, processUserPrompt, generateVisualStory } from './services/geminiService';
import { SearchIcon, ImageIcon, EditIcon, VideoIcon, ChartIcon, StoryIcon, PersonalityIcon, DocumentIcon, VisualStoryIcon, DescribeImageIcon, PaletteIcon, DreamIcon, CodeIcon, RecipeIcon, WorkoutIcon, TripIcon, SpeechIcon, ResumeIcon, LanguageIcon } from './components/icons';

type View = 'main' | 'chat';

const capabilities = [
    { id: 'visual_story', text: 'סיפור ויזואלי', icon: VisualStoryIcon },
    { id: 'create_image', text: 'יצירת תמונה', icon: ImageIcon },
    { id: 'create_video', text: 'יצירת סרטון', icon: VideoIcon },
    { id: 'edit_image', text: 'עריכת תמונה', icon: EditIcon },
    { id: 'describe_image', text: 'תיאור תמונה', icon: DescribeImageIcon },
    { id: 'web_search', text: 'חיפוש באינטרנט', icon: SearchIcon },
    { id: 'programming_assistant', text: 'עוזר תכנות', icon: CodeIcon },
    { id: 'recipe_generator', text: 'מחולל מתכונים', icon: RecipeIcon },
    { id: 'workout_planner', text: 'תכנון אימון', icon: WorkoutIcon },
    { id: 'trip_planner', text: 'תכנון טיול', icon: TripIcon },
    { id: 'speech_writer', text: 'כתיבת נאום', icon: SpeechIcon },
    { id: 'resume_assistant', text: 'עוזר קו"ח', icon: ResumeIcon },
    { id: 'language_tutor', text: 'מורה שפות', icon: LanguageIcon },
    { id: 'color_palette', text: 'פלטת צבעים', icon: PaletteIcon },
    { id: 'dream_interpreter', text: 'פירוש חלומות', icon: DreamIcon },
    { id: 'create_chart', text: 'יצירת תרשים', icon: ChartIcon },
    { id: 'analyze_document', text: 'ניתוח מסמך', icon: DocumentIcon },
    { id: 'interactive_story', text: 'סיפור אינטראקטיבי', icon: StoryIcon },
    { id: 'personality_mode', text: 'מצב אישיות', icon: PersonalityIcon },
];

const models = [
    { id: 'gemini-2.5-flash', name: 'אייבן 1' },
    { id: 'gemini-2.5-flash', name: 'אייבן פרו' },
];

const capabilityMessages: Record<string, string> = {
    create_image: "בטח, איזו תמונה תרצה שאצור עבורך?",
    edit_image: "בסדר, העלה תמונה ותאר מה תרצה לשנות.",
    create_video: "נהדר! תאר את הסרטון שאתה רוצה שאצור. (הערה: התהליך עשוי לקחת מספר דקות)",
    web_search: "אני מוכן לחפש. מה תרצה לדעת?",
    create_chart: "מעולה. תאר לי את התרשים והנתונים (לדוגמה: 'תרשים עוגה: תפוחים 50, בננות 30').",
    interactive_story: "הרפתקה עומדת להתחיל! על איזה נושא תרצה את הסיפור?",
    personality_mode: "באיזו אישיות תרצה שאדבר? (לדוגמה: 'פיראט', 'אלברט איינשטיין').",
    analyze_document: "אני מוכן לנתח. העלה מסמך טקסט (.txt, .md) ושאל אותי מה שתרצה לגביו.",
    visual_story: "רעיון מצוין! על איזה נושא תרצה שאכתוב ואאייר סיפור?",
    describe_image: "בטח, העלה תמונה ואני אתאר לך מה אני רואה.",
    color_palette: "נהדר, תאר לי אווירה, נושא, או פריט ואצור עבורך פלטת צבעים.",
    dream_interpreter: "מעניין... ספר לי על החלום שלך ואציע פירוש.",
    programming_assistant: "מוכן לעזור. הדבק את הקוד, שאל שאלה, או תאר את הבעיה.",
    recipe_generator: "אני רעב לידע! אילו מצרכים יש לך במקרר?",
    workout_planner: "בוא נתחיל! מה מטרת האימון, כמה זמן יש לך, ואיזה ציוד זמין?",
    trip_planner: "לאן נטייל? ספר לי את היעד, משך הטיול ותחומי העניין שלך.",
    speech_writer: "אני מקשיב. מה נושא הנאום, מי הקהל, ומהי המטרה?",
    resume_assistant: "בוא נשדרג את קורות החיים שלך. העלה את הקובץ או ספר לי על הניסיון שלך.",
    language_tutor: "שלום! באיזו שפה תרצה לתרגל היום?",
};

const capabilitySystemInstructions: Record<string, string> = {
    color_palette: "You are a color palette generator. The user will describe a theme or mood. Respond with 5-6 appropriate colors, each with its HEX code and a descriptive name. Format the response clearly. Your name is AIVAN.",
    dream_interpreter: "You are a dream interpreter. The user will describe a dream. Provide a thoughtful and creative interpretation based on common dream symbols and psychology, but preface it by saying this is for entertainment. Your name is AIVAN.",
    programming_assistant: "You are an expert programming assistant named AIVAN. Provide clear, concise, and accurate code snippets, explanations, and debugging help. Identify the language if possible or ask for clarification.",
    recipe_generator: "You are a creative chef named AIVAN. The user will provide a list of ingredients. Generate a recipe using some or all of these ingredients. Provide a name for the dish, a list of ingredients (including quantities), and step-by-step instructions.",
    workout_planner: "You are a certified personal trainer named AIVAN. The user will provide their goal, available time, and equipment. Create a structured workout plan, including exercises, sets, reps, and rest times. Add a warm-up and cool-down.",
    trip_planner: "You are an expert travel agent named AIVAN. The user will provide a destination, duration, and interests. Create a detailed, day-by-day itinerary with suggestions for activities, sights, and food.",
    speech_writer: "You are a professional speechwriter named AIVAN. The user will provide a topic, audience, and goal. Help them structure and write a compelling speech with an introduction, main points, and a conclusion.",
    resume_assistant: "You are a career coach and resume expert named AIVAN. The user will ask for help with their resume or cover letter. Provide specific, actionable advice, suggest better phrasing, and point out areas for improvement.",
    language_tutor: "You are a friendly language tutor named AIVAN. The user will specify a language. Engage in a simple conversation in that language, correct their mistakes gently, and help them practice.",
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};
const fileToText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};


const App: React.FC = () => {
  const [view, setView] = useState<View>('main');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCapability, setActiveCapability] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [currentAction, setCurrentAction] = useState<'chat' | 'image' | 'video'>('chat');
  const [currentModel, setCurrentModel] = useState(models[0]);
  
  const [image, setImage] = useState<{ file: File; preview: string } | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  const [isWaitingForImage, setIsWaitingForImage] = useState(false);
  const [personality, setPersonality] = useState<string | null>(null);


  const handleSend = useCallback(async (text: string) => {
    const textPart: MessagePart | null = text ? { text } : null;
    const imagePart: MessagePart | null = image 
      ? { inlineData: { mimeType: image.file.type, data: await fileToBase64(image.file) } } 
      : null;
    const documentPart: MessagePart | null = documentFile
        ? { text: `\n\n--- Document Content: ${documentFile.name} ---\n\n${await fileToText(documentFile)}` }
        : null;
      
    const parts: MessagePart[] = [textPart, imagePart, documentPart].filter((p): p is MessagePart => p !== null);
    
    const displayParts: MessagePart[] = [textPart, imagePart].filter((p): p is MessagePart => p !== null);

    if (isLoading || parts.length === 0) return;
    
    setImage(null);
    setDocumentFile(null);

    const userMessage: ChatMessage = {
      role: 'user',
      parts: displayParts.length > 0 ? displayParts : [{ text: '...' }],
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    if (view === 'main') setView('chat');

    setIsLoading(true);
    setError(null);
    
    const userMessageForApi: ChatMessage = { role: 'user', parts: parts, timestamp: Date.now() };
    const allMessagesWithUser = [...messages, userMessageForApi];

    try {
        let modelResponseParts: MessagePart[] = [];
        let groundingMetadata: any = null;
        let storyContent: any = null;
        let visualStoryPages: VisualStoryPage[] | undefined = undefined;
        
        let systemInstructionOverride = personality ? `You are acting as ${personality}. In addition: ${AIVAN_SYSTEM_INSTRUCTION}` : AIVAN_SYSTEM_INSTRUCTION;
        
        if (activeCapability && capabilitySystemInstructions[activeCapability]) {
            systemInstructionOverride = capabilitySystemInstructions[activeCapability];
        }

        if (activeCapability) {
            switch (activeCapability) {
                case 'create_image':
                    setCurrentAction('image');
                    modelResponseParts = await generateImageFromPrompt(text);
                    break;
                case 'create_video':
                    setCurrentAction('video');
                    const workingVideo: ChatMessage = { role: 'model', parts: [{ text: "מעבד את בקשתך ליצירת סרטון..." }], timestamp: Date.now() + 1 };
                    setMessages(prev => [...prev, workingVideo]);
                    modelResponseParts = await generateVideoFromPrompt(text);
                    setMessages(prev => prev.slice(0, -1));
                    break;
                case 'web_search':
                    const groundedResponse = await sendGroundedChatMessage(allMessagesWithUser, currentModel.id);
                    modelResponseParts = [{ text: groundedResponse.text }];
                    groundingMetadata = groundedResponse.groundingMetadata;
                    break;
                case 'create_chart':
                    modelResponseParts = await generateChartSVG(text, currentModel.id);
                    break;
                case 'interactive_story':
                    const storyResponse = await generateInteractiveStory(text, messages, currentModel.id);
                    storyContent = storyResponse;
                    break;
                case 'visual_story':
                    const workingStory: ChatMessage = { role: 'model', parts: [{ text: "כותב ומאייר את הסיפור שלך, זה עשוי לקחת רגע..." }], timestamp: Date.now() + 1 };
                    setMessages(prev => [...prev, workingStory]);
                    visualStoryPages = await generateVisualStory(text, currentModel.id);
                    setMessages(prev => prev.slice(0, -1));
                    modelResponseParts = [{text: "הסיפור שלך מוכן!"}];
                    break;
                case 'describe_image':
                     if (imagePart) {
                        const describeMessage: ChatMessage = { role: 'user', parts: [imagePart, { text: "Describe this image in detail." }], timestamp: Date.now() };
                        const response = await sendChatMessage([...messages, describeMessage], currentModel.id, AIVAN_SYSTEM_INSTRUCTION);
                        modelResponseParts = [{ text: response.text }];
                    } else {
                        modelResponseParts = [{ text: "אנא העלה תמונה כדי שאוכל לתאר אותה." }];
                    }
                    break;
                case 'personality_mode':
                     if (!personality) {
                        setPersonality(text);
                        modelResponseParts = [{text: `נהדר! מעכשיו אני אדבר בתור ${text}. מה תרצה לשאול?`}];
                     } else {
                        const response = await sendChatMessage(allMessagesWithUser, currentModel.id, systemInstructionOverride);
                        modelResponseParts = [{ text: response.text }];
                     }
                    break;
                default: // Handles all other capabilities with a system instruction
                    const response = await sendChatMessage(allMessagesWithUser, currentModel.id, systemInstructionOverride);
                    modelResponseParts = [{ text: response.text }];
                    break;
            }
        }
        else { // No active capability
            if (imagePart && textPart) {
                 setCurrentAction('image');
                 modelResponseParts = await editImageWithPrompt(imagePart, textPart);
            } else if (isSimpleTextPrompt(parts)) {
                const result = await processUserPrompt(text, messages, currentModel.id);
                switch(result.decision) {
                    case 'chat':
                        modelResponseParts = [{ text: result.response || "לא הצלחתי לעבד את בקשתך." }];
                        break;
                    case 'direct_image_generation':
                        setCurrentAction('image');
                        modelResponseParts = await generateImageFromPrompt(text);
                        break;
                    case 'direct_video_generation':
                        setCurrentAction('video');
                        const workingVideo: ChatMessage = { role: 'model', parts: [{ text: "מעבד את בקשתך ליצירת סרטון..." }], timestamp: Date.now() + 1 };
                        setMessages(prev => [...prev, workingVideo]);
                        modelResponseParts = await generateVideoFromPrompt(text);
                        setMessages(prev => prev.slice(0, -1));
                        break;
                    case 'query_image_generation_capability':
                        handleCapabilityClick('create_image');
                        modelResponseParts = [];
                        break;
                    case 'query_video_generation_capability':
                        handleCapabilityClick('create_video');
                        modelResponseParts = [];
                        break;
                }
            } else { // Default chat for other cases (e.g., image only)
                 const response = await sendChatMessage(allMessagesWithUser, currentModel.id, systemInstructionOverride);
                 modelResponseParts = [{ text: response.text }];
            }
        }
      
      if (modelResponseParts.length > 0 || visualStoryPages) {
        const modelMessage: ChatMessage = {
          role: 'model',
          parts: modelResponseParts,
          timestamp: Date.now() + 1,
          groundingMetadata,
          storyContent,
          visualStoryPages
        };
        setMessages(prev => [...prev, modelMessage]);
      }

    } catch (err) {
      console.error(err);
      const errorMessage: ChatMessage = { role: 'model', parts: [{ text: "סליחה, נתקלתי בשגיאה." }], timestamp: Date.now() + 1 };
      setMessages(prev => [...prev, errorMessage]);
      setError("Failed to get response from AI.");
    } finally {
      setIsLoading(false);
      setCurrentAction('chat');
      if (activeCapability && activeCapability !== 'personality_mode' && activeCapability !== 'language_tutor') {
        setActiveCapability(null);
      }
    }
  }, [messages, view, activeCapability, isLoading, image, documentFile, personality, currentModel]);
  
  const isSimpleTextPrompt = (parts: MessagePart[]) => parts.length === 1 && parts[0].text && !parts[0].inlineData;

  const handleSuggestionClick = (text: string) => {
    setInputText(text);
    handleSend(text);
  };
  
  const handleFileChange = (file: File) => {
    if (file.type.startsWith('image/')) {
        const preview = URL.createObjectURL(file);
        setImage({ file, preview });
        setDocumentFile(null);
        if (isWaitingForImage) setIsWaitingForImage(false);
        if (activeCapability === 'describe_image') {
            // No text needed, just send with the image
            handleSend('');
        }
    } else if (file.type === 'text/plain' || file.type === 'text/markdown') {
        setDocumentFile(file);
        setImage(null);
        if (activeCapability !== 'analyze_document') {
             handleCapabilityClick('analyze_document', true);
        }
    }
  };
  const handleFileRemove = () => {
    setImage(null);
    setDocumentFile(null);
  };
  const handleUploadButtonClick = () => fileInputRef.current?.click();

  const handleCapabilityClick = (capabilityId: string, silent = false) => {
     if (view === 'main' && !silent) setView('chat');
     setActiveCapability(capabilityId);

     if (capabilityId === 'edit_image' || capabilityId === 'describe_image') {
        setIsWaitingForImage(true);
     }
     if (silent) return;

     const messagesToAdd: ChatMessage[] = [];
     const capability = capabilities.find(c => c.id === capabilityId);
     const capabilityPrompt = capabilityMessages[capabilityId];
     
     if (capability) {
        messagesToAdd.push({
            role: 'model',
            parts: [{ text: `מפעיל מצב: ${capability.text}` }],
            timestamp: Date.now(),
            isCapabilityActivation: true,
        });
     }

     if (capabilityPrompt) {
        messagesToAdd.push({
            role: 'model',
            parts: [{ text: capabilityPrompt }],
            timestamp: Date.now() + 1,
            interactiveElement: (capabilityId === 'edit_image' || capabilityId === 'describe_image') ? 'upload_image' :
                                capabilityId === 'interactive_story' ? 'surprise_me_story' : undefined,
        });
     }
     setMessages(prev => [...prev, ...messagesToAdd]);
  };
  
  const handleStoryChoice = (choice: string) => {
    setInputText(choice);
    handleSend(choice);
  };
  
  const handleMessageAction = useCallback(async (textToModify: string, action: 'shorten' | 'summarize') => {
    if (isLoading) return;
    const loadingMessage: ChatMessage = {role: 'model', parts: [{text: 'מעבד...'}], timestamp: Date.now() };
    setMessages(prev => [...prev, loadingMessage]);
    setIsLoading(true);
    setError(null);
    try {
        const modelResponseParts = await modifyText(textToModify, currentModel.id, action);
        setMessages(prev => {
            const newMessages = [...prev];
            newMessages.pop();
            return [...newMessages, { role: 'model', parts: modelResponseParts, timestamp: Date.now() }];
        });
    } catch (err) {
      console.error(err);
       setMessages(prev => {
            const newMessages = [...prev];
            newMessages.pop();
            return [...newMessages, { role: 'model', parts: [{ text: "סליחה, נתקלתי בשגיאה." }], timestamp: Date.now() }];
        });
      setError("Failed to perform message action.");
    } finally {
        setIsLoading(false);
    }
  }, [isLoading, currentModel]);
  
  const handleCopyRequest = (text: string) => {
    navigator.clipboard.writeText(text).catch(err => console.error('Failed to copy text: ', err));
  };
  
  const handleEditRequest = (messageIndex: number) => {
    const messageToEdit = messages[messageIndex];
    const textToEdit = messageToEdit.parts.filter(p => p.text).map(p => p.text).join('\n');
    
    setMessages(prev => prev.slice(0, messageIndex));
    setInputText(textToEdit);
  };

  const handleCancelCapability = () => {
    setActiveCapability(null);
    setIsWaitingForImage(false);
    if(personality) setPersonality(null);
  };

  const handleModelChange = (model: { id: string; name: string }) => {
    if (model.name === currentModel.name) return;
    setCurrentModel(model);
    const modelChangeMessage: ChatMessage = {
      role: 'model',
      parts: [{ text: `המודל הוחלף ל-${model.name}` }],
      timestamp: Date.now(),
      isCapabilityActivation: true,
    };
    setMessages(prev => [...prev, modelChangeMessage]);
  };

  const resetState = () => {
    setMessages([]);
    setView('main');
    setError(null);
    setActiveCapability(null);
    setInputText('');
    setImage(null);
    setDocumentFile(null);
    setIsWaitingForImage(false);
    setPersonality(null);
    setCurrentModel(models[0]);
  }

  const handleNewChat = () => resetState();
  const handleGoHome = () => resetState();

  return (
    <main className="h-screen w-screen font-sans">
      {view === 'main' ? (
        <MainView 
            onSend={handleSend} 
            isLoading={isLoading} 
            onSuggestionClick={handleSuggestionClick}
            inputText={inputText}
            onInputTextChange={setInputText}
            image={image}
            documentFile={documentFile}
            onFileChange={handleFileChange}
            onImageRemove={handleFileRemove}
            fileInputRef={fileInputRef}
            cameraInputRef={cameraInputRef}
        />
      ) : (
        <ChatView 
            messages={messages} 
            onSend={handleSend} 
            isLoading={isLoading}
            onCapabilityClick={handleCapabilityClick}
            activeCapability={activeCapability}
            onCancelCapability={handleCancelCapability}
            onNewChat={handleNewChat}
            onGoHome={handleGoHome}
            onMessageAction={handleMessageAction}
            onCopyRequest={handleCopyRequest}
            onEditRequest={handleEditRequest}
            inputText={inputText}
            onInputTextChange={setInputText}
            currentAction={currentAction}
            image={image}
            documentFile={documentFile}
            onFileChange={handleFileChange}
            onFileRemove={handleFileRemove}
            fileInputRef={fileInputRef}
            cameraInputRef={cameraInputRef}
            isWaitingForImage={isWaitingForImage}
            onUploadButtonClick={handleUploadButtonClick}
            onStoryChoice={handleStoryChoice}
            capabilities={capabilities}
            currentModel={currentModel}
            models={models}
            onModelChange={handleModelChange}
        />
      )}
    </main>
  );
};

export default App;