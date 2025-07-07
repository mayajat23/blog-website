import AnimationWrapper from "../common/page-animation";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RxCross2 } from "react-icons/rx";
import { useContext } from "react";
import { EditorContext } from "../pages/editor.page";
import Tag from "./tags.component";
import axios from "axios";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";


const PublishForm = () => {

    let characterLimit = 200;
    let tagLimit =10;

    let { blog = {}, setEditorState, setBlog } = useContext(EditorContext);
    let { banner, title, des, tags = [], content } = blog;

    let { userAuth = {} } = useContext(UserContext);
    let { access_token } = userAuth;

    let navigate = useNavigate();

    const handleCloseEvent = () => {
       setEditorState("editor")
    }


    const handleBlogTitleChange = (e) => {
       let input = e.target;

       setBlog({ ...blog, title: input.value })

    }

    const handleBlogDesChange = (e) => {
        let input = e.target;

        setBlog({ ...blog, des: input.value })

    }

    const handleTitleKeyDown = (e) => {
//  console.log(e);
 if(e.keyCode == 13){     //enter key
    e.preventDefault();
 }
 }

 const handleKeyDown = (e) => {
   if(e.keyCode == 13 || e.keyCode == 188){    //enter key and comma
      e.preventDefault();

      let tag = e.target.value;
      if(tags.length < tagLimit){
         if(!tags.includes(tag) && tag.length){
              setBlog({ ...blog, tags: [ ...tags, tag ] })
            }
        } else{
             toast.error(`You can add max ${tagLimit} Tags`)
        }

        e.target.value = "";
   }
 }


 const publishBlog = (e) => {

    if(e.target.className.includes("disable")){
        return;
    }
      
    if(!title.length){
        return toast.error("Write blog title before publishing")
    }
    if(!des.length || des.length > characterLimit){
         return toast.error(`Write a description about your blog within ${characterLimit} characters to publish`)
    }
    if(!tags.length){
         return toast.error("Enter atleast 1 tag to help us rank your blog")
    }

     let loadingToast = toast.loading("Publishing...");

     e.target.classList.add('disable');

     let blogObj = {
      title, banner, des, tags, content, draft: false
     }

     axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", blogObj, {
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
     } )
     .then(() => {
        e.target.classList.remove('disable');

        toast.dismiss(loadingToast);
        toast.success("Published👍");

        setTimeout(() => {
         navigate("/")
        }, 500);
     })
     .catch(( { response } ) => {
      e.target.classList.remove('disable');
      toast.dismiss(loadingToast);
       return toast.error(response.data.error)
     })


 }

    return (
        <AnimationWrapper>
            <section className="preview-page">

            <ToastContainer />

            <button className="x-btn" onClick={handleCloseEvent}>
                <RxCross2 />
            </button>


            <div className="preview-container">
                <p className="preview-text">
                 Preview
                </p>


                <div className="banner-preview">
                    <img src={banner} />
                </div>

                <h1 className="title-text">
                  {title}
                </h1>

                <p className="des-text"> { des }</p>
            </div>
 
            <div className="content-div">
             <p className="blog-title-preview">Blog Title</p>
             <input type="text" placeholder="Blog Title" defaultValue={title} className="input-box blog-inputbox" onChange={handleBlogTitleChange}/>

             <p className="blog-title-preview">Short description about your blog </p>
             <textarea 
              maxLength={characterLimit}
              defaultValue={des}
              className="des-textarea input-box"
              onChange={handleBlogDesChange}
              onKeyDown={handleTitleKeyDown}
              >

             </textarea>
             
             <p className="characters-left">{ characterLimit - des.length } characters left</p>
             <p className="blog-title-preview">Topics - ( Helps in searching and ranking your blog post )</p>

             <div className="input-box topics">
                <input  type="text" placeholder="Topic" className="topic-input input-box" onKeyDown={handleKeyDown}/>
              
               { 
                  tags.map((tag, i) => {
                      return <Tag tag={tag} tagIndex={i} key={i} />
                   })
                }

                
             </div>

             <p className="tags-left">{ tagLimit - tags.length } Tags left</p>

             <button className="btn-dark publish-btn-preview" onClick={publishBlog}>
                Publish
             </button>

            </div>

            </section>
        </AnimationWrapper>
    )
}

export default PublishForm;