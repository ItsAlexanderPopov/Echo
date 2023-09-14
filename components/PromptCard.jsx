'use client'

import { useState } from "react"
import Image from 'next/image'
import { useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"

const PromptCard = ({ post, handleEdit, handleDelete }) => {

    const { data: session } = useSession()
    const pathName = usePathname()
    const router = useRouter()

    const [copied, setCopied] = useState("")
    
    const handleCopy = () => {
      setCopied(post.prompt)
      navigator.clipboard.writeText(post.title + ": " + post.prompt)
      setTimeout(() => setCopied(""), 1500)
    }

    const handleProfileClick = () => {
      if (post.creator._id === session?.user.id) {
        return router.push("/profile")
      }
      router.push(`/profile/${post.creator._id}?name=${post.creator.username}`)
    }

    return (
    <div className="prompt_card">
      <div className="flex justify-between items-start gap-5">
        <div
        onClick={handleProfileClick} 
        className="flex-1 flex justify-start items-center gap-3 cursor-pointer
        transition ease-in-out delay-50 hover:scale-110 duration-300">
          <Image
            src={post.creator.image}
            alt="user_image"
            width={40}
            height={40}
            className="rounded-full object-contain"
          />

          <div className="flex flex-col">
            <h3 className="font-satoshi font-semibold text-slate-700">
              {post.creator.username}
            </h3>
            <p className="font-inter text-sm text-slate-500">
              {post.creator.email}
            </p>
          </div>
        </div>
        <div className="copy_btn" onClick={handleCopy}>
          <Image 
            src = {copied === post.prompt
            ? '/assets/icons/tick.svg'
            : '/assets/icons/copy.svg'}
            width={12}
            height={12}
            alt="copy"
          />
        </div>
      </div>
      <p className="my-4 font-satoshi text-xl font-bold tracking-wide w-fit blue_gradient break-words">
        {post.title}
      </p>
      <p className="my-4 font-satoshi text-sm text-gray-700 break-words">
        {post.prompt}
      </p>
      <p className="mt-8 font-satoshi text-sm text-gray-500">
        {post.date}
      </p>
      {session?.user.id === post.creator._id && pathName === '/profile' && (
        <div className="flex-center gap-20 mt-6">
          <button 
            className="outline_btn font-semibold hover:bg-blue-500"
            type="button"
            onClick={handleEdit}
          >
            Edit
          </button>
          <button 
            className="outline_btn"
            type="button"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

export default PromptCard