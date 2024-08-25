import { connectToDB } from "@utils/database";
import Prompt from '@models/prompt'

export const GET = async (request, { params }) => {
    try {
        await connectToDB()
        const prompts = await Prompt.find({creator: params.id}).populate('creator')
        return new Response(JSON.stringify(prompts), { status: 200 })
    } catch (error) {
        return new Response("Failed to fetch prompt", { status: 500 })
    }
} 

// compared to the default route file GET request,
// this one gives data specifically for the user's data