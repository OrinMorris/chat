'use client'
import { useState, useEffect, useRef } from "react";
import { addConversationEntry, Conversation, defaultConversation } from "../types/conversation";
import { resetConversation, loadConversation, storeConversation } from "../lib/conversation";
import { callGenerateSystemResponse } from "../server/session";
import { get } from "http";

export default function ChatApp() {
    // State
    const [isMounted, setIsMounted] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [userInput, setUserInput] = useState("");
    const [conversation, setConversation] = useState<Conversation>(defaultConversation);

    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Effects
    useEffect(() => {
        setIsMounted(true);
        const storedConversation = loadConversation();
        if (storedConversation) {
            setConversation(storedConversation);
        }
    }, []);
    
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [conversation]);
    
    // Custom chat message handler
    const handleCustomChatMessage = async () => {
        const updatedConversation = addConversationEntry(conversation, userInput, "user");
        setConversation(updatedConversation);
        storeConversation(updatedConversation); // Save to localStorage
        setUserInput("");
        try {
            setIsTyping(true);
            const response = await callGenerateSystemResponse(userInput);
            const responseConversation = addConversationEntry(updatedConversation, response, "system");
            setConversation(responseConversation);
            storeConversation(responseConversation);
        } catch (error) {
            console.error('Error in chat:', error);
        } finally {
            setIsTyping(false);
        }
    };

    const handleReset = async () => {
        await resetConversation();
        setUserInput("");
        setConversation(defaultConversation);
    };

    // Render
    if (!isMounted) {
        return <div className="p-4">Loading chat...</div>;
    }

    return (
        <main className="h-screen overflow-hidden">
            <div className="grid grid-cols-2 gap-4 p-4 h-full bg-gray-100">
                <div className="flex flex-col h-full overflow-hidden">
                    <div className="bg-white rounded-2xl shadow flex flex-col p-4 h-full overflow-hidden">
                        <h2 className="text-xl font-semibold mb-2">Current Topic: @@@@</h2>
                        
                        <div className="mb-4">
                            <h3 className="text-sm font-medium mb-2">Expected Information:</h3>
                            <ul className="text-sm space-y-1">
                                {/* Add expected information based on topic */}
                            </ul>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <h3 className="text-sm font-medium mb-2">Collected Information:</h3>
                            <pre className="text-sm text-gray-800 bg-gray-50 p-2 rounded">
                                {JSON.stringify(conversation, null, 2)}
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
                        {conversation.conversation?.map((entry, index) => (
                            <div key={index}>
                                {/* User Message */}
                                {(entry.role === "user" ? (
                                    <div className="flex justify-end">
                                        <div className="max-w-md px-4 py-2 rounded-2xl shadow bg-blue-500 text-white rounded-br-none">
                                            {entry.message}
                                        </div>
                                    </div>
                                ) : null)}
                                {/* System Response */}
                                {entry.role === "system" ? (
                                    <div className="flex justify-start">
                                        <div className="max-w-md px-4 py-2 rounded-2xl shadow bg-gray-200 text-gray-800 rounded-bl-none">
                                            {entry.message}
                                        </div>
                                    </div>
                                ) : null }
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
