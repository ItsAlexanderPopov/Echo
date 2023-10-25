import Feed from "@components/Feed"

const Home = () => {
  return (
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
            <Feed/>
    </section>
  )
}

export default Home