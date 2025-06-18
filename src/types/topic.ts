
export type Topic = {
    name: string;
    prompt: string;
    metrics: string;
    status: "incomplete" | "completed" | "stop";
};

export const Topics = {
    weight: {
        name: "weight",
        metrics: "height, weight, bmi",     
        prompt: 
            "Work as a clinical chatbot assistant to request the patients's weight in pounds and height in feet and inches, share the computed BMI and category. Don't discuss other topics",
        status: "incomplete"
        },
    a1c: {
        name: "a1c",
        metrics: "a1c",     
        prompt: 
            "Work as a clinical chatbot assistant to request the patients's A1C level provide insight based on the range and weight/bmi collected earlier. Don't discuss other topics",
        status: "incomplete"
    },
}; 







