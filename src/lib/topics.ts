import { Patient } from '../types/patient';
import { Topics, Topic } from '../types/topic';


const systemResponsePrompt: string = 
        "Acting as a medical chatbot, inspect the following topic prompt and recent patient conversation to generate an appropriate next message for the patient.";

const patientDataPrompt1: string = 
        "Inspect the conversation between a medical chatbot and the patient to determine if the intended topic has been completed and all " +
        "required data has been collected. Generate a JSON object representing the collected data. Each property in the JSON should correspond " +
        "to a specific data element, with its value set to the value colleted or computed during the conversation." +
        "Add a `\"status\"` property to the object with one of the following values:" +
        "- `\"complete\"` if all required data has been collected and the topic has been fully addressed," +
        "- `\"incomplete\"` if more information is needed to complete the topic," +
        "- `\"stop\"` if the patient has indicated they wish to discontinue or abandon the topic." +
        "please return only valid JSON and nothing else.";

const patientDataPrompt: string = 
        "Summarize the data in this chat conversation, extract the supplied data into the JSON object below. Don't invent any additional coversation " +
        "Set the `\"status\"` property to one of the following values:" +
        "- `\"complete\"` if all required data has been collected and the topic has been fully addressed," +
        "- `\"incomplete\"` if more information is needed to complete the topic," +
        "- `\"stop\"` if the patient has indicated they wish to discontinue or abandon the topic." +
        "please return only valid JSON and nothing else.";

export function lookupTopic(name: string): Topic | undefined {
    return Topics.find(topic => topic.name === name);
}

export function generateSystemResponse(patient: Patient, topic: Topic): string {

    const conversationHistory = patient.conversation
    ?.map(entry => `User: ${entry.userInput}\nSystem: ${entry.systemResponse}`)
    .join('\n') || '';

    return `${systemResponsePrompt}\n\n prompt=${topic.prompt}\"\n\nConversation History:\n${conversationHistory}\n\n`;
}

export function extractPatientData(patient: Patient, topic: Topic): string {

    const conversationHistory = patient.conversation
    ?.map(entry => `User: ${entry.userInput}\nSystem: ${entry.systemResponse}`)
    .join('\n') || '';

    return `${patientDataPrompt}\n\n JSON output=${topic.data}\"\n\nConversation History:\n${conversationHistory}\n\n`;
}


