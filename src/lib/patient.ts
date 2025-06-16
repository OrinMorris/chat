import { defaultPatient, Patient } from '../types/patient';

const PATIENT_KEY = 'patient';

export function getPatient(): Patient {
    if (typeof window === 'undefined') 
        return defaultPatient;

    const stored = localStorage.getItem(PATIENT_KEY);
    return stored ? JSON.parse(stored) : null;
}

export function setPatient(patient: Patient): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(PATIENT_KEY, JSON.stringify(patient));
}

export async function resetPatient(): Promise<void> {
    
    if (typeof window === 'undefined') 
        return;
    
    localStorage.removeItem(PATIENT_KEY);

    try {
        await fetch('/api/openai', { method: 'DELETE' });
    } catch (error) {
        console.error('Error resetting response ID:', error);
    }
} 
