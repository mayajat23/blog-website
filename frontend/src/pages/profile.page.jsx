import { useEffect } from "react";
import { useState } from "react";
import { MdAccountBalance } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { useContext } from "react";
import { UserContext } from "../App";
import AboutUser from "../components/about.component";
import { filterPaginationData } from "../common/filter-pagination-data";


export const profileDataStructure = {
    personal_info: {
        fullname: "",
        username: "",
        profile_img: "",
        bio: ""
    },
    account_info: {
        total_posts: 0,
        total_reads: 0
    },
    social_links: { },
    joinedAt: " "
}


const ProfilePage = () => {

    let { id: profileId } = useParams();
    let [ profile, setProfile ] = useState(profileDataStructure);
    let [ loading, setLoading ] =useState(true);
    let [ blogs, setBlogs ] = useState(null);

    let {personal_info: { fullname, username: profile_username, profile_img, bio }, account_info: { total_posts, total_reads }, social_links, joinedAt } = profile;

 let { userAuth } = useContext(UserContext) || {};
let { username } = userAuth || {};


    const fetchUserProfile = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", { username: profileId })
        .then(({ data: user }) => {
            
            setProfile(user)
            getBlogs({ user_id: user._id });
            setLoading(false);
        })
        .catch(err => {
            console.log(err);
            setLoading(false);
        })
    }


    const getBlogs = ({ page = 1, user_id }) => {

        user_id = user_id == undefined ? blogs.user_id : user_id;

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
            author: user_id,
            page
        })
        .then( async ({ data }) => {
            
            let formatedData = await filterPaginationData({
                state: blogs,
                data: data.blogs,
                page,
                countRoute: "/search-blogs-count",
                data_to_send: { author: user_id }
            })

            formatedData.user_id = user_id;
            
            setBlogs(formatedData);
        })
    }

    useEffect(() => {
         
        resetStates();
        fetchUserProfile();

    }, [profileId])

    const resetStates = () => {
        setProfile(profileDataStructure);
        setLoading(true);
    }

    return (

        <AnimationWrapper >
            {
                loading ? <Loader /> :
                <section className="h-cover user-profile-container">
                    <div className="user-profile-info">
                           <img  src={profile_img} className="user-img"/>
                           <h1 className="profile-username">@{profile_username}</h1>
                           <p className="user-fullname">{fullname}</p>
                           <p>{total_posts.toLocaleString()} Blogs - {total_reads.toLocaleString()} Reads</p>
                           
                           <div className="edit-profile-container">
                            {
                                profileId == username ?
                                <Link to="/settings/edit-profile" className="btn-light edit-profile" >Edit Profile</Link>
                                : " "
                            }
                           
                           </div>

                            <AboutUser className="about-user" bio={bio} social_links={social_links} joinedAt={joinedAt} />
                    </div>

                    <div>
                        
                    </div>


                </section>
            }
           
        </AnimationWrapper>
       
    )
}

export default ProfilePage;