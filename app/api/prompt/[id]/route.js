import { connectToDB } from "@utils/database";
import Prompt from '@models/prompt'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@app/api/auth/[...nextauth]/route"

export const GET = async (request, { params }) => {
    const maxRetries = 3;
  
    async function fetchDataWithRetries() {
      for (let retry = 0; retry < maxRetries; retry++) {
        try {
          await connectToDB();
          const prompt = await Prompt.findById(params.id).populate('creator');
          if (prompt) {
            return new Response(JSON.stringify(prompt), { status: 200 });
          }
        } catch (error) {
          console.error(`Retry ${retry + 1} failed: ${error.message}`);
        }
  
        if (retry < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
  
      return new Response("Failed to fetch prompt", { status: 500 });
    }
  
    return fetchDataWithRetries();
};

export const PATCH = async (request, { params }) => {
    const { prompt, title, date } = await request.json()
    try{
        await connectToDB()

        const existingPrompt = await Prompt.findById(params.id)
        if(!existingPrompt) return new Response("Prompt not found", { status: 404 })

        existingPrompt.prompt = prompt
        existingPrompt.title = title
        existingPrompt.date = date
        await existingPrompt.save()

        return new Response(JSON.stringify(existingPrompt), { status: 200 })
    }catch(error){
        return new Response("Failed to update prompt", { status: 500 })
    }
}

export const DELETE = async (request, { params }) => {
    try{
        await connectToDB()

        await Prompt.findByIdAndRemove(params.id)

        return new Response("Prompt deleted successfully", { status : 200 })
    }catch(error){
        return new Response("Failed to delete prompt", { status: 500 })
    }
}

export const POST = async (request, { params }) => {
  try {
      const session = await getServerSession(authOptions);
      if (!session || !session.user) {
          return new Response("Unauthorized", { status: 401 });
      }

      await connectToDB();

      const promptId = params.id;
      const userId = session.user.id;

      const prompt = await Prompt.findById(promptId);

      if (!prompt) {
          return new Response("Prompt not found", { status: 404 });
      }

      const userLikeIndex = prompt.likes.indexOf(userId);

      if (userLikeIndex > -1) {
          // User has already liked, so unlike
          prompt.likes.splice(userLikeIndex, 1);
      } else {
          // User hasn't liked, so add like
          prompt.likes.push(userId);
      }

      await prompt.save();

      return new Response(JSON.stringify({
          likes: prompt.likes,
          likeCount: prompt.likes.length,
          isLiked: prompt.likes.includes(userId)
      }), { status: 200 });
  } catch (error) {
      console.error("Error in POST /api/prompt/[id]:", error);
      return new Response("Failed to toggle like", { status: 500 });
  }
};