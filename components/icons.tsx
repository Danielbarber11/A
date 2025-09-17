import React from 'react';

export const BrainIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="aivanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
        </defs>
        <path d="M9.5 12.5C9.5 13.6 10.4 14.5 11.5 14.5C12.6 14.5 13.5 13.6 13.5 12.5C13.5 11.4 12.6 10.5 11.5 10.5C10.4 10.5 9.5 11.4 9.5 12.5Z" stroke="url(#aivanGradient)" strokeWidth="1.5" />
        <path d="M14.1 16.5C14.1 16.5 15.2 15.9 16 15C17.5 13.5 18.5 12.5 18.5 10.5C18.5 8.5 17.2 6.50001 15.5 6.50001C14.2 6.50001 13.3 7.4 12.9 8.20001" stroke="url(#aivanGradient)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9.9 16.5C9.9 16.5 8.8 15.9 8 15C6.5 13.5 5.5 12.5 5.5 10.5C5.5 8.5 6.8 6.50001 8.5 6.50001C9.8 6.50001 10.7 7.4 11.1 8.20001" stroke="url(#aivanGradient)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M17.5 4.5C17.5 4.5 18.7 3.5 20.5 3.5C22.3 3.5 23.5 5.1 23.5 7.5C23.5 10.5 21.5 13.5 18.5 15.5" stroke="url(#aivanGradient)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M6.5 4.5C6.5 4.5 5.3 3.5 3.5 3.5C1.7 3.5 0.5 5.1 0.5 7.5C0.5 10.5 2.5 13.5 5.5 15.5" stroke="url(#aivanGradient)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12.5 18.5C14.5 18.5 16.5 19.4 16.5 21C16.5 22.6 14.5 23.5 12.5 23.5" stroke="url(#aivanGradient)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M11.5 18.5C9.5 18.5 7.5 19.4 7.5 21C7.5 22.6 9.5 23.5 11.5 23.5" stroke="url(#aivanGradient)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);
export const AivanLogo = BrainIcon;

export const SendIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.101 21.757 23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"/>
  </svg>
);

export const AttachIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);

export const MicIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

export const CameraIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

export const UploadIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export const AivanLoadingSpinner = () => (
    <div className="relative h-12 w-12 flex items-center justify-center">
        <svg className="absolute top-0 left-0 animate-spin h-full w-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
             <defs>
                <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.5"/>
                    <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="none" stroke="url(#spinnerGradient)" strokeWidth="8" strokeLinecap="round" 
                    pathLength="100"
                    strokeDasharray="80 20"
            />
        </svg>
        <div className="h-6 w-6">
            <AivanLogo />
        </div>
    </div>
);

export const ImageIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
);

export const ImageLoadingSpinner = () => (
    <div className="relative h-12 w-12 flex items-center justify-center">
        <svg className="absolute top-0 left-0 animate-spin h-full w-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
             <defs>
                <linearGradient id="imageSpinnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7dd3fc" /> {/* sky-300 */}
                    <stop offset="100%" stopColor="#f1f5f9" /> {/* slate-100 */}
                </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="none" stroke="url(#imageSpinnerGradient)" strokeWidth="8" strokeLinecap="round" 
                    pathLength="100"
                    strokeDasharray="80 20"
            />
        </svg>
        <div className="h-6 w-6 text-sky-400">
            <ImageIcon />
        </div>
    </div>
);

export const VideoIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 7l-7 5 7 5V7z"></path>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
    </svg>
);

export const VideoLoadingSpinner = () => (
    <div className="relative h-12 w-12 flex items-center justify-center">
        <svg className="absolute top-0 left-0 animate-spin h-full w-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
             <defs>
                <linearGradient id="videoSpinnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7dd3fc" /> {/* sky-300 */}
                    <stop offset="100%" stopColor="#f1f5f9" /> {/* slate-100 */}
                </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="none" stroke="url(#videoSpinnerGradient)" strokeWidth="8" strokeLinecap="round" 
                    pathLength="100"
                    strokeDasharray="80 20"
            />
        </svg>
        <div className="h-6 w-6 text-sky-400">
            <VideoIcon />
        </div>
    </div>
);


