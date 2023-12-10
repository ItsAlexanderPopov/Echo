import Link from "next/link"
const Form = ({ type, post, setPost, submitting, handleSubmit}) => {
  return(
    <section className="w-full m-w-full flex-start flex-col mt-24">
      <h1 className="head_text text-left blue_gradient">{type} Post</h1>
      <p className="desc text-left max-w-md">
        {type} and share your views with the world, and leave your footprint in a never ending time capsule platform
      </p>
      <form
        id="echoForm"
        onSubmit={handleSubmit}
        className="mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism"
      >
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Title
          </span>

          <textarea
          id="textarea-title"
          value={post.title}
          onChange={(e) => setPost({...post, title: e.target.value})}
          placeholder="Title..."
          className="form_input font-bold"
          maxLength={100}
          >
          </textarea>
        </label>
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Your Echo
          </span>

          <textarea
          id="textarea-echo"
          autoFocus
          value={post.prompt}
          onChange={(e) => setPost({...post, prompt: e.target.value})}
          placeholder="Write your echo here..."
          className="form_textarea resize-none"
          maxLength={1000}
          >
          </textarea>
        </label>
        <div className="flex-end mx-3 mb-5 gap-4">
          <Link href="/" className="text-gray-500 text-sm">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white"
          >
            {submitting ?  `${type}ing...` : type}
          </button>
        </div>
      </form>
    </section>
  )
}

export default Form