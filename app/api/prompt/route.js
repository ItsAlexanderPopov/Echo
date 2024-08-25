import { connectToDB } from "@utils/database";
import Prompt from '@models/prompt';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        await connectToDB();

        const { searchParams } = new URL(request.url);
        const page = Math.max(1, parseInt(searchParams.get('page')) || 1); // Ensure page is at least 1
        const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit')) || 9)); // Limit between 1 and 100
        const skip = (page - 1) * limit;

        const prompts = await Prompt.find({})
            .sort({ date: -1, _id: -1 }) // Sort by date and _id to ensure consistent ordering
            .skip(skip)
            .limit(limit)
            .populate('creator')
            .lean();

        const total = await Prompt.countDocuments();
        const hasMore = skip + prompts.length < total;

        console.log(`Fetched ${prompts.length} prompts. Total prompts: ${total}. Page: ${page}, Limit: ${limit}, Has more: ${hasMore}`);

        return new Response(JSON.stringify({ 
            prompts, 
            total, 
            page, 
            limit,
            hasMore
        }), { 
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0',
            }
        });
    } catch (error) {
        console.error("Error fetching prompts:", error.message, error.stack);
        return new Response(JSON.stringify({ error: "Failed to fetch prompts", details: error.message }), { 
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0',
            }
        });
    }
}
