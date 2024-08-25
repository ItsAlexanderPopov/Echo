'use client'
import { useState, useEffect, useMemo } from "react"
import { usePathname } from "next/navigation"
import PromptCard from "./PromptCard"

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

  const getYearFromDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getFullYear()) ? new Date().getFullYear() : date.getFullYear();
  };

  const fetchPosts = async () => {
    console.log("Fetching posts...");
    setIsLoading(true);
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/prompt?t=${timestamp}`);
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
    } catch (error) {
      console.error('Error fetching or processing posts:', error);
    } finally {
      console.log("Setting loading to false");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("Feed component mounted or path changed");
    fetchPosts();
  }, [pathname]); // Re-fetch when pathname changes

  // Generate available years from posts
  const availableYears = useMemo(() => {
    const years = new Set(posts.map(post => getYearFromDate(post.date)));
    return Array.from(years).sort((a, b) => b - a);
  }, [posts]);

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
  }, [posts, selectedYear, searchText]);

  const handleSubmit = (e) => {
    e.preventDefault()
  }
  
  const handleSearchChange = (e) => {
    setSearchText(e.target.value)
  }

  const handleLikeUpdate = async (postId) => {
    await fetchPosts();
  };

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