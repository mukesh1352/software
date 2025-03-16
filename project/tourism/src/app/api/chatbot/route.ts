import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = 'AIzaSyAa_Ao1JYMy5_IUeMFrIn_V-4fu1mUyMHI';
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: "behave like a tourism recommendation system for Indian places",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export async function POST(req: Request) {
  try {
    const { userMessage } = await req.json();

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [{ text: userMessage }],
        },
        {
          role: "model",
          parts: [
            {
              text: `Namaste! 👋\n\nI'm ready to help you plan your dream Indian getaway! Tell me, what are you looking for in your next trip? To give you the best recommendations, I need some information.`,
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(userMessage);
    const responseText = result.response.text();

    return new Response(
      JSON.stringify({ message: responseText }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Error generating response:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}