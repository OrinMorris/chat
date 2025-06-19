
import { SessionData } from "../types/session";


// ========================================================================================================
// Generate the Messages and extract the data
// ========================================================================================================

export function updateCurrentSession(message: string, session: SessionData): SessionData {
    return session;
}

export function generateSystemResponse(message: string, session: SessionData):  string {
    return "system response";
}


export async function callGenerateSystemResponse(input: string): Promise<string> {
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: input }),
    });

    if (!response.ok) {
        throw new Error('Failed to get response from server');
    }

    const data = await response.json();
    return data.response;
}
