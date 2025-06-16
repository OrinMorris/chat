import { defaultPatient, Patient } from '../types/patient';
import { getPatient, setPatient } from './patient';
import { extractPatientData, generateSystemResponse, lookupTopic } from './topics';
import OpenAI from 'openai';

export async function addPatientMessage(userInput: string): Promise<Patient> {
    const patient = await getPatient() || defaultPatient;
    
    if (patient.conversation) {
        patient.conversation = [
            ...patient.conversation,
            {
                timestamp: new Date().toISOString(),
                userInput: userInput,
                systemResponse: "",
            }
        ];
    }

    await setPatient(patient);
    return patient;
}

export async function addSystemMessage(userInput: string, systemResponse: string, patient: Patient): Promise<Patient> {
    if (!patient.conversation || patient.conversation.length === 0) 
        return patient;
    
    const lastIndex = patient.conversation.length - 1;
    const lastEntry = patient.conversation[lastIndex];
    
    const updatedPatient = lastEntry.userInput !== userInput 
        ? {
            ...patient,
            conversation: [
                ...patient.conversation,
                {
                    timestamp: new Date().toISOString(),
                    userInput: userInput,
                    systemResponse: systemResponse,
                }
            ]
        }
        : {
            ...patient,
            conversation: patient.conversation.map((entry, i) => 
                i === lastIndex 
                    ? { ...entry, systemResponse }
                    : entry
            )
        };

    setPatient(updatedPatient);
    return updatedPatient;
}

export async function generateChatResponse(instructions: string, input: string): Promise<string> {
    const response = await fetch('/api/openai/chat', {
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

export async function processPatientResponse(input: string, patient: Patient): Promise<Patient> {
    const currentTopic = lookupTopic(patient.topic);

    if (!currentTopic) {
        const systemResponse = "nothing left to talk about";
        return addSystemMessage(input, systemResponse, patient);
    } else {
        const instructions = "Work as a clinical chatbot assistant to request the patients's weight in pounds and height in feet and inches. Don't discuss other topics";
        const systemResponse = await generateChatResponse(instructions, input);
        return addSystemMessage(input, systemResponse, patient);
    }
} 

export async function extractChatData(instructions: string, metrics: string, conversation: string): Promise<string> {
    const response = await fetch('/api/openai/extract', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ instructions, metrics: metrics, conversation: conversation }),
    });

    if (!response.ok) {
        throw new Error('Failed to get response from OpenAI');
    }

    const data = await response.json();
    return data.response;
}
