import { Patient, defaultPatient } from '../types/patient';

const STORAGE_KEY = "patient";
    
export function getPatient(): Patient {
    try {
        const found = localStorage.getItem(STORAGE_KEY);
        if (found) {
            return JSON.parse(found);
        }
    } catch {
    }
    return defaultPatient;
}

function setPatient(patient: Patient): Patient {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patient));
    return patient;
}

export function updatePatient(partial: Partial<Patient>) {
    const current = getPatient();
    const updated = { ...current, ...partial };
    return setPatient(updated);
}

export function resetPatient(): Patient {
    return setPatient(defaultPatient);
} 