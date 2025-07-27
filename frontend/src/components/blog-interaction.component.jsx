import { useContext } from "react"
import { BlogContext } from "../pages/blog.page"
import { PiHeartStraight } from "react-icons/pi";
import { FaRegCommentDots } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaTwitter } from "react-icons/fa";
import { UserContext } from "../App";
import { toast, ToastContainer } from "react-toastify";
import { FaHeart } from "react-icons/fa";
import axios from "axios";
import { useEffect } from "react";

const BlogInteraction = () => {

    let { blog, blog: { _id, title, blog_id, activity, activity: { total_likes, total_comments }, author: { personal_info: { username: author_username } } }, setBlog, islikedByUser, setLikedByUser, setCommentsWrapper } = useContext(BlogContext);

    let { userAuth: { username, access_token } } = useContext(UserContext);
     
    useEffect(() => {

      if( access_token ){
        // make request to server to get like information
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/isliked-by-user", { _id }, {
          headers: {
            'Authorization': `Bearer ${access_token}`
          }
        })
        .then(({ data: { result } }) => {
          setLikedByUser(Boolean(result))
        })
         .catch(err => {
          console.log(err);
         })
      }

    })
    const handleLike = () => {
       if(access_token){
        // like the blog
          setLikedByUser(preVal => !preVal);

          !islikedByUser ? total_likes++ : total_likes--;

          setBlog({ ...blog, activity: { ...activity, total_likes }})

          axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/like-blog", { _id, islikedByUser }, {
            headers: {
              'Authorization': `Bearer ${access_token}`
            }
          })

          .then(({ data }) => {
             console.log(data);
          })
          .catch(err => {
            console.log(err);
          })

       } else {
        // not logged in
         toast.error("please login to like this blog")
       }
    }


    return (
      <>
      <ToastContainer />
      <hr className="hr-border" />

        <div className="all-btns-container">
            <div  className="all-btns">
                
                <button className={`btns-of ${islikedByUser ? "liked" : ""}`} onClick={handleLike}>
                  {islikedByUser ?  <FaHeart className="btns-icon-liked" /> : <PiHeartStraight className="btns-icon" />  }
                
                </button>
                <p className="total-count">{ total_likes }</p>
                
                <button className="btns-of" onClick={() => setCommentsWrapper(preVal => !preVal)}>
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