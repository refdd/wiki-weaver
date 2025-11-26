import React, { useState, useEffect } from 'react';
import { CheckIcon, ClipboardIcon, DownloadIcon, SparklesIcon } from './icons';

// Dynamically import from esm.sh CDN
const ReactMarkdown = React.lazy(() => import('https://esm.sh/react-markdown@9?bundle'));

interface MarkdownOutputProps {
  markdown: string;
  isLoading: boolean;
  error: string | null;
}

export const MarkdownOutput: React.FC<MarkdownOutputProps> = ({ markdown, isLoading, error }) => {
    const [hasCopied, setHasCopied] = useState(false);
    const [remarkGfmPlugin, setRemarkGfmPlugin] = useState<any>(null);

    useEffect(() => {
        // Dynamically import remark-gfm when the component mounts
        import('https://esm.sh/remark-gfm@4?bundle')
            .then(module => {
                setRemarkGfmPlugin(() => module.default); // remark-gfm is a default export
            })
            .catch(err => console.error("Failed to load remark-gfm", err));
    }, []);


    const handleCopy = () => {
        if (markdown) {
            navigator.clipboard.writeText(markdown);
            setHasCopied(true);
        }
    };
    
    const handleDownload = () => {
        if (!markdown) return;

        const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'llms.txt');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        if (hasCopied) {
            const timer = setTimeout(() => {
                setHasCopied(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [hasCopied]);

    const WelcomeState = () => (
        <div className="text-center text-slate-400 flex flex-col items-center justify-center h-full gap-4">
            <SparklesIcon className="h-16 w-16 text-slate-600" />
            <h3 className="text-lg font-semibold text-slate-300">Your organized content will appear here</h3>
            <p className="max-w-sm">Paste your list of URLs on the left and click "Weave URLs" to let the AI work its magic.</p>
        </div>
    );

    const LoadingState = () => (
        <div className="text-center text-slate-400 flex flex-col items-center justify-center h-full gap-4">
            <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
            <h3 className="text-lg font-semibold text-slate-300">Analyzing & Weaving...</h3>
            <p className="max-w-sm">The AI is categorizing and formatting your links. This may take a moment for long lists.</p>
        </div>
    );
    
    const ErrorState = ({ message }: { message: string }) => (
         <div className="text-center text-red-400 border-2 border-dashed border-red-500/50 rounded-lg p-6 flex flex-col items-center justify-center h-full gap-4">
            <h3 className="text-lg font-bold text-red-300">An Error Occurred</h3>
            <p className="max-w-sm">{message}</p>
        </div>
    );

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 min-h-[60vh] md:min-h-0 md:h-full relative">
      {markdown && !isLoading && (
        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          <button onClick={handleCopy} className="bg-slate-700 hover:bg-slate-600 text-slate-300 p-2 rounded-lg transition-colors flex items-center gap-2 text-xs">
              {hasCopied ? <CheckIcon className="h-4 w-4 text-green-400" /> : <ClipboardIcon className="h-4 w-4" />}
              {hasCopied ? 'Copied!' : 'Copy'}
          </button>
           <button onClick={handleDownload} className="bg-slate-700 hover:bg-slate-600 text-slate-300 p-2 rounded-lg transition-colors flex items-center gap-2 text-xs">
                <DownloadIcon className="h-4 w-4" />
                <span>Download llms.txt</span>
            </button>
        </div>
      )}

      <div className="prose prose-sm prose-invert max-w-none h-full overflow-y-auto pr-2 pt-12">
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : markdown ? (
           <React.Suspense fallback={<LoadingState/>}>
                <ReactMarkdown remarkPlugins={remarkGfmPlugin ? [remarkGfmPlugin] : []}>{markdown}</ReactMarkdown>
            </React.Suspense>
        ) : (
          <WelcomeState />
        )}
      </div>
    </div>
  );
};