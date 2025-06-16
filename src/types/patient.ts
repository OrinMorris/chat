import { Topic } from '../types/topic';

export type ConversationEntry = {
    timestamp: string;
    userInput: string;
    systemResponse: string;
};

export type Patient = {
    topic: string;
    data: string;
    conversation?: ConversationEntry[];
};

export const defaultPatient: Patient = {
    topic: "weight",
    data: "",
    conversation: [ { timestamp: new Date().toISOString(), userInput: "", systemResponse: "Hello!" } ]
}; 