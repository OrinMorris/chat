import { Message } from '../types/message';

export type Topic = {
    id: string;
    generateMessage: string;
    processResponse: string;
    conversation: Message[];
    data: {
        key: string;
        description: string;
        required: boolean;
    }[];
    status: "incomplete" | "completed" | "failed";
};

export const chatTopics: Topic[] = [
    {
        id: "height-weight",
        generateMessage: "Acting as a medical chatbot inspect the past conversation on this JSON object and generate a response that attempts to get the patient to answer the fields in this data object",
        processResponse: "Using the conversation as input ",
        conversation: [],
        data: [
            { key: "height", description: "Patient's height",  required: true },
            { key: "weight", description: "Patient's weight",  required: true }
        ],
        status: "incomplete"
    }
]; 