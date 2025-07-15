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
import InPageNavigation from "../components/inpage-navigation.component";
import BLogPostCard from "../components/blog-post.component";
import NoDataMessage from "../components/nodata.component";
import LoadMoreDataBtn from "../components/load-more-component";
import PageNotFound from "./404.page";


export const profileDataStructure = {
  personal_info: {
    fullname: "",
    username: "",
    profile_img: "",
    bio: "",
  },
  account_info: {
    total_posts: 0,
    total_reads: 0,
  },
  social_links: {},
  joinedAt: " ",
};

const ProfilePage = () => {
  let { id: profileId } = useParams();
  let [profile, setProfile] = useState(profileDataStructure);
  let [loading, setLoading] = useState(true);
  let [blogs, setBlogs] = useState(null);
  let [ profileLoaded, setProfileLoaded ] = useState("");

  let {
    personal_info: { fullname, username: profile_username, profile_img, bio },
    account_info: { total_posts, total_reads },
    social_links,
    joinedAt,
  } = profile;

  let { userAuth } = useContext(UserContext) || {};
  let { username } = userAuth || {};

  const fetchUserProfile = () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", { username: profileId })
      .then(({ data: user }) => {
        if(user != null){
          setProfile(user);
        }
        
        setProfileLoaded(profileId);
        getBlogs({ user_id: user._id });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const getBlogs = ({ page = 1, user_id }) => {
    user_id = user_id == undefined ? blogs.user_id : user_id;

    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        author: user_id,
        page,
      })
      .then(async ({ data }) => {
        let formatedData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/search-blogs-count",
          data_to_send: { author: user_id },
        });

        formatedData.user_id = user_id;

        setBlogs(formatedData);
      });
  };

  useEffect(() => {

    if(profileId != profileLoaded){
        setBlogs(null);
    }

    if(blogs == null){
       resetStates();
       fetchUserProfile();
    }
    
  }, [profileId, blogs]);

  const resetStates = () => {
    setProfile(profileDataStructure);
    setLoading(true);
    setProfileLoaded("");
  };

  return (
    <AnimationWrapper>
      {
        loading ? 
          <Loader /> :
            profile_username.length ?
               <section className="h-cover user-profile-container">
          <div className="user-profile-info">
            <img src={profile_img} className="user-img" />
            <h1 className="profile-username">@{profile_username}</h1>
            <p className="user-fullname">{fullname}</p>
            <p>
              {total_posts.toLocaleString()} Blogs -{" "}
              {total_reads.toLocaleString()} Reads
            </p>

            <div className="edit-profile-container">
              {profileId == username ? (
                <Link
                  to="/settings/edit-profile"
                  className="btn-light edit-profile"
                >
                  Edit Profile
                </Link>
              ) : (
                " "
              )}
            </div>

            <AboutUser
              className="about-user"
              bio={bio}
              social_links={social_links}
              joinedAt={joinedAt}
            />
          </div>



          <div className="user-blogs-container">

            <InPageNavigation
              routes={[ "Blogs Published", "About"]}
              defaultHidden={["About"]}
            >
              <>
                {blogs == null ? (
                  <Loader />
                ) : blogs.results.length ? (
                  blogs.results.map((blog, i) => {
                    return (
                      <AnimationWrapper key={i}>
                        <BLogPostCard
                          content={blog}
                          author={blog.author.personal_info}
                        />
                      </AnimationWrapper>
                    );
                  })
                ) : (
                  <NoDataMessage message="No blogs published" />
                )}
                <LoadMoreDataBtn
                  state={blogs}
                  fetchDataFun={getBlogs}
                />
              </>

             <AboutUser className="about-user-mobile" bio={bio} social_links={social_links} joinedAt={joinedAt} />
            </InPageNavigation>
          </div>

                </section>
            : <PageNotFound />
          
      }
    </AnimationWrapper>
  );
};

export default ProfilePage;
