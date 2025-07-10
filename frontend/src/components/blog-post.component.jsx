import { getDay } from "../common/date";
import { IoMdHeartEmpty } from "react-icons/io";
import { Link } from "react-router-dom";

const BLogPostCard = ({ content, author }) => {
  let {
    publishedAt,
    tags,
    title,
    des,
    banner,
    activity: { total_likes },
    blog_id: id,
  } = content;
  let { fullname, profile_img, username } = author;

  return (
    <Link to={`/blog/${id}`} className="all">
      <div className="blog-post-container">
        <div className="blog-post">
          <img src={profile_img} className="pfi" />
          <p className="bio">
            {fullname} @{username}
          </p>
          <p className="date">{getDay(publishedAt)}</p>
        </div>
       
        <h1 className="blog-title">{title}</h1>

        <p className="shortdes">{des}</p>

        <div className="tag-like-container">
          <span className="tag-used btn-light">{tags[0]}</span>
          <span className="likes">
            <IoMdHeartEmpty className="like-icon" />
            {total_likes}
          </span>
        </div>
      </div>

      <div className="banner-container">
        <img src={banner} className="banner-img" />
      </div>
    </Link>
  );
};

export default BLogPostCard;
