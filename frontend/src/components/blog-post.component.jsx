const BLogPostCard = ({ content, author }) => {

    let { publishedAt, tags, title, des, banner, activity: { total_likes }, blog_id: id } = content ;
    let { fullname, profile_img, username } = author;
return (
   <div className="blog-post-container">
    <div className="blog-post">
        <img src={profile_img} className="pfi" />
        <p className="bio">{fullname} @{username}</p>
        <p className="date"></p>

    </div>
   </div>
)
}

export default BLogPostCard;