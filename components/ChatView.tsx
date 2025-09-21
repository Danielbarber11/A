import React, { useEffect, useRef, useState, RefObject } from 'react';
import ChatInput from './ChatInput';
import { NewChatIcon, HomeIcon, DownloadIcon, CloseIcon, AivanLoadingSpinner, SpeakerIcon, DotsMenuIcon, ShortenIcon, SummarizeIcon, CopyIcon, EditIcon, ImageLoadingSpinner, UploadIcon, VideoLoadingSpinner, SearchIcon, ChartIcon, StoryIcon, PersonalityIcon, DocumentIcon, ImageIcon, VideoIcon, ChevronDownIcon, ArrowLeftIcon, ArrowRightIcon } from './icons';
import { ChatMessage, GroundingMetadata, VisualStoryPage } from '../types';

interface ChatViewProps {
  messages: ChatMessage[];
  onSend: (text: string, overrideCapability?: string) => void;
  isLoading: boolean;
  onCapabilityClick: (capabilityId: string) => void;
  activeCapability: string | null;
  onCancelCapability: () => void;
  onNewChat: () => void;
  onGoHome: () => void;
  onMessageAction: (text: string, action: 'shorten' | 'summarize') => void;
  onCopyRequest: (text: string) => void;
  onEditRequest: (messageIndex: number) => void;
  inputText: string;
  onInputTextChange: (text: string) => void;
  currentAction: 'chat' | 'image' | 'video';
  image: { file: File; preview: string } | null;
  documentFile: File | null;
  onFileChange: (file: File) => void;
  onFileRemove: () => void;
  fileInputRef: RefObject<HTMLInputElement>;
  cameraInputRef: RefObject<HTMLInputElement>;
  isWaitingForImage: boolean;
  onUploadButtonClick: () => void;
  onStoryChoice: (choice: string) => void;
  capabilities: { id: string; text: string; icon: React.FC<{ className?: string }> }[];
  // Fix: Add props for model selection to resolve type error
  currentModel: { id: string; name: string };
  models: { id: string; name: string }[];
  onModelChange: (model: { id: string; name: string }) => void;
}

