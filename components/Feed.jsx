'use client'
import { useState, useEffect, useMemo, useCallback } from "react"
import { usePathname } from "next/navigation"
import PromptCard from "./PromptCard"

// Custom hook to force refresh
const useForceRefresh = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = useCallback(() => setRefreshKey(prev => prev + 1), []);
  return [refreshKey, refresh];
};

const PromptCardList = ({data, handleLikeUpdate}) => {
  return(
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
}

const Feed = ({ setIsLoading }) => {
  const [searchText, setSearchText] = useState("")
  const [posts, setPosts] = useState([])
  const [selectedYear, setSelectedYear] = useState('');
  const pathname = usePathname()
  const [refreshKey, forceRefresh] = useForceRefresh();

  const getYearFromDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getFullYear()) ? new Date().getFullYear() : date.getFullYear();
  }, []);

  const fetchPosts = useCallback(async () => {
    console.log("Fetching posts...");
    setIsLoading(true);
    let retries = 3;
    while (retries > 0) {
      try {
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/prompt`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Posts fetched:", data.length);
  
        const sortedPosts = data.sort((a, b) => {
          const dateA = new Date(a.date.split('/').reverse().join('/'));
          const dateB = new Date(b.date.split('/').reverse().join('/'));
          return dateB - dateA;
        });
  
        setPosts(sortedPosts);
        console.log("Posts sorted and set");
        break; // Success, exit the retry loop
      } catch (error) {
        console.error(`Error fetching posts (${retries} retries left):`, error);
        retries--;
        if (retries === 0) {
          // Handle the error, maybe set an error state
          console.error('Failed to fetch posts after multiple attempts');
        } else {
          // Wait for a short time before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    setIsLoading(false);
  }, [setIsLoading]);

  useEffect(() => {
    console.log("Feed component mounted or refresh triggered");
    fetchPosts();
  }, [fetchPosts, pathname, refreshKey]);

  // Generate available years from posts
  const availableYears = useMemo(() => {
    const years = new Set(posts.map(post => getYearFromDate(post.date)));
    return Array.from(years).sort((a, b) => b - a);
  }, [posts, getYearFromDate]);

  // filters posts dynamically accordingly to search and by year selected
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const postYear = getYearFromDate(post.date);
      const matchesYear = selectedYear === '' || postYear.toString() === selectedYear;
      const matchesSearch = 
        post.prompt.toLowerCase().includes(searchText.toLowerCase()) ||
        post.title.toLowerCase().includes(searchText.toLowerCase()) || 
        post.creator.email.toLowerCase().includes(searchText.toLowerCase()) ||
        post.creator.username.toLowerCase().includes(searchText.toLowerCase());
      
      return matchesYear && matchesSearch;
    });
  }, [posts, selectedYear, searchText, getYearFromDate]);

  const handleSubmit = (e) => {
    e.preventDefault()
  }
  
  const handleSearchChange = (e) => {
    setSearchText(e.target.value)
  }

  const handleLikeUpdate = useCallback(async (postId) => {
    forceRefresh();
  }, [forceRefresh]);

  return (
    <section className="feed">
      {/* Search Input */}
      <form 
        id="searchForm"
        onSubmit={handleSubmit} 
        className="relative w-full flex-center"
      >
        <input
          id="text"
          type="text"
          placeholder="Search for posts, titles, or by username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      {/* filter by year */}
      <div className="flex gap-4 m-4">
        {availableYears.map(year => (
          <button
            key={year}
            type="button"
            className={`outline_btn hover:bg-orange-500 ${selectedYear === year.toString() ? "bg-orange-500" : ''}`}
            onClick={() => setSelectedYear(selectedYear === year.toString() ? '' : year.toString())}
          >
            {year}
          </button>
        ))}
      </div>

      {/* showcase all posts */}
      <PromptCardList
        data={filteredPosts}
        handleLikeUpdate={handleLikeUpdate}
      />
    </section>
  )
}

export default Feed