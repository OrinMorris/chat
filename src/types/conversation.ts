import { Patient } from "./patient";

export type ConversationEntry = {
    timestamp: string;
    message: string;
    role: "user" | "system";
};

export type Conversation = {
    conversation?: ConversationEntry[];
};

export const defaultConversation: Conversation = {
    conversation: [ { timestamp: new Date().toISOString(), message: "Hello!", role: "system" } ]
}; 

export function addConversationEntry(conversation: Conversation, message: string, role: "user" | "system"): Conversation {
    return {
        conversation: [
            ...(conversation.conversation || []),
            { timestamp: new Date().toISOString(), message, role }
        ]
    };
}