const GroundingSources: React.FC<{ metadata: GroundingMetadata }> = ({ metadata }) => (
    <div className="mt-2 border-t border-gray-300 dark:border-gray-600 pt-2">
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">מקורות:</p>
        <div className="flex flex-wrap gap-2">
            {metadata.groundingChunks.map((chunk, index) => (
                <a
                    key={index}
                    href={chunk.web.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-gray-200 dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-full px-2 py-0.5 hover:underline"
                >
                    {index + 1}. {chunk.web.title || new URL(chunk.web.uri).hostname}
                </a>
            ))}
        </div>
    </div>
);

const VisualStoryViewer: React.FC<{ pages: VisualStoryPage[] }> = ({ pages }) => {
    const [currentPage, setCurrentPage] = useState(0);

    const goToNext = () => setCurrentPage(prev => Math.min(prev + 1, pages.length - 1));
    const goToPrev = () => setCurrentPage(prev => Math.max(prev - 1, 0));

    if (!pages || pages.length === 0) return null;
    
    const page = pages[currentPage];

    return (
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden my-2">
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                 {page.imageB64 ? (
                    <img src={`data:image/png;base64,${page.imageB64}`} alt={`Page ${currentPage + 1}`} className="w-full h-full object-cover" />
                 ) : (
                    <div className="text-gray-500">טוען תמונה...</div>
                 )}
            </div>
            <div className="p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 h-20 overflow-y-auto">{page.text}</p>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900/50">
                <button onClick={goToPrev} disabled={currentPage === 0} className="p-2 rounded-full disabled:opacity-30 hover:bg-gray-200 dark:hover:bg-gray-700">
                    <ArrowLeftIcon className="w-5 h-5" />
                </button>
                <span className="text-sm font-medium">{currentPage + 1} / {pages.length}</span>
                <button onClick={goToNext} disabled={currentPage === pages.length - 1} className="p-2 rounded-full disabled:opacity-30 hover:bg-gray-200 dark:hover:bg-gray-700">
                    <ArrowRightIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};


const MoreCapabilitiesModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  capabilities: { id: string; text: string; icon: React.FC<{ className?: string }> }[];
  onCapabilityClick: (id: string) => void;
  isLoading: boolean;
}> = ({ isOpen, onClose, capabilities, onCapabilityClick, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">כל היכולות</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <CloseIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        <div className="overflow-y-auto p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {capabilities.map(cap => (
              <button
                key={cap.id}
                onClick={() => {
                  onCapabilityClick(cap.id);
                  onClose();
                }}
                disabled={isLoading}
                className={`flex flex-col items-center justify-center text-center gap-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all transform shadow-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105'}`}
              >
                <cap.icon className="w-6 h-6" />
                <span>{cap.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Message: React.FC<{ 
    message: ChatMessage;
    messageIndex: number;
    onImageClick: (src: string) => void;
    onMessageAction: (text: string, action: 'shorten' | 'summarize') => void;
    onCopyRequest: (text: string) => void;
    onEditRequest: (messageIndex: number) => void;
    isWaitingForImage: boolean;
    onUploadButtonClick: () => void;
    onStoryChoice: (choice: string) => void;
}> = ({ message, messageIndex, onImageClick, onMessageAction, onCopyRequest, onEditRequest, isWaitingForImage, onUploadButtonClick, onStoryChoice }) => {
    const isUser = message.role === 'user';
    const isModel = message.role === 'model';
    const isCapabilityActivation = message.isCapabilityActivation;
    const [showMenu, setShowMenu] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    
    const messageText = message.parts.filter(p => p.text).map(p => p.text).join('\n');

    const handleSpeak = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }
        if ('speechSynthesis' in window && messageText) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(messageText);
            utterance.lang = 'he-IL';
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
            setIsSpeaking(true);
        }
    };
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const renderContent = () => (
      <>
        {message.parts.map((part, index) => {
            if (part.text) {
                return <p key={index} className="whitespace-pre-wrap">{part.text}</p>;
            }
            if (part.inlineData) {
                const src = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                const isGeneratedByModel = isModel && part.inlineData.mimeType.startsWith('image/');
                const isSVG = part.inlineData.mimeType === 'image/svg+xml';

                return (
                    <div key={index} className={`relative group mt-2 ${isSVG ? 'w-full max-w-sm' : ''}`}>
                        <img
                            src={src}
                            alt="תוכן מצורף"
                            className={`rounded-lg max-w-xs ${isSVG ? 'w-full h-auto' : ''} ${isUser ? '' : 'cursor-pointer'}`}
                            onClick={() => !isUser && onImageClick(src)}
                        />
                        {isGeneratedByModel && !isSVG && (
                            <a
                                href={src}
                                download={`aivan-image-${Date.now()}`}
                                className="absolute top-2 left-2 p-2 bg-black bg-opacity-50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="הורד תמונה"
                            >
                                <DownloadIcon className="w-5 h-5" />
                            </a>
                        )}
                    </div>
                );
            }
            if (part.videoUri) {
                 return (
                    <div key={index} className="mt-2">
                        <video src={part.videoUri} controls className="rounded-lg max-w-xs" />
                    </div>
                );
            }
            return null;
        })}
        {isModel && message.visualStoryPages && <VisualStoryViewer pages={message.visualStoryPages} />}
        {isModel && message.interactiveElement === 'upload_image' && isWaitingForImage && (
            <button
              onClick={onUploadButtonClick}
              className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <UploadIcon className="w-5 h-5" />
              העלה תמונה
            </button>
        )}
         {isModel && message.interactiveElement === 'surprise_me_story' && (
             <button
                onClick={() => onStoryChoice("תפתיע אותי")}
                className="mt-3 rounded-lg bg-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-purple-600"
             >
                תפתיע אותי
            </button>
        )}
        {message.storyContent && (
             <div className="mt-3 space-y-2">
                <p className="whitespace-pre-wrap">{message.storyContent.text}</p>
                <div className="flex flex-wrap gap-2">
                    {message.storyContent.choices.map((choice, i) => (
                        <button key={i} onClick={() => onStoryChoice(choice)} className="rounded-lg bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600">
                            {choice}
                        </button>
                    ))}
                </div>
            </div>
        )}
        {message.groundingMetadata && <GroundingSources metadata={message.groundingMetadata} />}
      </>
    );

    const baseBubbleClasses = "w-fit max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3";
    const userBubbleClasses = "bg-blue-500 text-white self-end rounded-br-lg";
    const modelBubbleClasses = "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 self-start rounded-bl-lg shadow-sm";
    
    const capabilityBubbleClasses = "bg-transparent border-2 p-[calc(1rem-2px)]";
    const capabilityBubbleGradient = {
        borderImage: 'linear-gradient(to right, #7dd3fc, #f1f5f9) 1',
    };
    
    if (isCapabilityActivation) {
        const activationBubbleClasses = isUser
            ? "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 self-end rounded-br-lg border-2"
            : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 self-start rounded-bl-lg border-2";

        return (
             <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-4`}>
                <div 
                    className={`${baseBubbleClasses} ${activationBubbleClasses}`}
                    style={capabilityBubbleGradient}
                >
                   {renderContent()}
                </div>
            </div>
        );
    }
    
    return (
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-4`}>
            <div className={`${baseBubbleClasses} ${isUser ? userBubbleClasses : modelBubbleClasses}`}>
                {renderContent()}
            </div>
             {isModel && messageText && (
                <div className="flex items-center gap-1 mt-1.5">
                    <button onClick={handleSpeak} className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
                        <SpeakerIcon className={`w-4 h-4 ${isSpeaking ? 'text-blue-500' : ''}`} />
                    </button>
                    <button onClick={() => onCopyRequest(messageText)} className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
                        <CopyIcon className="w-4 h-4" />
                    </button>
                    <div className="relative" ref={menuRef}>
                        <button onClick={() => setShowMenu(!showMenu)} className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
                           <DotsMenuIcon className="w-4 h-4" />
                        </button>
                        {showMenu && (
                             <div className="absolute bottom-full mb-1 right-0 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-10">
                                <button onClick={() => {onMessageAction(messageText, 'shorten'); setShowMenu(false);}} className="w-full text-right flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <ShortenIcon className="w-4 h-4 ml-2"/>
                                    קצר הודעה
                                </button>
                                <button onClick={() => {onMessageAction(messageText, 'summarize'); setShowMenu(false);}} className="w-full text-right flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <SummarizeIcon className="w-4 h-4 ml-2"/>
                                    סכם הודעה
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
             {isUser && messageText && (
                <div className="flex items-center gap-1 mt-1.5">
                    <button onClick={() => onCopyRequest(messageText)} className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
                        <CopyIcon className="w-4 h-4" />
                    </button>
                     <button onClick={() => onEditRequest(messageIndex)} className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
                        <EditIcon className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

const ChatView: React.FC<ChatViewProps> = (props) => {
  const { messages, onSend, isLoading, onCapabilityClick, activeCapability, onCancelCapability, onNewChat, onGoHome, onMessageAction, onCopyRequest, onEditRequest, inputText, onInputTextChange, currentAction, image, documentFile, onFileChange, onFileRemove, fileInputRef, cameraInputRef, isWaitingForImage, onUploadButtonClick, onStoryChoice, capabilities, currentModel, models, onModelChange } = props;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isCapabilitiesModalOpen, setIsCapabilitiesModalOpen] = useState(false);
  // Fix: Add state and ref for model selector dropdown
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const modelSelectorRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fix: Add effect to close model selector on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (modelSelectorRef.current && !modelSelectorRef.current.contains(event.target as Node)) {
            setIsModelSelectorOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const displayedCapabilities = capabilities.slice(0, 5);
  const moreCapabilities = capabilities.slice(5);

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 dark:bg-gray-900">
        <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-2">
                 <button onClick={onGoHome} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <HomeIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </button>
            </div>
            {/* Fix: Replace static title with dynamic model selector dropdown */}
            <div className="relative" ref={modelSelectorRef}>
                <button onClick={() => setIsModelSelectorOpen(!isModelSelectorOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{currentModel.name}</h1>
                    <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                </button>
                {isModelSelectorOpen && (
                    <div className="absolute top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20">
                        {models.map(model => (
                            <button 
                                key={model.name} // Using name as key since IDs can be duplicated for different configurations
                                onClick={() => {
                                    onModelChange(model);
                                    setIsModelSelectorOpen(false);
                                }}
                                className="w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                {model.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
             <div className="flex items-center gap-2">
                <button onClick={onNewChat} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <NewChatIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </button>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
            {messages.map((msg, index) => (
                <Message 
                    key={msg.timestamp} 
                    message={msg} 
                    messageIndex={index}
                    onImageClick={setLightboxImage}
                    onMessageAction={onMessageAction}
                    onCopyRequest={onCopyRequest}
                    onEditRequest={onEditRequest}
                    isWaitingForImage={isWaitingForImage}
                    onUploadButtonClick={onUploadButtonClick}
                    onStoryChoice={onStoryChoice}
                />
            ))}
            {isLoading && !messages.some(m => m.parts.some(p=>p.text?.startsWith("מעבד"))) && (
                 <div className="flex justify-start mb-4">
                     {currentAction === 'image' ? <ImageLoadingSpinner/> : currentAction === 'video' ? <VideoLoadingSpinner/> : <AivanLoadingSpinner />}
                </div>
            )}
            <div ref={messagesEndRef} />
            </div>
        </div>
        
        <div className="w-full pb-8 pt-4 bg-gray-50 dark:bg-gray-900">
            {activeCapability === null && (
                 <div className="max-w-4xl mx-auto mb-4 px-4">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 -ms-overflow-style-none scrollbar-hide">
                         {displayedCapabilities.map(cap => (
                            <button 
                                key={cap.id} 
                                onClick={() => onCapabilityClick(cap.id)} 
                                disabled={isLoading}
                                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${isLoading ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            >
                                <cap.icon className="w-5 h-5"/>
                                {cap.text}
                            </button>
                        ))}
                        {moreCapabilities.length > 0 && (
                            <button onClick={() => setIsCapabilitiesModalOpen(true)} disabled={isLoading} className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                                עוד
                                <ChevronDownIcon className="w-5 h-5"/>
                            </button>
                        )}
                    </div>
                </div>
            )}
            <ChatInput 
                onSend={onSend} 
                isLoading={isLoading} 
                activeCapability={activeCapability}
                onCancelCapability={onCancelCapability}
                value={inputText}
                onChange={onInputTextChange}
                currentAction={currentAction}
                image={image}
                documentFile={documentFile}
                onFileChange={onFileChange}
                onFileRemove={onFileRemove}
                fileInputRef={fileInputRef}
                cameraInputRef={cameraInputRef}
                isWaitingForImage={isWaitingForImage}
            />
        </div>
        
        {lightboxImage && (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={() => setLightboxImage(null)}>
                <img src={lightboxImage} alt="תצוגה מקדימה" className="max-w-[90vw] max-h-[90vh] object-contain" />
                <button onClick={() => setLightboxImage(null)} className="absolute top-4 right-4 p-2 bg-white rounded-full text-black">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </div>
        )}
        
        <MoreCapabilitiesModal 
            isOpen={isCapabilitiesModalOpen}
            onClose={() => setIsCapabilitiesModalOpen(false)}
            capabilities={capabilities}
            onCapabilityClick={onCapabilityClick}
            isLoading={isLoading}
        />
    </div>
  );
};

export default ChatView;