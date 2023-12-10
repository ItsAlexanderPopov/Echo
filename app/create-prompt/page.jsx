'use client'
import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Form from "@components/Form"
import { getCurrentDate } from "@utils/getDate"

const CreatePrompt = () => {
    const router = useRouter()
    const { data: session } = useSession()
    const [submitting, setSubmitting] = useState(false)
    const [post, setPost] = useState({
        prompt: "",
        title: "",
        date: ""
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try{
            const response = await fetch('/api/prompt/new',{
                method:'POST',
                body: JSON.stringify({
                    prompt: post.prompt,
                    userId: session?.user.id,
                    title: post.title,
                    date: getCurrentDate()
                })
            })
            if(response.ok){
                router.push('/')
            }
        } catch(error){
            console.log(error)
        } finally{
            setSubmitting(false)
        }
    }

    return (
        <Form
            type="Create"
            post={post}
            setPost={setPost}
            submitting={submitting}
            handleSubmit={handleSubmit}
        />
    )
}

export default CreatePrompt