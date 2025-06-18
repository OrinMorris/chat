import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { cookies } from 'next/headers';
import { SessionData } from '@/src/types/session';
import { generateSystemResponse, updateCurrentSession } from '@/src/server/session';
import { defaultPatient } from '@/src/types/patient';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// ========================================================================================================
// Session State Management
// ========================================================================================================

const SESSION_KEY = 'session_id';

async function setSessionCookie(sessionData: SessionData) {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_KEY, JSON.stringify(sessionData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
    });
}

export async function getSessionCookie(): Promise<SessionData> {
    const cookieStore = await cookies();
    const sessionData = cookieStore.get(SESSION_KEY)?.value;
    
    try {
        if (sessionData) {  
            return JSON.parse(sessionData) as SessionData;
        }
    } catch (e) {
        console.error('Failed to parse session data:', e);
    }

    return {
        sessionId: crypto.randomUUID(),
        patient: defaultPatient,
        lastUpdated: new Date().toISOString()
    };
}

async function deleteSessionCookie() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_KEY);
}

// ========================================================================================================
// Session State Management
// ========================================================================================================

export async function POST(req: Request) {
    try {
        const { message } = await req.json();
        const currentSession: SessionData = await getSessionCookie();

        const updatedSession = updateCurrentSession(message, currentSession);
        setSessionCookie(updatedSession);

        const systemResponse = generateSystemResponse(message, updatedSession);        
        return NextResponse.json({ response: systemResponse, session: currentSession });

    } catch (error) {
        console.error('Session API error', error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        await deleteSessionCookie();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error resetting session:', error);
        return NextResponse.json({ error: 'Failed to reset session' }, { status: 500 });
    }
} 