export const CloseIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const NewChatIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const HomeIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

export const DownloadIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

export const SpeakerIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    </svg>
);

export const DotsMenuIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="5" r="2"></circle>
        <circle cx="12" cy="12" r="2"></circle>
        <circle cx="12" cy="19" r="2"></circle>
    </svg>
);

export const ShortenIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 14h16M4 10h16M10 4l-6 6 6 6M14 20l6-6-6-6"></path>
    </svg>
);

export const SummarizeIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"></line>
        <line x1="8" y1="12" x2="21" y2="12"></line>
        <line x1="8" y1="18" x2="21" y2="18"></line>
        <line x1="3" y1="6" x2="3.01" y2="6"></line>
        <line x1="3" y1="12" x2="3.01" y2="12"></line>
        <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>
);

export const CopyIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
);

export const EditIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);

export const SearchIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);
export const ChartIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.21 15.89A10 10 0 1 1 8.11 3.99"></path>
        <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
    </svg>
);
export const StoryIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 1 4 14.5V4.5A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
);
export const PersonalityIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22a7 7 0 0 0 7-7h-4a3 3 0 0 1-3-3V8a3 3 0 0 1-3-3H5a7 7 0 0 0 7 14z"></path>
        <path d="M18 9h-4a3 3 0 0 1-3-3V2a3 3 0 0 1 3-3h4a7 7 0 0 1 7 7v4a3 3 0 0 1-3 3z" />
    </svg>
);
export const DocumentIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);

export const ChevronDownIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

export const ArrowLeftIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
);

export const ArrowRightIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
);

// New new icons
export const VisualStoryIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        <path d="m10 12-2-2-4 4V7"></path>
    </svg>
);
export const DescribeImageIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"></path>
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M12 17l-1.5-1.5"></path>
        <path d="M12 17l1.5-1.5"></path>
    </svg>
);
export const PaletteIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 2v10l-4.5 4.5"></path>
        <path d="m16.5 16.5 4.5-4.5"></path>
        <path d="M2 12h10"></path>
    </svg>
);
export const DreamIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
        <path d="M8 15h.01"></path>
        <path d="M11 15h.01"></path>
        <path d="M14 15h.01"></path>
    </svg>
);
export const CodeIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
);
export const RecipeIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 15h20"></path>
        <path d="M12 15V3"></path>
        <path d="M7 3h10"></path>
        <path d="M4.5 15a2.5 2.5 0 0 1 0-5h15a2.5 2.5 0 0 1 0 5"></path>
    </svg>
);
export const WorkoutIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h2.586a1 1 0 0 1 .707.293l4.414 4.414a1 1 0 0 0 .707.293H12"></path>
        <path d="M22 12h-2.586a1 1 0 0 0-.707.293l-4.414 4.414a1 1 0 0 1-.707.293H12"></path>
        <path d="M12 12V6.25a2.75 2.75 0 0 1 2.75-2.75h0A2.75 2.75 0 0 1 17.5 6.25V12"></path>
        <path d="M12 12V6.25a2.75 2.75 0 0 0-2.75-2.75h0A2.75 2.75 0 0 0 6.5 6.25V12"></path>
        <path d="M12 12v6"></path>
    </svg>
);
export const TripIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);
export const SpeechIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 6v12"></path>
        <path d="M8 6H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h4"></path>
        <path d="M16 6h4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-4"></path>
        <path d="M12 6a4 4 0 0 0-4 4v0"></path>
        <path d="M12 6a4 4 0 0 1 4 4v0"></path>
    </svg>
);
export const ResumeIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <circle cx="12" cy="14" r="2"></circle>
        <path d="M10 20v-2a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2"></path>
    </svg>
);
export const LanguageIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m5 8 6 6"></path>
        <path d="m4 14 6-6 2-3"></path>
        <path d="M2 5h12"></path>
        <path d="M7 2v3"></path>
        <path d="M22 22l-5-10-5 10"></path>
        <path d="M14 18h6"></path>
    </svg>
);