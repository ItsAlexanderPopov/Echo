import { connectToDB } from "@utils/database";
import Prompt from '@models/prompt'

export const GET = async (request) => {
    try {
        await connectToDB()

        const prompts = await Prompt.find({}).populate('creator')

        return new Response(JSON.stringify(prompts), { 
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0',
            }
        })
    } catch (error) {
        console.error("Error fetching prompts:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch prompts", details: error.message }), { 
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0',
            }
        })
    }
}