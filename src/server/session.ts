
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

