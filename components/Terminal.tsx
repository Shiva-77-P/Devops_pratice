import React, { useState, useEffect, useRef } from 'react';
import { TerminalSession } from '../services/geminiService';
import { TerminalLine } from '../types';

interface TerminalProps {
  initialPrompt: string;
  onHistoryChange: (history: TerminalLine[]) => void;
  sessionRef: React.MutableRefObject<TerminalSession | null>;
}

export const Terminal: React.FC<TerminalProps> = ({ initialPrompt, onHistoryChange, sessionRef }) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'system', content: 'Initializing DevOps Environment...' },
    { type: 'system', content: 'Connected. Type commands below.' }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize session on mount or prompt change
  useEffect(() => {
    sessionRef.current = new TerminalSession(initialPrompt);
    setLines([
      { type: 'system', content: 'Environment Ready.' },
      { type: 'system', content: 'Type `help` if stuck, or follow the instructions.' }
    ]);
  }, [initialPrompt, sessionRef]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    onHistoryChange(lines);
  }, [lines, onHistoryChange]);

  // Focus input on click
  const handleContainerClick = () => {
    // Only focus if user isn't selecting text
    if (window.getSelection()?.toString() === '') {
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isProcessing) {
      if (!input.trim()) return;

      const command = input;
      setInput('');
      setIsProcessing(true);

      // Add user command to UI
      setLines(prev => [...prev, { type: 'input', content: command }]);

      try {
        if (!sessionRef.current) throw new Error("No session");
        
        // Handle clear command locally
        if (command === 'clear') {
          setLines([]);
          setIsProcessing(false);
          return;
        }

        const response = await sessionRef.current.sendCommand(command);
        setLines(prev => [...prev, { type: 'output', content: response }]);
      } catch (err) {
        setLines(prev => [...prev, { type: 'error', content: 'Connection lost. Please reset lab.' }]);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div 
      className="flex flex-col h-full bg-[#0f172a] text-gray-300 font-mono text-sm p-4 overflow-hidden border-t border-gray-700 md:border-t-0 md:border-l"
      onClick={handleContainerClick}
    >
      <div className="flex-1 overflow-y-auto mb-2 space-y-1">
        {lines.map((line, idx) => (
          <div key={idx} className={`${line.type === 'input' ? 'text-green-400 mt-2 font-bold' : line.type === 'error' ? 'text-red-400' : line.type === 'system' ? 'text-blue-400 italic' : 'text-gray-300 whitespace-pre-wrap'}`}>
            {line.type === 'input' && <span className="mr-2">$</span>}
            {line.content}
          </div>
        ))}
        {isProcessing && <div className="animate-pulse text-gray-500">_</div>}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center text-green-400 border-t border-gray-800 pt-2">
        <span className="mr-2 font-bold">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none text-gray-100 placeholder-gray-600"
          placeholder="Type a command..."
          autoComplete="off"
          autoFocus
          disabled={isProcessing}
        />
      </div>
    </div>
  );
};
