
export type Topic = {
    name: string;
    prompt: string;
    data: string;
    status: "incomplete" | "completed" | "stop";
};

export const Topics: Topic[] = [
    {
        name: "weight",
        prompt: 
            "request the patient's height in feet and inches and their weight in pounds in a conversational manner." +
            "the height and weights should be for normal adult ranges, suggest a correction if the numbers are not within the normal ranges. " +
            "review the conversation thread and generate a response based on the last patient message. " +
            "don't discuss any off topic items. ",
        data: 
            "{ height: \"\", weight: \"\", status: \"incomplete\"}",     
        status: "incomplete"
    }
]; 




//"Greet the patient and collect their current weight in pounds and height in feet and inches. These values should be reasonable for an adult." +
//"Confirm any issues with the values before moving on to the next topic."





