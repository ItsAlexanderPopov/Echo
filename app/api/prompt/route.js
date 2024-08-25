import { connectToDB } from "@utils/database";
import Prompt from '@models/prompt';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        await connectToDB();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 9;
        const skip = (page - 1) * limit;
        const year = searchParams.get('year');  // Get the year from query parameters

        console.log(`Year parameter received: ${year}, Type: ${typeof year}`);

        // Debug log for page and limit
        console.log(`Page: ${page}, Limit: ${limit}, Skip: ${skip}`);

        // Fetch prompts based on the selected year, if provided
        const query = year ? { date: { $regex: `${year}` } } : {};

        console.log(`Query for fetching prompts: ${JSON.stringify(query)}`);

        const prompts = await Prompt.find(query)
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit)
            .populate('creator')
            .lean();

        console.log(`Prompts fetched: ${JSON.stringify(prompts)}`);
        
        const total = await Prompt.countDocuments(query);
        
        console.log(`Total prompts count: ${total}`);

        const hasMore = skip + prompts.length < total;

        // Fetch distinct years
        const availableYears = await Prompt.aggregate([
            {
                $project: {
                    year: { $substr: ["$date", 6, 4] } // Extract year from the date string
                }
            },
            {
                $group: {
                    _id: "$year"
                }
            },
            { $sort: { _id: -1 } }
        ]);

        console.log(`Available years: ${JSON.stringify(availableYears.map(y => y._id))}`);

        return new Response(JSON.stringify({ 
            prompts, 
            total, 
            page, 
            limit,
            hasMore,
            availableYears: availableYears.map(y => y._id), // Convert to array of years
        }), { 
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0',
            }
        });
    } catch (error) {
        console.error("Error fetching prompts:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch prompts", details: error.message }), { 
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0',
            }
        });
    }
}
