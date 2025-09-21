import React, { useState, useRef, useCallback, RefObject } from 'react';
import { SendIcon, AttachIcon, MicIcon, CameraIcon, UploadIcon, AivanLoadingSpinner, CloseIcon, ImageLoadingSpinner, VideoLoadingSpinner, DocumentIcon } from './icons';
import { useSpeechToText } from '../hooks/useRecorder';

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  activeCapability: string | null;
  onCancelCapability: () => void;
  value: string;
  onChange: (value: string) => void;
  currentAction?: 'chat' | 'image' | 'video';
  image: { file: File; preview: string } | null;
  documentFile: File | null;
  onFileChange: (file: File) => void;
  onFileRemove: () => void;
  fileInputRef: RefObject<HTMLInputElement>;
  cameraInputRef: RefObject<HTMLInputElement>;
  isWaitingForImage?: boolean;
}

const capabilityPlaceholders: Record<string, string> = {
    create_image: "תאר את התמונה שתרצה ליצור...",
    edit_image: "העלה תמונה ותאר מה תרצה לשנות...",
    create_video: "תאר את הסרטון שתרצה ליצור...",
    web_search: "שאל כל דבר... אני אחפש באינטרנט.",
    create_chart: "תאר את התרשים והנתונים...",
    personality_mode: "תאר את האישיות שאאמץ...",
    interactive_story: "כתוב נושא לסיפור, או בקש הפתעה...",
    analyze_document: "העלה מסמך ושאל אותי עליו...",
    visual_story: "על איזה נושא תרצה סיפור ויזואלי?",
    describe_image: "העלה תמונה כדי שאוכל לתאר אותה...",
    color_palette: "תאר אווירה או נושא לפלטת צבעים...",
    dream_interpreter: "ספר לי על החלום שלך...",
    programming_assistant: "הדבק קוד או שאל שאלת תכנות...",
    recipe_generator: "רשום את המצרכים שיש לך...",
    workout_planner: "מהי מטרת האימון שלך?",
    trip_planner: "לאן ומתי תרצה לנסוע?",
    speech_writer: "מה נושא הנאום ולמי הוא מיועד?",
    resume_assistant: "הדבק את קורות החיים או בקש עזרה...",
    language_tutor: "באיזו שפה נתרגל היום?",
};

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSend, 
  isLoading, 
  activeCapability, 
  onCancelCapability, 
  value, 
  onChange, 
  currentAction = 'chat',
  image,
  documentFile,
  onFileChange,
  onFileRemove,
  fileInputRef,
  cameraInputRef,
  isWaitingForImage = false,
}) => {
  const [showAttachOptions, setShowAttachOptions] = useState(false);
  const docInputRef = useRef<HTMLInputElement>(null);

  const handleTranscriptChange = useCallback((transcript: string) => {
    onChange(transcript);
  }, [onChange]);

  const { isListening, toggleListening, stopListening } = useSpeechToText(handleTranscriptChange);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileChange(file);
      setShowAttachOptions(false);
    }
    if(event.target) {
        event.target.value = '';
    }
  };

  const isInputDisabled = isLoading || isWaitingForImage || (activeCapability === 'describe_image' && !image);

  const handleSend = () => {
    if(isListening) {
      stopListening();
    }
    if (isLoading || (!value.trim() && !image && !documentFile) || isInputDisabled) return;

    onSend(value.trim());
    onChange('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  };


  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className={
        activeCapability 
        ? "relative p-1 rounded-full bg-gradient-to-r from-sky-300 to-slate-100 transition-all duration-300" 
        : "relative p-1 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
      }>
        <div className="relative flex items-center bg-white dark:bg-gray-800 rounded-full w-full">
            
           <div className="flex items-center flex-shrink-0 ms-2">
            <div className="relative">
                <button
                onClick={() => setShowAttachOptions(!showAttachOptions)}
                className="flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                <AttachIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </button>
                {showAttachOptions && (
                <div className="absolute bottom-16 right-0 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-10">
                    <button 
                    onClick={() => cameraInputRef.current?.click()}
                    className="w-full flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                    <CameraIcon className="w-5 h-5 ml-3" />
                    צילום תמונה
                    </button>
                    <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                    <UploadIcon className="w-5 h-5 ml-3" />
                    העלאת תמונה
                    </button>
                    <button
                    onClick={() => docInputRef.current?.click()}
                    className="w-full flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                    <DocumentIcon className="w-5 h-5 ml-3" />
                    העלאת מסמך
                    </button>
                </div>
                )}
            </div>
          </div>
          
          <div className="flex-grow mx-2 flex items-center relative">
            {image && (
                <div className="relative me-2">
                    <img src={image.preview} alt="Preview" className="h-12 w-12 rounded-lg object-cover" />
                    <button onClick={onFileRemove} className="absolute -top-1 -left-1 bg-gray-800 text-white rounded-full p-0.5">
                        <CloseIcon className="w-3 h-3"/>
                    </button>
                </div>
            )}
            {documentFile && (
                <div className="relative me-2 flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <DocumentIcon className="w-6 h-6 text-gray-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-200 truncate max-w-[120px]">{documentFile.name}</span>
                    <button onClick={onFileRemove} className="absolute -top-1 -left-1 bg-gray-800 text-white rounded-full p-0.5">
                        <CloseIcon className="w-3 h-3"/>
                    </button>
                </div>
            )}
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isWaitingForImage ? "אנא העלה תמונה..." : (activeCapability ? capabilityPlaceholders[activeCapability] || "הקלד/י את הודעתך..." : "הקלד/י את הודעתך...")}
              className="w-full h-14 bg-transparent outline-none text-gray-800 dark:text-gray-200 placeholder-gray-500 text-right ps-2 text-lg"
              disabled={isInputDisabled}
            />
          </div>

          <div className="flex items-center flex-shrink-0 me-2">
            {activeCapability && (
                <button onClick={onCancelCapability} className="flex-shrink-0 me-1 h-12 w-12 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <CloseIcon className="w-6 h-6"/>
                </button>
             )}
            <button
                onClick={toggleListening}
                disabled={isInputDisabled}
                className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center transition-colors ${isListening ? 'text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500' : 'bg-white text-black dark:bg-gray-700 dark:text-white'} ${isInputDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                <MicIcon className="w-6 h-6" />
            </button>
            <button
                onClick={handleSend}
                disabled={isInputDisabled || (!value.trim() && !image && !documentFile)}
                className={`flex-shrink-0 ms-1 h-12 w-12 rounded-full flex items-center justify-center text-white transition-transform transform hover:scale-110 active:scale-95 ${(isInputDisabled || (!value.trim() && !image && !documentFile)) ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'}`}
                >
                {isLoading ? (
                    currentAction === 'image' ? <ImageLoadingSpinner /> :
                    currentAction === 'video' ? <VideoLoadingSpinner /> :
                    <AivanLoadingSpinner />
                ) : <SendIcon className="w-6 h-6" />}
            </button>
          </div>
         
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
          <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} onChange={handleFileSelect} className="hidden" />
          <input type="file" accept=".txt,.md" ref={docInputRef} onChange={handleFileSelect} className="hidden" />
        </div>
      </div>
    </div>
  );
};

export default ChatInput;