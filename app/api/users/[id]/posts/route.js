import { connectToDB } from "@utils/database";
import Prompt from '@models/prompt'

// Get data specifically for the user's data
export const GET = async (request, { params }) => {
    try {
        await connectToDB()
        const prompts = await Prompt.find({creator: params.id}).populate('creator')
        return new Response(JSON.stringify(prompts), { status: 200 })
    } catch (error) {
        return new Response("Failed to fetch prompt", { status: 500 })
    }
} 
