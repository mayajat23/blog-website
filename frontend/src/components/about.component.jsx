import { Link } from "react-router-dom";
import { FaTwitter, FaYoutube, FaInstagram, FaGithub, FaFacebook, FaGlobe  } from "react-icons/fa";
import { getFullDay } from "../common/date";


const iconMap ={
    youtube: FaYoutube,
    instagram: FaInstagram,
    facebook: FaFacebook,
    twitter: FaTwitter,
    github: FaGithub,
    website: FaGlobe
}


const AboutUser = ({  className, bio, social_links, joinedAt }) => {
    return (
        <div className={"about-user-container " + className }>
            <p className="user-bio">{ bio.length ? bio : "Nothing to read here"}</p>

            <div className="social-links">
                {
                     Object.keys(social_links).map((key) => {

                        let link = social_links[key];
                        const IconComponent = iconMap[key];

                        return link && IconComponent ? (
                            <a 
                             href={link}
                             key={key}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="social-icon-link"
                            >
                            <IconComponent className="social-icon" />
                            </ a>
                        ) : " "

                        
                     })
                }

            </div>

            <p className="joined-at">Joined on {getFullDay(joinedAt)}</p>

        </div>
    )
    
}

export default AboutUser;