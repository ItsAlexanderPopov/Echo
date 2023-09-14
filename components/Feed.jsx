'use client'
import { useState, useEffect } from "react"
import PromptCard from "./PromptCard"

// Renders all posts after filters
const PromptCardList = ({data}) => {
  return(
    <div className="prompt_layout mt-8">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
        />
      ))}
    </div>
  )
}

const Feed = () => {
  const [searchText, setSearchText] = useState("")
  const [posts, setPosts] = useState([])
  const [year, setYear] = useState('2')

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/prompt')
      const data = await response.json()
      setPosts(data)
    }
    fetchPosts()
  }, [])

  // filters posts dynamically accordingly to search and by year selected
  const handleDynamicSearch = () => {
    return posts.filter(item => 
        item.date.includes(year) && (
          item.prompt.toLowerCase().includes(searchText.toLowerCase()) ||
          item.title.toLowerCase().includes(searchText.toLowerCase()) || 
          item.creator.email.toLowerCase().includes(searchText.toLocaleLowerCase()) ||
          item.creator.username.toLowerCase().includes(searchText.toLocaleLowerCase()
      ))
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }
  
  const handleSearchText = (e) => {
    setSearchText(e.target.value)
  }

  return (

    /* Search Input */
    <section className="feed">
      <form onSubmit={handleSubmit} className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for posts, titles, or by username"
          value={searchText}
          onChange={handleSearchText}
          required
          className="search_input peer"
        />
      </form>

      {/* filter by year */}
      <div className="flex gap-4 m-4">
        <button
          type="button"
          className={`outline_btn hover:bg-orange-500 ${year === '2022' ? "bg-orange-500" : ''}`}
          onClick={() => {  year === '2022' ? setYear('2') : setYear('2022')}}
        >
          2022
        </button>
        <button
          type="button"
          className={`outline_btn hover:bg-orange-500 ${year === '2023' ? "bg-orange-500" : ''}`}
          onClick={() => { year === '2023' ? setYear('2') : setYear('2023')}}
        >
          2023
        </button>
      </div>

      {/* showcase all posts */}
      <PromptCardList
        data={handleDynamicSearch()}
      />
    </section>
  )
}

export default Feed