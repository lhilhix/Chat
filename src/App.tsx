/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Send, Sparkles, Bot } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setResponse('');
    const currentPrompt = prompt;
    setPrompt('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const streamResponse = await ai.models.generateContentStream({
        model: "gemini-3-flash-preview",
        contents: currentPrompt,
      });

      for await (const chunk of streamResponse) {
        setResponse((prev) => prev + chunk.text);
      }
    } catch (error) {
      console.error(error);
      setResponse("An error occurred while generating the response.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-3xl flex-1 flex flex-col bg-white rounded-3xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-neutral-100 overflow-hidden">
        
        {/* Header */}
        <header className="px-6 py-5 border-b border-neutral-100">
          <h1 className="text-lg font-medium text-neutral-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            AI Assistant
          </h1>
        </header>

        {/* Response Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {response ? (
            <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="flex-1 space-y-1 text-sm md:text-base">
                <div className="font-medium text-neutral-900">AI</div>
                <div className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                  {response}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-neutral-400 space-y-4">
              <Bot className="w-12 h-12 opacity-20" />
              <p className="text-sm font-medium">Ready to help. Ask anything.</p>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-white border-t border-neutral-100">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Message AI..."
              className="w-full pl-6 pr-14 py-4 bg-neutral-100/70 border border-neutral-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl transition-all duration-300 outline-none text-neutral-900 placeholder:text-neutral-500 shadow-sm focus:shadow-md"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className="absolute right-3 p-2.5 text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 rounded-xl transition-all duration-200 hover:shadow-md active:scale-95"
            >
              <Send className="w-4 h-4 translate-x-[-1px] translate-y-[1px]" />
              <span className="sr-only">Send prompt</span>
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
}
