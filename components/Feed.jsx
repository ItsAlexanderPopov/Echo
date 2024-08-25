'use client'
import { useState, useEffect, useMemo, useCallback, useRef } from "react"
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
  const [posts, setPosts] = useState([])
  const [searchText, setSearchText] = useState("")
  const [selectedYear, setSelectedYear] = useState('')
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPosts, setTotalPosts] = useState(0)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const pathname = usePathname()
  const initialFetchDone = useRef(false)

  const getYearFromDate = useCallback((dateString) => {
    const date = new Date(dateString)
    return date.getFullYear() || new Date().getFullYear()
  }, [])

  const fetchPosts = useCallback(async (page) => {
    setIsLoadingMore(true)
    try {
      const response = await fetch(`/api/prompt?page=${page}&limit=3`, { cache: 'no-store' })
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
      const data = await response.json()
      
      setPosts(prevPosts => {
        const newPosts = data.prompts.filter(newPost => 
          !prevPosts.some(existingPost => existingPost._id === newPost._id)
        )
        return [...prevPosts, ...newPosts]
      })
      setHasMore(data.prompts.length === 3)
      setCurrentPage(page)
      setTotalPosts(data.total)
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    if (!initialFetchDone.current) {
      setIsLoading(true)
      fetchPosts(1).then(() => {
        setIsLoading(false)
        initialFetchDone.current = true
      })
    }
  }, [fetchPosts, setIsLoading, pathname])

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

  const handleLikeUpdate = useCallback((postId) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post._id === postId 
          ? { ...post, likes: (post.likes || 0) + 1 } 
          : post
      )
    )
  }, [])

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoadingMore) {
      fetchPosts(currentPage + 1)
    }
  }, [fetchPosts, currentPage, hasMore, isLoadingMore])

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

      {filteredPosts.length === 0 && !isLoadingMore && (
        <p className="text-center mt-4">No posts found matching your criteria.</p>
      )}

      {hasMore && (
        <div className="mt-4 flex justify-center">
          <button 
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="outline_btn hover:bg-blue-500"
          >
            {isLoadingMore ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      <p className="text-center mt-4">
        Showing {filteredPosts.length} out of {totalPosts} posts
      </p>
    </section>
  )
}

export default Feed