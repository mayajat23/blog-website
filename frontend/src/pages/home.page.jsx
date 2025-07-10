import { useEffect } from "react";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import axios from "axios";
import { useState } from "react";
import Loader from "../components/loader.component";
import BLogPostCard from "../components/blog-post.component";
import MinimialBlogPost from "../components/nobanner-blog-post.component";
import { IoIosTrendingUp } from "react-icons/io";
const HomePage = () => {
  let [blogs, setBlog] = useState(null);
  let [trendingBlog, setTrendingBlog] = useState(null);

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

  useEffect(() => {
    fetchLatestBlogs();
    fetchTrendingBlogs();
  }, []);
  return (
    <AnimationWrapper>
      <section className="h-cover homepage">
        {/* latest blogs */}
        <div className="latest-blogs">
          <InPageNavigation
            routes={["home", "trending blogs"]}
            defaultHidden={["trending blogs"]}
          >
            <>
              {blogs == null ? (
                <Loader />
              ) : (
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
              )}
            </>

            {trendingBlog == null ? (
              <Loader />
            ) : (
              trendingBlog.map((blog, i) => {
                return (
                  <AnimationWrapper key={i}>
                    <MinimialBlogPost blog={blog} index={i} />
                  </AnimationWrapper>
                );
              })
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
                    <button className="tag" key={i}>
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
                trendingBlog.map((blog, i) => {
                  return (
                    <AnimationWrapper key={i}>
                      <MinimialBlogPost blog={blog} index={i} />
                    </AnimationWrapper>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default HomePage;
