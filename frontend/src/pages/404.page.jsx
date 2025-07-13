import pageNotFoundImage from "../imgs/404.png";
import { useNavigate } from "react-router-dom";
import fullLogo from "../imgs/fulllogo.png";

const PageNotFound = () => {
     const navigate = useNavigate();

    return (
       <section className=" h-cover pagenotfound-container">

        <img src={pageNotFoundImage}  className="error-img"/>
        <h1 className="pagenotfound-text">Page not found</h1>
        <p className="fade-in-text">Oops! The page you're looking for doesn’t exist.</p>
        <button className="back-btn" onClick={() => navigate(-1)}>Go Back</button>

        <div className="website">
           
                <img  src={fullLogo} className="fulllogo-img"/>
            <p className="tagline">Read millions of stories around the world</p>

        </div>

       </section>
    )
}

export default PageNotFound;