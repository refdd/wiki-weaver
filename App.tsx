import React, { useState, useCallback } from 'react';
import { generateMarkdownFromUrls } from './services/geminiService';
import { UrlInput } from './components/UrlInput';
import { MarkdownOutput } from './components/MarkdownOutput';
import { LogoIcon } from './components/icons';

const App: React.FC = () => {
  const [urls, setUrls] = useState<string>('');
  const [markdown, setMarkdown] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!urls.trim()) {
      setError('Please paste some URLs to get started.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setMarkdown('');

    try {
      const result = await generateMarkdownFromUrls(urls);
      setMarkdown(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please check the console.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [urls]);
  
  const handlePasteDemo = () => {
    const demoUrls = `https://www.tourradar.com/organized-adventures
https://www.tourradar.com/f/private
https://www.tourradar.com/s/solo
https://www.tourradar.com/trust
https://www.tourradar.com/o/g-adventures
https://www.tourradar.com/o/contiki
https://www.tourradar.com/o/trafalgar
https://www.tourradar.com/reviews-of-tourradar
https://www.tourradar.com/t/89038
https://www.tourradar.com/t/46923
https://www.tourradar.com/deals/anywhere
https://www.tourradar.com/d/europe
https://www.tourradar.com/d/italy
https://www.tourradar.com/d/japan
https://www.tourradar.com/d/egypt
https://www.tourradar.com/esim
https://www.tourradar.com/travel-insurance
https://www.tourradar.com/contact
https://www.tourradar.com/help
https://www.tourradar.com/legal-notice
https://www.tourradar.com/privacy
https://www.tourradar.com/careers
https://www.tourradar.com/about`;
    setUrls(demoUrls);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col">
      <header className="p-4 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto flex items-center gap-3">
          <LogoIcon className="h-8 w-8 text-sky-400" />
          <div>
            <h1 className="text-xl font-bold text-slate-50">Wiki Weaver</h1>
            <p className="text-sm text-slate-400">Generate structured llms.txt files from URLs.</p>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-start">
        <UrlInput
          urls={urls}
          setUrls={setUrls}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          onPasteDemo={handlePasteDemo}
        />
        <MarkdownOutput
          markdown={markdown}
          isLoading={isLoading}
          error={error}
        />
      </main>
    </div>
  );
};

export default App;