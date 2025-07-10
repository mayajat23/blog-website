import { Link } from "react-router-dom";
import { getDay } from "../common/date";

const MinimialBlogPost = ({ blog, index }) => {

  let{ title, blog_id: id, author: { personal_info: { fullname, username, profile_img } }, publishedAt } = blog;
    return (
      <Link to={`/blog/${id}`} className="trending-blog-container">
      <h1 className="blog-index">{ index < 10 ? "0" + (index + 1) : index }</h1>

      <div>
       <div className="blog-post">
               <img src={profile_img} className="pfi" />
               <p className="bio">{fullname} @{username}</p>
               <p className="date">{ getDay(publishedAt) }</p>
       
           </div>

           <h1 className="blog-title">{title}</h1>
      </div>
      </Link>
    )
}

export default MinimialBlogPost;