import PromptCard from "./PromptCard"

const Profile = ({ name, desc, data, handleEdit, handleDelete }) => {
  return (
    <section className="w-full mt-24">
      <h1 className="head_text text-left">
        <span className="blue_gradient">
          {name} Profile
        </span>
      </h1>
      <p className="desc text-left ">
        {desc}
      </p>
      <section className="feed">
       <div className="mt-5 prompt_layout">
        {data.map((post) => (
         <PromptCard
           key={post._id}
           post={post}
           handleEdit={() => handleEdit && handleEdit(post)}
           handleDelete={() => handleDelete && handleDelete(post)}
         />
         ))}
       </div>
      </section>
    </section>
  )
}

export default Profile