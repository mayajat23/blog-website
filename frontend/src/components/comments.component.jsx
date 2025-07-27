import { useContext } from "react";
import { BlogContext } from "../pages/blog.page";
import { RxCross2 } from "react-icons/rx";
import CommentField from "./comment-field.component";
import axios from "axios";
import NoDataMessage from "./nodata.component";
import AnimationWrapper from "../common/page-animation";
import CommentCard from "./comment-card.component";


export const fetchComments = async ({ skip = 0, blog_id, setParentCommentCountFun, comment_array = null }) => {
   
    let res;
    
    await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog-comments", { blog_id, skip })
    .then(({ data }) => {

      data.map(comment => {
        comment.childrenLevel = 0;
      })
      
      setParentCommentCountFun(preVal => preVal + data.length)

      if(comment_array == null){
         res = { results: data }
      } else{
        res = { results: [ ...comment_array, ...data ]}
      }

    })
     return res;
}

const CommentsContainer = () => {

    let { blog, blog: { _id, title, comments: { results: commentsArr }, activity: { total_parent_comments } }, commentsWrapper, setCommentsWrapper, totalParentCommentsLoaded, setTotalParentCommentsLoaded, setBlog } = useContext(BlogContext)
    

    const loadMoreComments = async () => {
        
      let newCommentsArr = await fetchComments({ skip: totalParentCommentsLoaded, blog_id: _id, setParentCommentCountFun: setTotalParentCommentsLoaded, comment_array: commentsArr })

      setBlog({ ...blog, comments: newCommentsArr })
    }
     
   
    return (
      <div className={`comments-container ${commentsWrapper ? "open" : "closed"}`}>

        <div className="comments-head">
          <h1 className="comments-h-text">Comments</h1>
          <p className="title-h-text">{title}</p>
          <button className="cross" onClick={() => setCommentsWrapper(preVal => !preVal)}>
            <RxCross2 className="rxcross-icon" />
          </button>
        </div>
        <hr className="hr-line"/>
        <CommentField action="Comment"/>

        {
          commentsArr && commentsArr.length ? 
          commentsArr.map((comment, i) => {
            return <AnimationWrapper key={i} >
              <CommentCard index={i} leftVal={comment.childrenLevel * 4 } commentData={comment} />
            </AnimationWrapper>
          }) :
           <NoDataMessage message="No Comments" />
        }

        {
          total_parent_comments > totalParentCommentsLoaded ?
          <button onClick={loadMoreComments} className="load-more-btn">
            Load More
          </button>
          : ""
        }

      </div>
    )
}

export default CommentsContainer;