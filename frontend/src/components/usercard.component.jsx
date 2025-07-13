import { Link } from "react-router-dom";

const UserCard = ({ user }) => {

    let { personal_info: { fullname, username, profile_img } } = user;

    return (
           <Link to={`/user/${username}`} className="user-container">
              <img src={profile_img} className="users-img" />

              <div>
                <h1 className="users-fullname">{ fullname }</h1>
                <p className="users-username"> @{username}</p>
              </div>
              
           </Link>
    )
}

export default UserCard;