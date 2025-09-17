import React, { useState, useMemo, RefObject } from 'react';
import ChatInput from './ChatInput';

interface MainViewProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  onSuggestionClick: (text: string) => void;
  inputText: string;
  onInputTextChange: (text: string) => void;
  image: { file: File; preview: string } | null;
  documentFile: File | null;
  onFileChange: (file: File) => void;
  onImageRemove: () => void;
  fileInputRef: RefObject<HTMLInputElement>;
  cameraInputRef: RefObject<HTMLInputElement>;
}

const allSuggestions = [
    "ספר לי עובדה מהנה על החלל",
    "איך מזג האוויר בתל אביב?",
    "הסבר בפשטות על בינה מלאכותית יוצרת",
    "הצע מתכון בריא לארוחת ערב מהירה",
    "כתוב לי שיר קצר על חברות",
    "מהם שלושת הסרטים המומלצים ביותר השנה?",
    "תכנן לי מסלול טיול של יום אחד בצפון",
    "תרגם את המשפט 'Hello, how are you?' לספרדית",
    "תן לי רעיון למתנה מקורית ליום הולדת",
    "מה ההבדל בין JavaScript ל-TypeScript?",
    "כתוב קוד פייתון שממיין רשימת מספרים",
    "סכם לי את הנקודות העיקריות במאמר על שינויי אקלים",
    "מהם היתרונות של מדיטציה?",
    "תן לי רעיון לפרויקט צד מהנה בתחום התכנות",
    "כתוב פסקה קצרה בסגנון של סופר מדע בדיוני מפורסם",
    "מהי בירת אוסטרליה?",
    "הסבר לי מה זה NFT",
    "מי כתב את הספר 'התפסן בשדה השיפון'?",
    "הצע 3 פודקאסטים מעניינים בעברית",
    "איך אומרים 'אני אוהב אותך' ביפנית?",
];

const MainView: React.FC<MainViewProps> = ({ onSend, isLoading, onSuggestionClick, inputText, onInputTextChange, image, onFileChange, onImageRemove, fileInputRef, cameraInputRef, documentFile }) => {
    
    const suggestions = useMemo(() => {
        const shuffled = [...allSuggestions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 4);
    }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        
        <div className="flex items-center justify-center h-20 mb-4">
            <h1 className="fade-in-sequence text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                אייבן
            </h1>
        </div>
        
        <p className="text-xl text-gray-500 dark:text-gray-400 mb-12">
          אני כאן כדי לעזור. איך אפשר לסייע לך היום?
        </p>
      </div>
      <div className="w-full pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-6 px-4">
            {suggestions.map(s => (
                <button key={s} onClick={() => onSuggestionClick(s)} className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-right shadow-sm">
                    <p className="font-semibold text-sm">{s}</p>
                </button>
            ))}
        </div>
        <ChatInput 
            onSend={onSend} 
            isLoading={isLoading} 
            activeCapability={null} 
            onCancelCapability={() => {}} 
            value={inputText}
            onChange={onInputTextChange}
            image={image}
            documentFile={documentFile}
            onFileChange={onFileChange}
            onFileRemove={onImageRemove}
            fileInputRef={fileInputRef}
            cameraInputRef={cameraInputRef}
        />
        <p className="text-center text-xs text-gray-400 mt-4">
            AIVAN עלול לעשות טעויות. מומלץ לבדוק מידע חשוב.
        </p>
      </div>
    </div>
  );
};

export default MainView;