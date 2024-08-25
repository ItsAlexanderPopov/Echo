import { connectToDB } from "@utils/database";
import Prompt from '@models/prompt'

export const GET = async (request) => {
    try {
        await connectToDB()

        console.log("Fetching prompts from database...");
        const prompts = await Prompt.find({})
            .sort({ date: -1 })  // Sort by date field, newest first
            .populate('creator')
        
        console.log(`Fetched ${prompts.length} prompts`);

        // Log the first few prompts for debugging
        console.log("First few prompts:", prompts.slice(0, 3).map(p => ({
            id: p._id,
            title: p.title,
            date: p.date,
            creatorName: p.creator
        })));

        return new Response(JSON.stringify(prompts), { 
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            }
        })
    } catch (error) {
        console.error("Error fetching prompts:", error);
        return new Response("Failed to fetch all prompts", { status: 500 })
    }
}