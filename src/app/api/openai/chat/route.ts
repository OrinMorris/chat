import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { cookies } from 'next/headers';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const RESPONSE_ID_KEY = 'response_id';

async function setResponseIdCookie(responseId: string) {
    const cookieStore = await cookies();
    cookieStore.set(RESPONSE_ID_KEY, responseId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
    });
}

export async function getResponseIdCookie(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(RESPONSE_ID_KEY)?.value;
}

async function deleteResponseIdCookie() {
    const cookieStore = await cookies();
    cookieStore.delete(RESPONSE_ID_KEY);
    console.log("[OpenAI]:Deleted Response ID Cookie");
}

export async function POST(req: Request) {
    try {
        const { instructions, message } = await req.json();
        
        const previousResponseId = await getResponseIdCookie();
        const request = {
            model: "gpt-4",
            input: message,
            store: true,
            instructions: instructions,
            previous_response_id: previousResponseId
        }

        console.log("[OpenAI]:Input\n", request, "\n");
        const response = await openai.responses.create(request);
        
        console.log("[OpenAI]:Output=\n", response, "\n");
        await setResponseIdCookie(response.id);

        return NextResponse.json({ response: response.output_text, responseID: response.id });
    } catch (error) {
        console.error('OpenAI API error:', error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        await deleteResponseIdCookie();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error resetting response ID:', error);
        return NextResponse.json({ error: 'Failed to reset response ID' }, { status: 500 });
    }
} 


