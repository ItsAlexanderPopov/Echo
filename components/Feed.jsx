'use client'
import { useState, useEffect, useMemo, useCallback } from "react"
import { usePathname } from "next/navigation"
import PromptCard from "./PromptCard"

const PromptCardList = ({ data, handleLikeUpdate }) => (
  <div className="prompt_layout mt-8">
    {data.map((post) => (
      <PromptCard
        key={post._id}
        post={post}
        handleLikeUpdate={handleLikeUpdate}
      />
    ))}
  </div>
)

const Feed = ({ setIsLoading }) => {
  const [searchText, setSearchText] = useState("")
  const [posts, setPosts] = useState([])
  const [selectedYear, setSelectedYear] = useState('')
  const pathname = usePathname()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const getYearFromDate = useCallback((dateString) => {
    const date = new Date(dateString)
    return date.getFullYear() || new Date().getFullYear()
  }, [])

  const fetchPosts = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/prompt', { cache: 'no-store' })
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
      const data = await response.json()
      setPosts(data.sort((a, b) => new Date(b.date) - new Date(a.date)))
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setIsLoading(false)
    }
  }, [setIsLoading])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts, pathname, refreshTrigger])

  const availableYears = useMemo(() => {
    const years = new Set(posts.map(post => getYearFromDate(post.date)))
    return Array.from(years).sort((a, b) => b - a)
  }, [posts, getYearFromDate])

  const filteredPosts = useMemo(() => {
    const searchLower = searchText.toLowerCase()
    return posts.filter(post => {
      const postYear = getYearFromDate(post.date).toString()
      return (selectedYear === '' || postYear === selectedYear) &&
        (post.prompt.toLowerCase().includes(searchLower) ||
         post.title.toLowerCase().includes(searchLower) ||
         post.creator.email.toLowerCase().includes(searchLower) ||
         post.creator.username.toLowerCase().includes(searchLower))
    })
  }, [posts, selectedYear, searchText, getYearFromDate])

  const handleLikeUpdate = useCallback(() => {
    setRefreshTrigger(prev => prev + 1)
  }, [])

  return (
    <section className="feed">
      <form onSubmit={(e) => e.preventDefault()} className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for posts, titles, or by username"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="search_input peer"
        />
      </form>

      <div className="flex gap-4 m-4">
        {availableYears.map(year => (
          <button
            key={year}
            type="button"
            className={`outline_btn hover:bg-orange-500 ${selectedYear === year.toString() ? "bg-orange-500" : ''}`}
            onClick={() => setSelectedYear(prev => prev === year.toString() ? '' : year.toString())}
          >
            {year}
          </button>
        ))}
      </div>

      <PromptCardList
        data={filteredPosts}
        handleLikeUpdate={handleLikeUpdate}
      />
    </section>
  )
}

export default Feed