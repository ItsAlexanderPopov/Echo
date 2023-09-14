import { connectToDB } from "@utils/database";
import Prompt from '@models/prompt'

export const GET = async (request, { params }) => {
    try {
        await connectToDB()

        const prompt = await Prompt.findById(params.id).populate('creator')
        if(!prompt) return new Response("Prompt not found", { status: 404 })
        return new Response(JSON.stringify(prompt), { status: 200 })
    } catch (error) {
        return new Response("Failed to fetch all prompts", { status: 500 })
    }
} 

export const PATCH = async (request, { params }) => {
    const { prompt, title, date } = await request.json()
    try{
        await connectToDB()

        const exisitingPrompt = await Prompt.findById(params.id)
        if(!prompt) return new Response("Prompt not found", { status: 404 })

        exisitingPrompt.prompt = prompt
        exisitingPrompt.title = title
        exisitingPrompt.date = date
        await exisitingPrompt.save()

        return new Response(JSON.stringify(exisitingPrompt), { status: 200 })
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
