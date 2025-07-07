import { useContext } from "react";
import AnimationWrapper from "../common/page-animation";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { UserContext } from "../App";
import { Link } from "react-router-dom";
import { removeFromSession } from "../common/session";

const UserNavigationPanel = () => {

    const { userAuth, setUserAuth } = useContext(UserContext);
    const { username } = userAuth;

    const signOutUser = () =>{
        removeFromSession("user");
        setUserAuth({ access_token: null })

    }
  return (
    <AnimationWrapper>
        <div className="content-container"> 
        <div className="navigation-container">
            <Link to="/editor" className="navigation link">
            <HiMiniPencilSquare className="write-icon" />
                <p>Write</p>
            
            </Link>

            <Link to={`/user/${username}`} className="link content-link">
            Profile
            </Link>

             <Link to="/dashboard/blogs" className="link content-link">
            Dashboard
            </Link>

             <Link to="/settings/edit-profile" className="link content-link">
            Settings
            </Link>

            <span className="content-span"> </span>

            <button className="signout-btn" onClick={signOutUser}>
             <h1 className="signout-text">
                Sign Out
             </h1>
             <p className="username-text">
                @{username}
             </p>

            </button>


        </div>

        </div>
    </AnimationWrapper>
  )
}


export default UserNavigationPanel;