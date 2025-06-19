import { defaultConversation, Conversation } from '../types/conversation';

const conversation_KEY = 'conversation';

export function loadConversation(): Conversation {
    if (typeof window === 'undefined') 
        return defaultConversation;

    const stored = localStorage.getItem(conversation_KEY);

    console.log("stored", stored);
    return stored ? JSON.parse(stored) : defaultConversation;
}

export function storeConversation(conversation: Conversation): void {
    console.log("setting conversation", conversation);
    localStorage.setItem(conversation_KEY, JSON.stringify(conversation));
}

export async function resetConversation(): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(conversation_KEY);
    try {
        await fetch('/api/chat', { method: 'DELETE' });
    } catch (error) {
        console.error('Error resetting conversation:', error);
    }
} 
