import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // make sure this is set
});

const conversation = `
Patient: This morning I checked my blood sugar and it was 135.
Chatbot: Got it. Anything else you’d like to share?
Patient: I weighed myself too — 202 pounds.
Chatbot: Any exercise today?
Patient: Not yet, maybe later.
`;

const response = await openai.chat.completions.create({
  model: "gpt-4",
  temperature: 0.3,
  messages: [
    {
      role: "system",
      content: `You are a medical assistant. Extract all patient-reported health metrics from the conversation.`,
    },
    {
      role: "user",
      content: `Conversation:\n${conversation}\n\nInstructions: 
Extract all structured health metrics (like blood glucose, weight, blood pressure, mood, exercise, etc.) and return them as a JSON object. 

Each metric should be a field. Add a "status" field:
- "complete" if all expected metrics are captured,
- "incomplete" if some common metrics are missing,
- "stop" if the patient abandoned the topic.`,
    },
  ],
});
