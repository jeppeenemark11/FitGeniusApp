import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// Initialize OpenAI client with the API Keyy
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const assistantId = process.env.ASSISTANT_ID; 
if (!assistantId) {
    throw new Error("Environment variable ASSISTANT_ID is not set.");
}

export const config = {
    maxDuration: 60,
  };
   

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }
   
    let threadId = null; // To store the thread ID
    try {
        const { userInput } = req.body;

        // Create a thread
        const thread = await openai.beta.threads.create();
        threadId = thread.id; // Store the thread ID for later cleanup
       

        // Create a message in the thread
        await openai.beta.threads.messages.create(threadId, {
            role: "user",
            content: userInput
        });
       

        // Start running the thread with the assistant

        let run = await openai.beta.threads.runs.createAndPoll(threadId, {
            assistant_id: assistantId as string,
        });

        if (run.status === 'completed') {
            const messages = await openai.beta.threads.messages.list(threadId);

            // Find the first response message with text content and send it back to the client
            const responseMessage = messages.data.find(message => message.role === 'assistant' && message.content[0] && message.content[0].type === 'text');
      
            if (responseMessage && responseMessage.content[0].type === "text") {
                // Strip away the Markdown code block syntax to extract the JSON
                const jsonText = responseMessage.content[0].text.value.replace(/```json|```/g, "").trim();
                const responseData = JSON.parse(jsonText);
                res.status(200).json({ workouts: responseData.workouts });
            } else {
                res.status(404).json({ error: 'No response found' });
            }
        } else {
            res.status(200).json({ status: run.status });
        }
    } catch (error) {
        console.error("Failed to process the request:", error);
        res.status(500).json({ error: 'Failed to process the request' });
    } finally {
        // Cleanup: delete the thread if it was created
        if (threadId) {
            await openai.beta.threads.del(threadId);
        }
    }
}
