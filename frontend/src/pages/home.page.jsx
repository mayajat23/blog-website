import { useEffect } from "react";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import axios from "axios"
import { useState } from "react";
import Loader from "../components/loader.component";
import BLogPostCard from "../components/blog-post.component";
const HomePage =  () => {

    let [ blogs, setBlog ] = useState(null);

    const fetchLatestBlogs = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs")
        .then(({ data }) => {
           setBlog(data.blogs);
        })
        .catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        fetchLatestBlogs();
    }, [])
    return (
        <AnimationWrapper>
           <section className="h-cover homepage">
            {/* latest blogs */}
            <div className="latest-blogs">
                <InPageNavigation routes={["home", "trending blogs"]} defaultHidden={["trending blogs"]}>
                  <>
                  {
                    blogs == null ? <Loader /> :
                    blogs.map((blog, i) => {
                        return <AnimationWrapper key={i}><BLogPostCard content={blog} author={blog.author.personal_info}/></AnimationWrapper>
                    })
                  }
                  </>
                   <h1>Treading blogs here</h1>
                </InPageNavigation>

            </div>

            {/* filters and treanding blogs */}
            <div>

            </div>

           </section>
        </AnimationWrapper>
    )
}

export default HomePage;