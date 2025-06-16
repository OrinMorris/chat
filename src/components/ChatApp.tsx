'use client'
import { useState, useEffect, useRef } from "react";
import { Patient, defaultPatient } from '../types/patient';
import { addPatientMessage, processPatientResponse } from '../lib/session';
import { resetPatient } from "../lib/patient";

export default function ChatApp() {
    // State
    const [isMounted, setIsMounted] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [userInput, setUserInput] = useState("");
    const [patient, setPatient] = useState<Patient>(defaultPatient);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Effects
    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [patient?.conversation]);
    
    // Custom chat message handler
    const handleCustomChatMessage = async () => {
        if (!userInput.trim()) return;

        const updatedPatient = {
            ...patient,
            conversation: [
                ...(patient.conversation || []),
                {
                    timestamp: new Date().toISOString(),
                    userInput: userInput,
                    systemResponse: "",
                }
            ]
        };
        setPatient(updatedPatient);
        setUserInput("");
        
        try {
            setIsTyping(true);
            const patientWithSystemResponse = await processPatientResponse(userInput, updatedPatient);
            setPatient(patientWithSystemResponse);
        } catch (error) {
            console.error('Error in chat:', error);
        } finally {
            setIsTyping(false);
        }
    };

    const handleReset = async () => {
        await resetPatient();
        setUserInput("");
        setPatient(defaultPatient);
    };

    // Render
    if (!isMounted) {
        return <div className="p-4">Loading chat...</div>;
    }

    return (
        <main className="h-screen overflow-hidden">
            <div className="grid grid-cols-2 gap-4 p-4 h-full bg-gray-100">
                {/* Patient Panel with Actions */}
                <div className="flex flex-col h-full overflow-hidden">
                    {/* Patient Status */}
                    <div className="bg-white rounded-2xl shadow flex flex-col p-4 h-full overflow-hidden">
                        <h2 className="text-xl font-semibold mb-2">Current Topic: {patient.topic}</h2>
                        
                        {/* Topic Progress */}
                        <div className="mb-4">
                            <h3 className="text-sm font-medium mb-2">Expected Information:</h3>
                            <ul className="text-sm space-y-1">
                                {/* Add expected information based on topic */}
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
                                onClick={handleReset}
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
                <div className="bg-white rounded-2xl shadow flex flex-col p-4 h-full overflow-hidden">
                    <h2 className="text-xl font-semibold mb-4">AI-Powered Chat</h2>

                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4 mb-4">
                        {patient.conversation?.map((entry, index) => (
                            <div key={index}>
                                {/* User Message */}
                                {(!entry.userInput && index === 0 ? null : (
                                    <div className="flex justify-end">
                                        <div className="max-w-md px-4 py-2 rounded-2xl shadow bg-blue-500 text-white rounded-br-none">
                                            {entry.userInput}
                                        </div>
                                    </div>
                                ))}
                                {/* System Response */}
                                {entry.systemResponse && (
                                    <div className="flex justify-start">
                                        <div className="max-w-md px-4 py-2 rounded-2xl shadow bg-gray-200 text-gray-800 rounded-bl-none">
                                            {entry.systemResponse}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

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

export async function callOpenAI(instructions: string, input: string): Promise<string> {
    const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ instructions, message: input }),
    });

    if (!response.ok) {
        throw new Error('Failed to get response from OpenAI');
    }

    const data = await response.json();
    return data.response;
} 