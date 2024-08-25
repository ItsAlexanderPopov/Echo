'use client'

import { useEffect, useState } from 'react'
import Feed from "@components/Feed"

const LoadingAnimation = () => (
  <div className="w-full h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
  </div>
)

const Home = () => {
  const [refreshKey, setRefreshKey] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleRouteChange = () => {
      setRefreshKey(prevKey => prevKey + 1)
      setIsLoading(true)
    }

    window.addEventListener('popstate', handleRouteChange)

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])

  return (
    <>
      {isLoading && <LoadingAnimation />}
      <div style={{ display: isLoading ? 'none' : 'block' }}>
        <section className="w-full mt-24 flex-center flex-col">
          <h1 className="head_text text-center">
            Discover & Contribute
            <br/>
            <span className="orange_gradient text-center">In Echo's Digital Time Capsule</span>
          </h1>
          <p className="desc text-center">
            A collective archive of human perspective spanning different times, cultures, and viewpoints.
            told through thoughts, stories, and experiences.
            Browse to rediscover history, or post anything to inspire others.
          </p>
          <Feed key={refreshKey} setIsLoading={setIsLoading} />
        </section>
      </div>
    </>
  )
}

export default Home