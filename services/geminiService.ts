import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DogData } from "../types";

const SYSTEM_INSTRUCTION = `
You are an expert cynologist (dog expert) and AI vision assistant. 
Your task is to analyze images of dogs and identify their breed with high precision.

In addition to identification, you must infer the "Ideal Owner Profile" (Honden Keuzehulp) for this breed based on the following specific logic:

1. **Housing (Hoe woon je?)**:
   - 'Appartement': Small/low energy dogs suitable for apartments.
   - 'Rijtjeshuis': Medium dogs needing a small garden.
   - 'Vrijstaand': Large/active dogs needing space/large garden.

2. **Experience (Wat is je ervaring?)**:
   - 'Beginner': Easy going, trainable dogs.
   - 'Gemiddeld': Dogs needing some structure.
   - 'Expert': Difficult, dominant, or working breeds.

3. **Activity (Hoe actief ben je?)**:
   - 'Niet echt actief': <1h exercise/day.
   - 'Gemiddeld': 1-1.5h exercise/day.
   - 'Actief': >2h exercise/day.
   - 'Topsport': Needs intensive running/cycling.

4. **Children (Heb je kinderen?)**:
   - 'Ja': Child-friendly breeds.
   - 'Nee': Breeds not recommended for families with children.

5. **Allergies (Allergieën?)**:
   - 'Ja': Hypoallergenic breeds (suitable for allergic owners).
   - 'Nee': Shedding breeds (requires owner with NO allergies).

You must return the data in a strict JSON format.
If the image is NOT a dog, return a low certainty score and indicate it in the description.
`;

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    breed: { type: Type.STRING, description: "The primary identified breed name." },
    certainty: { type: Type.NUMBER, description: "Confidence score between 0 and 100." },
    estimatedWeight: { type: Type.STRING, description: "Estimated weight range in kg (e.g. '25-30 kg')." },
    estimatedAge: { type: Type.STRING, description: "Estimated age category (e.g. 'Puppy', 'Adult', 'Senior')." },
    description: { type: Type.STRING, description: "A brief professional description of the visual characteristics observed." },
    characteristics: {
      type: Type.OBJECT,
      properties: {
        livingSituation: { type: Type.STRING, enum: ['Appartement', 'Rijtjeshuis', 'Vrijstaand'] },
        experienceLevel: { type: Type.STRING, enum: ['Beginner', 'Gemiddeld', 'Expert'] },
        activityLevel: { type: Type.STRING, enum: ['Niet echt actief', 'Gemiddeld', 'Actief', 'Topsport'] },
        childrenCompatible: { type: Type.STRING, enum: ['Nee', 'Ja'] },
        allergyFriendly: { type: Type.STRING, enum: ['Nee', 'Ja'] },
      },
      required: ["livingSituation", "experienceLevel", "activityLevel", "childrenCompatible", "allergyFriendly"]
    },
    possibleBreeds: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          breed: { type: Type.STRING },
          percentage: { type: Type.NUMBER },
        },
      },
    },
  },
  required: ["breed", "certainty", "estimatedWeight", "estimatedAge", "description", "possibleBreeds", "characteristics"],
};

export const identifyDogBreed = async (base64Image: string, mimeType: string = 'image/jpeg'): Promise<DogData> => {
  try {
    // The build process (Vite) will replace process.env.API_KEY with the actual key string
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
      throw new Error("API Key not found. Please ensure the API_KEY environment variable is set during build/deployment.");
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          {
            text: "Analyze this image and identify the dog breed.",
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.4,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response text received from Gemini");

    const data = JSON.parse(text) as DogData;
    return data;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};