import axios from "axios";
import { useEffect, useState } from "react";
import { createContext } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { getDay } from "../common/date";
import BlogInteraction from "../components/blog-interaction.component";
import BLogPostCard from "../components/blog-post.component";
import BlogContent from "../components/blog-content.component";
import CommentsContainer, { fetchComments } from "../components/comments.component";

export const blogStructure = {
      title: '',
      des: '',
      content: [],
      tags:[],
      author: { personal_info: { } },
      banner: '',
      publishedAt: ''

}

export const BlogContext = createContext({ });

const BlogPage = () => {

    let { blog_id } =useParams()

    const [ blog, setBlog ] = useState(blogStructure);
    const [ similarBlogs, setSimilarBlogs ] = useState(null)
    const [ loading, setLoading ] = useState(true);
    const [ islikedByUser, setLikedByUser ] = useState(false);
    const [ commentsWrapper, setCommentsWrapper ] = useState(false);
    const [ totalParentCommentsLoaded, setTotalParentCommentsLoaded ] = useState(0);

    let { title, content, banner, author: { personal_info: { fullname, username: author_username, profile_img } }, publishedAt } = blog;

    const fetchBlog = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", { blog_id })

        .then(async ({ data: { blog } }) => {

            

            blog.comments = await fetchComments({ blog_id: blog._id, setParentCommentCountFun: setTotalParentCommentsLoaded })

           

            setBlog(blog);
            
           
                    

           axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { tag: blog.tags[0], limit: 6, eliminate_blog: blog_id })
           .then(({ data }) => {
               setSimilarBlogs(data.blogs);
              
           })

          
           setLoading(false);
        })
        .catch(err => {
            console.log(err);
            setLoading(false);
        })
    }

    useEffect(() => {
        resetState();
        fetchBlog();
    }, [blog_id])

    const resetState = () => {
        setBlog(blogStructure);
        setSimilarBlogs(null);
        setLoading(true);
        setLikedByUser(false);
       setCommentsWrapper(false );
        setTotalParentCommentsLoaded(0);
    }

   return (
    
       <AnimationWrapper>
        {
            loading ? <Loader /> 
            :
            <BlogContext.Provider value={{ blog, setBlog, islikedByUser, setLikedByUser, commentsWrapper, setCommentsWrapper, totalParentCommentsLoaded, setTotalParentCommentsLoaded }}>

                <CommentsContainer />

            <div className="center blog-page-container">
                <img src={banner} className="banner-of-blog" />
                <div className="blog-details">
                    <h2>{title}</h2>
                    <div className="user-div-container">
                        <div className="user-div">
                            <img src={profile_img} className="user-profile-img" />
                            <p className="author-details">
                                {fullname}
                                <br />
                                @
                                <Link to={`/user/${author_username}`} className="author-username-link">{author_username}</Link>
                            </p>
                        </div>
                        <p className="blog-published-on">Published on {getDay(publishedAt)}</p>
                    </div>
                </div>
                
                <BlogInteraction />
                {/* blog content will go over here */}
                    <div className="blog-content-container blog-page-content">
                        {
                         content && content[0] && content[0].blocks && (
                           content[0].blocks.map((block, i) => {
                           return (
                                <div key={i} className="blog-content">
                                    <BlogContent block={block} />
                                </div>
                            );

                            })
                        )
                        
                        }
                    
                    </div>
                    
                 <BlogInteraction />

                 {
                    similarBlogs != null && similarBlogs.length ?
                    <>
                        <h1 className="similar-blog-text">Similar Blogs</h1>
                        {
                            similarBlogs.map((blog, i) => {
                                let { author: { personal_info } } = blog;
                                return <AnimationWrapper key={i}>
                                    <BLogPostCard content={blog} author={personal_info} />
                                </AnimationWrapper>
                            })
                        }
                    </>
                    : " "
                 }
            </div>
            </BlogContext.Provider>
        }
       </AnimationWrapper>
   )
}

export default BlogPage;