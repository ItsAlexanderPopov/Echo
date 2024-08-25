import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import PromptCard from "./PromptCard";

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
);

const Feed = ({ setIsLoading }) => {
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedYear, setSelectedYear] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [availableYears, setAvailableYears] = useState([]);
  const pathname = usePathname();
  const initialFetchDone = useRef(false);

  const getYearFromDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.getFullYear() || new Date().getFullYear();
  }, []);

  const fetchPosts = useCallback(async (page, year, reset = false) => {
    setIsLoadingMore(true);
    try {
      const response = await fetch(`/api/prompt?page=${page}&limit=9&year=${year || ''}`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();

      setPosts(prevPosts => {
        if (reset) {
          return data.prompts;
        }
        const newPosts = data.prompts.filter(newPost => 
          !prevPosts.some(existingPost => existingPost._id === newPost._id)
        );
        return [...prevPosts, ...newPosts];
      });

      setHasMore(data.prompts.length === 9);
      setCurrentPage(page);
      setTotalPosts(data.total);
      setAvailableYears(data.availableYears);
    } catch (error) {
        console.error('Failed to fetch posts:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    if (!initialFetchDone.current) {
      setIsLoading(true);
      fetchPosts(1, selectedYear, true).then(() => {
        setIsLoading(false);
        initialFetchDone.current = true;
      });
    }
  }, [fetchPosts, setIsLoading, pathname, selectedYear]);

  const filteredPosts = useMemo(() => {
    if (!posts.length) return [];

    const searchLower = searchText.toLowerCase();
    return posts.filter(post => {
      const postYear = getYearFromDate(post.date).toString();
      const matchesSearch = post.prompt.toLowerCase().includes(searchLower) ||
                            post.title.toLowerCase().includes(searchLower) ||
                            post.creator.email.toLowerCase().includes(searchLower) ||
                            post.creator.username.toLowerCase().includes(searchLower);
      const matchesYear = selectedYear === '' || postYear === selectedYear;
      
      return matchesYear && matchesSearch;
    });
  }, [posts, selectedYear, searchText, getYearFromDate]);

  const handleLikeUpdate = useCallback((postId) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post._id === postId 
          ? { ...post, likes: (post.likes || 0) + 1 } 
          : post
      )
    );
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoadingMore) {
      fetchPosts(currentPage + 1, selectedYear);
    }
  }, [fetchPosts, currentPage, hasMore, isLoadingMore, selectedYear]);

  const handleYearSelection = useCallback((year) => {
    const newYear = selectedYear === year.toString() ? '' : year.toString();
    setSelectedYear(newYear);
    setCurrentPage(1);
    fetchPosts(1, newYear, true);
  }, [fetchPosts, selectedYear]);

  return (
    <section className="feed">
      <form onSubmit={(e) => e.preventDefault()} className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Filter by posts, titles, username or email"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="search_input peer"
        />
      </form>

      <div className="flex gap-4 m-4">
        {availableYears.sort((a, b) => b - a).map(year => (
          <button
            key={year}
            type="button"
            className={`outline_btn hover:bg-orange-500 ${selectedYear === year.toString() ? "bg-orange-500" : ''}`}
            onClick={() => handleYearSelection(year)}
            disabled={isLoadingMore}
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

        <div className="mt-4 flex justify-center">
        {hasMore && !isLoadingMore ? (
          <button 
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="outline_btn hover:bg-orange-500 h-12"
          >
            Load More
          </button>
          ) : (
            <div className="h-12"></div>
          )}
        </div>

      <p className="text-center mt-4">
        Showing {filteredPosts.length} out of {totalPosts} posts
      </p>
    </section>
  );
};

export default Feed;