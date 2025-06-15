import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";

const Navbar = () => {
return (

<nav className="navbar">

    <Link to="/" className="logo-img">
    <img src={logo} alt="logo" />
    </Link>
<div className="search">
    <input type="text" placeholder="search" className="search-input" />
  <i className="fi fi-rr-search search-icon"></i>
</div>
 


</nav>
)
}


export default Navbar