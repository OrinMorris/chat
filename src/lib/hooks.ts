import { useState, useEffect } from 'react';
import { ChatTopic } from '../types/chatTopic';

export function usePersistedState<T>(key: string, initialValue: T) {
    const [state, setState] = useState<T>(() => {
        if (typeof window === "undefined") return initialValue;
        try {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : initialValue;
        } catch {
            return initialValue;
        }
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    return [state, setState] as const;
}

export function useChatTopic(topics: ChatTopic[]) {
    const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
    const [patientInfo, setPatientInfo] = useState<Record<string, any>>({});
    const [isTopicComplete, setIsTopicComplete] = useState(false);

    const currentTopic = topics[currentTopicIndex];

    useEffect(() => {
        setIsTopicComplete(currentTopic.isComplete(patientInfo));
    }, [currentTopic, patientInfo]);

    const moveToNextTopic = () => {
        if (currentTopicIndex < topics.length - 1) {
            setCurrentTopicIndex(prev => prev + 1);
            setIsTopicComplete(false);
        }
    };

    const updatePatientInfo = (newInfo: Record<string, any>) => {
        setPatientInfo(prev => ({ ...prev, ...newInfo }));
    };

    return {
        currentTopic,
        patientInfo,
        isTopicComplete,
        moveToNextTopic,
        updatePatientInfo,
        hasMoreTopics: currentTopicIndex < topics.length - 1
    };
} 