import { Topic } from '../types/topic';

export type ConversationEntry = {
    timestamp: string;
    userMessage: string;
    systemResponse: string;
};

export type Patient = {
    name: string;
    height: string;
    weight: string;
    topics: Topic[];
    conversation?: ConversationEntry[];
};

export const defaultPatient: Patient = {
    name: "",
    height: "",
    weight: "",
    topics: [],
    conversation: []
}; 