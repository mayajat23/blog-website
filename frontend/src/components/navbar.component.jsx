import { Link, Outlet } from "react-router-dom";
import logo from "../imgs/logo (3).png";
import { CiSearch } from "react-icons/ci";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../App";
import { PiBellLight } from "react-icons/pi";
import UserNavigationPanel from "./user-navigation.component";

const Navbar = () => {
    const [ searchBoxVisibility, setSearchBoxVisibility] = useState(false)

    const [ userNavPanel , setUserNavPanel ] = useState(false);

   const { userAuth = {} } = useContext(UserContext);
const { access_token, profile_img } = userAuth;

const handleUserNavPanel = () => {
    setUserNavPanel(currentVal => !currentVal);
}

const handleBlur = () => {
    setTimeout(() => {
        setUserNavPanel(false);
    }, 200);
    
}

return (
<>
<nav className="navbar" >

    <Link to="/" className="logo-img">
    <img src={logo} alt="logo" />
    </Link>
<div className={`search show ${searchBoxVisibility ? "show" : "hide"}`}>
    <input type="text" placeholder="search" className="search-input" />
  
   <CiSearch className="search-icon" size={24}/>
</div>

{/* toggle-button on screensize<=768px */}
 <div className="search-container" >
    <button className="search-btn" 
    onClick={() => setSearchBoxVisibility(currentVal => !currentVal)} >
       <CiSearch   size={24} />
    </button>

{/* for write */}
    <Link to="/editor" className="write link">
     <HiMiniPencilSquare className="write-icon" />
    <p>Write</p>
    </Link>



{
    access_token ?
    <>
    <Link to="/dashboard/notification">
    <button className="notification">
        <PiBellLight className="notification-icon" />

    </button>
    </Link>

    <div className="profile-img-container" onClick={handleUserNavPanel} onBlur={handleBlur}>
        <button className="profile-img-btn">
            <img src={profile_img} className="profile-img" />

        </button>

        
        {
            userNavPanel ? <UserNavigationPanel /> : ""
        }
        

    </div>
    </>
    :
    <>
    <Link className="btn-dark sign-in-btn" to="/signin">
Sign In</Link>
<Link className="btn-light sign-up-btn" to="/signup">
Sign Up</Link>
    </>
}

 </div>

</nav>

<Outlet />
</>
)
}


export default Navbar