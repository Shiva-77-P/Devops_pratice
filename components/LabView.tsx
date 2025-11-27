import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { COURSES } from '../constants';
import { Terminal } from './Terminal';
import { Icon } from './Icon';
import { TerminalSession, getTutorResponse } from '../services/geminiService';
import { TerminalLine, Message } from '../types';

export const LabView: React.FC = () => {
  const { courseId, labId } = useParams();
  const navigate = useNavigate();
  
  const course = COURSES.find(c => c.id === courseId);
  const lab = course?.labs.find(l => l.id === labId);

  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [verifying, setVerifying] = useState(false);
  const [labStatus, setLabStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [feedback, setFeedback] = useState<string | null>(null);
  
  // Tutor State
  const [tutorOpen, setTutorOpen] = useState(false);
  const [tutorMessages, setTutorMessages] = useState<Message[]>([
    { role: 'model', content: "Hi! I'm your DevOps tutor. Ask me anything about this lab if you get stuck." }
  ]);
  const [tutorInput, setTutorInput] = useState('');
  const [tutorLoading, setTutorLoading] = useState(false);
  const tutorScrollRef = useRef<HTMLDivElement>(null);

  const sessionRef = useRef<TerminalSession | null>(null);

  useEffect(() => {
    if (tutorScrollRef.current) {
        tutorScrollRef.current.scrollTop = tutorScrollRef.current.scrollHeight;
    }
  }, [tutorMessages, tutorOpen]);

  if (!course || !lab) {
    return <div className="p-10 text-white">Lab not found. <Link to="/" className="text-blue-400">Go Home</Link></div>;
  }

  const handleVerify = async () => {
    if (!sessionRef.current) return;
    setVerifying(true);
    setFeedback(null);
    
    const result = await sessionRef.current.verifyTask(lab.verificationPrompt, history);
    
    setVerifying(false);
    if (result.success) {
      setLabStatus('success');
      setFeedback(result.message);
    } else {
      setLabStatus('failed');
      setFeedback(result.message);
    }
  };

  const handleTutorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorInput.trim() || tutorLoading) return;

    const userMsg = tutorInput;
    setTutorInput('');
    setTutorMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setTutorLoading(true);

    const answer = await getTutorResponse(userMsg, `Current Lab: ${lab.title}. Description: ${lab.description}. Tasks: ${lab.tasks.join(', ')}.`);
    
    setTutorMessages(prev => [...prev, { role: 'model', content: answer }]);
    setTutorLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f172a] text-white overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-gray-700 flex items-center justify-between px-4 bg-[#1e293b]">
        <div className="flex items-center space-x-3">
          <Link to="/" className="text-gray-400 hover:text-white transition-colors">
             <div className="flex items-center text-sm font-medium">
                <span className="mr-1">←</span> Back
             </div>
          </Link>
          <div className="h-4 w-[1px] bg-gray-600 mx-2"></div>
          <div className="flex items-center space-x-2">
            <Icon name={course.icon} size={18} className="text-blue-400" />
            <span className="font-semibold hidden sm:inline">{course.title}</span>
            <span className="text-gray-500">/</span>
            <span className="text-blue-200">{lab.title}</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
           <button 
             onClick={() => setTutorOpen(!tutorOpen)}
             className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${tutorOpen ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
           >
             <Icon name="chat" size={16} />
             <span className="hidden sm:inline">AI Tutor</span>
           </button>
           <button 
             onClick={handleVerify}
             disabled={verifying}
             className={`flex items-center space-x-2 px-4 py-1.5 rounded-md text-sm font-bold shadow-lg transition-all
               ${labStatus === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-500'}
               disabled:opacity-50 disabled:cursor-not-allowed
             `}
           >
             {verifying ? (
               <span>Verifying...</span>
             ) : (
               <>
                 <Icon name={labStatus === 'success' ? 'check' : 'play'} size={16} />
                 <span>{labStatus === 'success' ? 'Completed' : 'Check Solution'}</span>
               </>
             )}
           </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Instructions Panel */}
        <div className="w-1/3 min-w-[300px] bg-[#1e293b] border-r border-gray-700 flex flex-col overflow-hidden hidden md:flex">
          <div className="p-6 overflow-y-auto flex-1">
            <div className="flex items-center space-x-2 mb-4">
              <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide
                ${lab.difficulty === 'Beginner' ? 'bg-green-900 text-green-300' : 
                  lab.difficulty === 'Intermediate' ? 'bg-yellow-900 text-yellow-300' : 'bg-red-900 text-red-300'}
              `}>
                {lab.difficulty}
              </span>
            </div>
            <h1 className="text-2xl font-bold mb-4">{lab.title}</h1>
            <p className="text-gray-300 leading-relaxed mb-8">{lab.description}</p>
            
            <div className="bg-[#0f172a] rounded-xl p-5 border border-gray-700 mb-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Tasks</h3>
              <ul className="space-y-4">
                {lab.tasks.map((task, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-700 text-gray-300 flex items-center justify-center text-xs font-mono mr-3 mt-0.5">
                      {idx + 1}
                    </div>
                    <span className="text-gray-200">{task}</span>
                  </li>
                ))}
              </ul>
            </div>

            {feedback && (
               <div className={`p-4 rounded-lg border mb-6 animate-fade-in ${labStatus === 'success' ? 'bg-green-900/20 border-green-800 text-green-200' : 'bg-red-900/20 border-red-800 text-red-200'}`}>
                 <div className="flex items-start">
                    <Icon name={labStatus === 'success' ? 'check' : 'x'} className="mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-bold">{labStatus === 'success' ? 'Success!' : 'Try Again'}</p>
                      <p className="text-sm opacity-90">{feedback}</p>
                    </div>
                 </div>
               </div>
            )}
          </div>
        </div>

        {/* Terminal Panel */}
        <div className="flex-1 flex flex-col relative min-w-0">
          <div className="bg-[#0f172a] px-4 py-2 text-xs text-gray-500 border-b border-gray-800 flex justify-between">
            <span>TERMINAL - {course.category.toUpperCase()} ENVIRONMENT</span>
            <span>bash</span>
          </div>
          <Terminal 
            initialPrompt={lab.initialSystemPrompt} 
            onHistoryChange={setHistory} 
            sessionRef={sessionRef}
          />
        </div>

        {/* Floating Tutor Panel (Overlay or Sidebar) */}
        {tutorOpen && (
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-[#1e293b] border-l border-gray-700 shadow-2xl flex flex-col z-10 animate-slide-in-right">
             <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-[#283549]">
               <h3 className="font-bold flex items-center">
                 <Icon name="chat" className="mr-2 text-blue-400" size={16}/> 
                 AI Mentor
               </h3>
               <button onClick={() => setTutorOpen(false)} className="text-gray-400 hover:text-white">
                 <Icon name="x" size={18} />
               </button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={tutorScrollRef}>
               {tutorMessages.map((msg, i) => (
                 <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[85%] rounded-lg p-3 text-sm ${
                     msg.role === 'user' 
                       ? 'bg-blue-600 text-white' 
                       : 'bg-gray-700 text-gray-200'
                   }`}>
                     {msg.content}
                   </div>
                 </div>
               ))}
               {tutorLoading && (
                 <div className="flex justify-start">
                   <div className="bg-gray-700 rounded-lg p-3 text-sm text-gray-400 italic">
                     Thinking...
                   </div>
                 </div>
               )}
             </div>

             <div className="p-4 border-t border-gray-700 bg-[#1e293b]">
               <form onSubmit={handleTutorSubmit} className="relative">
                 <input 
                   type="text" 
                   value={tutorInput}
                   onChange={e => setTutorInput(e.target.value)}
                   placeholder="Ask for a hint..."
                   className="w-full bg-[#0f172a] border border-gray-600 rounded-lg pl-3 pr-10 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                 />
                 <button 
                   type="submit"
                   disabled={!tutorInput.trim() || tutorLoading}
                   className="absolute right-2 top-1.5 text-blue-400 hover:text-blue-300 disabled:opacity-50"
                 >
                   <Icon name="chevron-right" size={20} />
                 </button>
               </form>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};