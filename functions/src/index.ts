import * as functions from 'firebase-functions';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: functions.config().openai.key,
});

const assistantId = functions.config().openai.assistant_id;
if (!assistantId) {
    throw new Error("Environment variable ASSISTANT_ID is not set.");
}

export const longRunningTask = functions.https.onRequest(async (req, res) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    let threadId: string | null = null;
    try {
        const { userInput } = req.body;

        // Create a thread
        const thread = await openai.beta.threads.create();
        threadId = thread.id;

        // Create a message in the thread
        await openai.beta.threads.messages.create(threadId, {
            role: "user",
            content: userInput,
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
        if (threadId) {
            await openai.beta.threads.del(threadId);
        }
    }
});
