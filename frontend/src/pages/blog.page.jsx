import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BlogPage = () => {

    let { blog_id } =useParams()

    const [ blog, setBlog ] = useState(null);

    let { title, content, banner, author: { personal_info: { fullname, username, profile_img } }, publishedAt } = blog;

    const fetchBlog = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", { blog_id })
        .then(({ data: { blog } }) => {
           setBlog(blog);
        })
        .catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
       
        fetchBlog();
    }, [])

   return (
    
       <h1>blog page- {blog.title}</h1>
   )
}

export default BlogPage;