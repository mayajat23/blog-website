import { useEffect } from "react";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import axios from "axios";
import { useState } from "react";
import Loader from "../components/loader.component";
import BLogPostCard from "../components/blog-post.component";
import MinimialBlogPost from "../components/nobanner-blog-post.component";
import { IoIosTrendingUp } from "react-icons/io";
import { activeTabRef } from "../components/inpage-navigation.component";
import NoDataMessage from "../components/nodata.component";

const HomePage = () => {
  let [blogs, setBlog] = useState(null);
  let [trendingBlog, setTrendingBlog] = useState(null);
  let [pageState, setPageState] = useState("home");

  let categories = [
    "programming",
    "health",
    "writing",
    "technology",
    "cooking",
    "social media",
    "painting",
    "travel",
  ];

  //  latest blogs
  const fetchLatestBlogs = () => {
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs")
      .then(({ data }) => {
        setBlog(data.blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // blogs by category
  const fetchBlogsByCategory = () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        tag: pageState,
      })
      .then(({ data }) => {
        setBlog(data.blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // tranding blogs
  const fetchTrendingBlogs = () => {
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
      .then(({ data }) => {
        setTrendingBlog(data.blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadBlogByCategory = (e) => {
    let category = e.target.innerText.toLowerCase();
    setBlog(null);

    if (pageState == category) {
      setPageState("home");
      return;
    }

    setPageState(category);
  };

  useEffect(() => {
    activeTabRef.current.click();
    if (pageState == "home") {
      fetchLatestBlogs();
    } else {
      fetchBlogsByCategory();
    }

    if (!trendingBlog) {
      fetchTrendingBlogs();
    }
  }, [pageState]);

  return (
    <AnimationWrapper>
      <section className="h-cover homepage">
        {/* latest blogs */}
        <div className="latest-blogs">
          <InPageNavigation
            routes={[pageState, "trending blogs"]}
            defaultHidden={["trending blogs"]}
          >
            <>
              {blogs == null ? (
                <Loader />
              ) : (
                blogs.length ? 
                  blogs.map((blog, i) => {
                   return (
                      <AnimationWrapper key={i}>
                        <BLogPostCard
                         content={blog}
                         author={blog.author.personal_info}
                        />
                      </AnimationWrapper>
                    );
                  })
                : <NoDataMessage message="No blogs published" />
              )}
            </>

            {trendingBlog == null ? (
              <Loader />
            ) : (
                trendingBlog.length ?
                   trendingBlog.map((blog, i) => {
                    return (
                     <AnimationWrapper key={i}>
                       <MinimialBlogPost blog={blog} index={i} />
                     </AnimationWrapper>
                     );
                   })
                :  <NoDataMessage message="No trending blogs" />
            )}
          </InPageNavigation>
        </div>

        {/* filters and treanding blogs */}
        <div className="filter-trending-blogs">
          <div className="stories">
            <div>
              <h1 className="text-stories">Stories from all interest</h1>

              <div className="tags-trending">
                {categories.map((category, i) => {
                  return (
                    <button
                      onClick={loadBlogByCategory}
                      className={`tag ${
                        pageState === category ? "active" : ""
                      }`}
                      key={i}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h1 className="trending">
                Trending <IoIosTrendingUp className="trending-icon" />
              </h1>

              {trendingBlog == null ? (
                <Loader />
              ) : (
                trendingBlog.length ? 
                trendingBlog.map((blog, i) => {
                  return (
                    <AnimationWrapper key={i}>
                      <MinimialBlogPost blog={blog} index={i} />
                    </AnimationWrapper>
                  );
                })
                : <NoDataMessage message="No blogs published" />
              )}
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default HomePage;
