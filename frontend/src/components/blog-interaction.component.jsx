import { useContext } from "react"
import { BlogContext } from "../pages/blog.page"
import { PiHeartStraight } from "react-icons/pi";
import { FaRegCommentDots } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaTwitter } from "react-icons/fa";
import { UserContext } from "../App";

const BlogInteraction = () => {

    let { blog: { title, blog_id, activity, activity: { total_likes, total_comments }, author: { personal_info: { username: author_username } } }, setBlog } = useContext(BlogContext);

    let { userAuth: { username } } = useContext(UserContext);
    return (
      <>
      <hr className="hr-border" />

        <div className="all-btns-container">
            <div  className="all-btns">
                
                <button className="btns-of">
                 <PiHeartStraight className="btns-icon" />
                </button>
                <p className="total-count">{ total_likes }</p>
                
                <button className="btns-of">
                  <FaRegCommentDots  className="btns-icon"/>
                </button>
                <p className="total-count">{ total_comments }</p>
                

            </div>

             <div className="edit-share-btns-container">
                {
                    username == author_username ?
                    <Link to={`/editor/${blog_id}`} className="edit-link">Edit</Link> : ""
                }

            <Link to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`}><FaTwitter className="twitter-icon" /></Link>

           </div>
          
        </div>

      <hr className="hr-border" />

      </>
    )
}

export default BlogInteraction