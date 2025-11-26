
import React from 'react';
import { WeaveIcon, SparklesIcon } from './icons';

interface UrlInputProps {
  urls: string;
  setUrls: (urls: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  onPasteDemo: () => void;
}

export const UrlInput: React.FC<UrlInputProps> = ({ urls, setUrls, onGenerate, isLoading, onPasteDemo }) => {
  return (
    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 h-full flex flex-col gap-4 sticky top-24">
      <div className="flex justify-between items-center">
        <label htmlFor="url-input" className="font-semibold text-slate-300">
          Paste URLs (one per line)
        </label>
        <button 
          onClick={onPasteDemo}
          className="text-xs text-sky-400 hover:text-sky-300 transition-colors"
        >
          Paste Demo
        </button>
      </div>
      <textarea
        id="url-input"
        value={urls}
        onChange={(e) => setUrls(e.target.value)}
        placeholder="e.g.&#10;https://example.com/about-us&#10;https://example.com/products/new-widget"
        className="w-full flex-grow bg-slate-900/70 border border-slate-700 rounded-md p-3 text-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition resize-none"
        rows={15}
      />
      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="w-full bg-sky-600 hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 transform active:scale-95"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Weaving...
          </>
        ) : (
          <>
            <WeaveIcon className="h-5 w-5" />
            Weave URLs
          </>
        )}
      </button>
    </div>
  );
};
