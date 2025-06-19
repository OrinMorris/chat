import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getResponseIdCookie } from "../../chat/route";


export async function POST(req: Request) {
  try {
    const { message, metrics } = await req.json();

    if (!metrics || typeof metrics !== "string") {
      return NextResponse.json({ error: "Missing or invalid 'metrics' parameter" }, { status: 400 });
    }

    const metricList = metrics.split(',').map(m => m.trim()).filter(Boolean);

    const jsonTemplate = metricList.map(metric => `"${metric}": "<value or null>"`).join(",\n  ");
    const metricExtractionInstructions = `
You are a clinical assistant. Extract the values for the following metrics mentioned in the conversation: ${metricList.join(", ")}.

Respond only in a JSON object with the following format:
{
  ${jsonTemplate},
  "status": "complete" | "incomplete"
}

Only return this JSON object and nothing else. 
"status" should be "complete" if ALL of the following metrics are present: ${metricList.join(", ")}.
    `.trim();

    const previousResponseId = await getResponseIdCookie();

    const response = await new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    }).chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: metricExtractionInstructions },
        { role: "user", content: message }
      ]
    });

    const outputText = response.choices[0].message?.content || "";

    let extractedData = null;
    try {
      extractedData = JSON.parse(outputText);
    } catch (e) {
      extractedData = { error: "Failed to parse LLM output" };
    }

    return NextResponse.json({
      response: outputText,
      metrics: extractedData,
      responseID: response.id
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

