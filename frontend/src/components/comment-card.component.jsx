import { useContext, useState } from "react";
import { getDay } from "../common/date";

import { toast, ToastContainer } from "react-toastify";
import { UserContext } from "../App";
import CommentField from "./comment-field.component";

const CommentCard = ({ index, leftVal, commentData }) => {


    let { commented_by: { personal_info: { profile_img, fullname, username } }, commentedAt, comment, _id } = commentData

    let { userAuth: { access_token } } = useContext(UserContext);

    const [ isReplying, setReplying ] = useState(false);

    const handleReplyClick = () => {
        if(!access_token){
            return toast.error("login first to leave a reply")
        }
        
        setReplying(preVal => !preVal);

    }

    return (
        <>
       
       <div className="comment-card-container" style={{ paddingLeft: `${leftVal * 10}px` }}>

        <div className="comment-card">
            <div className="commented-user-details">
                <img src={profile_img} className="commented-user-profile-img" />
                <p className="commented-user-name">{fullname} @{username}</p>
                <p className="commented-at">{getDay(commentedAt)}</p>
            </div>
            <p className="comments-text">{comment}</p>
            <div className="reply-btn-container">
              <button className="reply-btn" onClick={handleReplyClick}>Reply</button>
            </div>
            {
                isReplying ?
                <div className="reply-area">
                  <CommentField  action="reply" index={index}  replyingTo={_id} setReplying={setReplying}/>
                </div> : ""
            }

        </div>
       </div>
       </>
    )
}

export default CommentCard;