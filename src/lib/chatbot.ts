import { Message } from '../types/message';
import { Patient } from '../types/patient';
import { updatePatient } from './patient';

export async function callOpenAI(input: string): Promise<string> {
    const res = await fetch("/openai", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    return data.response;
}

export async function handleChatMessage(
    userInput: string,
    setUserInput: (input: string) => void,
    setChatLog: (updater: (prev: Message[]) => Message[]) => void,
    setIsTyping: (isTyping: boolean) => void,
    setPatientState: (patient: Patient) => void
): Promise<string> {
    if (!userInput.trim()) 
        return "";

    setUserInput("");
    setChatLog((prev) => [
        ...prev,
        { source: "user", content: userInput }
    ]);

    setIsTyping(true);
    
    try {
        const systemResponse = await callOpenAI(userInput);
        setChatLog((prev) => [
            ...prev,
            { source: "system", content: systemResponse }
        ]);

        // Update patient with conversation history
        const partialUpdate: Partial<Patient> = {
            height: "5'10",
            conversation: [
                {
                    timestamp: new Date().toISOString(),
                    userMessage: userInput,
                    systemResponse: systemResponse
                }
            ]
        };

        // Get current patient state and append to conversation
        const currentPatient = localStorage.getItem("patient");
        if (currentPatient) {
            const parsedPatient = JSON.parse(currentPatient) as Patient;
            if (parsedPatient.conversation) {
                partialUpdate.conversation = [
                    ...parsedPatient.conversation,
                    {
                        timestamp: new Date().toISOString(),
                        userMessage: userInput,
                        systemResponse: systemResponse
                    }
                ];
            }
        }

        setPatientState(updatePatient(partialUpdate));
        return systemResponse;
    } finally {
        setIsTyping(false);
    }
}

export function handleReset(
    setUserInput: (input: string) => void,
    setChatLog: (updater: (prev: Message[]) => Message[]) => void
) {
    setUserInput("");
    setChatLog(() => []);
    localStorage.removeItem("chat");
} 