'use client'
import { useState, useEffect, useRef } from "react";
import { Patient } from '../types/patient';
import { Message } from '../types/message';
import { handleChatMessage, handleReset } from '../lib/chatbot';
import { usePersistedState } from '../lib/hooks';

export default function ChatApp() {
    // State
    const [isMounted, setIsMounted] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [userInput, setUserInput] = useState("");
    const [chatLog, setChatLog] = usePersistedState<Message[]>("chat", []);
    const [patient, setPatientState] = useState<Patient>();
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Effects
    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatLog]);
    
    useEffect(() => {
        localStorage.setItem("feedbackLog", JSON.stringify(patient));   
    }, [patient]);
   
    // Custom chat message handler
    const handleCustomChatMessage = async () => {
        if (!userInput.trim()) return;

        setUserInput("");
        setIsTyping(true);
        
        try {
            const systemResponse = await handleChatMessage(
                userInput,
                setUserInput,
                setChatLog,
                setIsTyping,
                setPatientState
            );

        } catch (error) {
            console.error('Error in chat:', error);
            setChatLog(prev => [
                ...prev,
                { source: "system", content: "I apologize, but I encountered an error. Could you please try again?" }
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    // Render
    if (!isMounted) {
        return <div className="p-4">Loading chat...</div>;
    }

    return (
        <main>
            <div className="grid grid-cols-2 gap-4 p-4 h-screen bg-gray-100">
                {/* Patient Panel with Actions */}
                <div className="flex flex-col h-full">
                    {/* Patient Status */}
                    <div className="bg-white rounded-2xl shadow flex flex-col p-4 h-full">
                        <h2 className="text-xl font-semibold mb-2">Current Topic: Foobar</h2>
                        
                        {/* Topic Progress */}
                        <div className="mb-4">
                            <h3 className="text-sm font-medium mb-2">Expected Information:</h3>
                            <ul className="text-sm space-y-1">
                              
                            </ul>
                        </div>

                        {/* Patient Info Display */}
                        <div className="flex-1 overflow-y-auto">
                            <h3 className="text-sm font-medium mb-2">Collected Information:</h3>
                            <pre className="text-sm text-gray-800 bg-gray-50 p-2 rounded">
                                {JSON.stringify(patient, null, 2)}
                            </pre>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                className="bg-gray-300 hover:bg-red-300 text-sm px-3 py-1 rounded shadow"
                                onClick={() => handleReset(setUserInput, setChatLog)}
                            >
                                Reset
                            </button>

                            <button
                                className="bg-gray-300 hover:bg-blue-300 text-sm px-3 py-1 rounded shadow"
                            >
                                Next Topic
                            </button>
                        </div>
                    </div>
                </div>

                {/* Chat Window */}            
                <div className="bg-white rounded-2xl shadow flex flex-col p-4 h-full overflow-y-auto">
                    <h2 className="text-xl font-semibold mb-4">AI-Powered Chat</h2>

                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-2 mb-4">
                        {chatLog.map((entry, index) => {
                            const isUser = entry.source === "user";
                            const content = entry.content; 
                            return (
                                <div
                                    key={index}
                                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-md px-4 py-2 rounded-2xl shadow ${
                                            isUser
                                                ? 'bg-blue-500 text-white rounded-br-none'
                                                : 'bg-gray-200 text-gray-800 rounded-bl-none'
                                        }`}
                                    >
                                        {content}
                                    </div>
                                </div>
                            );
                        })}

                        {isTyping && (
                            <div className="bg-gray-200 px-4 py-2 rounded-2xl max-w-xs self-start flex items-center gap-1">
                                <span className="dot-flashing" />
                                <span className="dot-flashing" style={{ animationDelay: "0.2s" }} />
                                <span className="dot-flashing" style={{ animationDelay: "0.4s" }} />
                            </div>
                        )}
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleCustomChatMessage();
                        }}
                        className="flex gap-2"
                    >
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            className="flex-1 border rounded-xl px-3 py-2"
                            placeholder="Type your message..."
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-xl"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
} 