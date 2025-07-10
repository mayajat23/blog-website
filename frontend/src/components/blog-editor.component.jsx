import { Link, useNavigate } from "react-router-dom";
import logo from "../imgs/logo (3).png";
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blog banner.png";
import { uploadImage } from "../common/aws";
import { useContext, useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import { toast } from "react-toastify";
import { EditorContext } from "../pages/editor.page";
import { tools } from "./tools.component";
import axios from "axios";
import { UserContext } from "../App";

const BlogEditor = () => {

    
    let { blog, blog: { title, banner, content, tags, des }, setBlog, textEditor, setTextEditor, setEditorState } = useContext(EditorContext)
   
    let { userAuth = {} } =useContext(UserContext);
    let { access_token } = userAuth;

    let navigate = useNavigate();

    // useEffect
   useEffect(() => {
    if(!textEditor.isReady){
      setTextEditor(new EditorJS({
        holder: "textEditor",
        data: content,
        tools: tools,
        placeholder: "Let's write an awesome story"
      }))
    }
   

   }, [])

 const handleBannerUpload = (e) => {
    console.log(e);
    let img = e.target.files[0];
    // console.log(img);

    if(img){

        let loadingToast = toast.loading("Uploading...")
        uploadImage(img).then((url) => {

            if(url){

                toast.dismiss(loadingToast);
                toast.success("Uploaded👍");
              

               setBlog({ ...blog, banner: url })
            }
        })
        .catch(err => {
            toast.dismiss(loadingToast);
            return toast.error(err);
        })
    }
 }
 
 const handleTitleKeyDown = (e) => {
//  console.log(e);
 if(e.keyCode == 13){     //enter key
    e.preventDefault();
 }
 }

 const handleTitleChange = (e) => {
    
    let input = e.target;
 console.log(input.scrollHeight);
    input.style.height = 'auto';
    input.style.height = input.scrollHeight + "px";

     setBlog({ ...blog, title: input.value })


 }
 const handleError = (e) => {
    let img = e.target;
   img.src = defaultBanner;

 }

 const handlePublishEvent = () => {

    if( !banner.length){
        return toast.error("Upload a blog banner to publish it")
    }
    if(!title.length){
        return toast.error("Write blog title to publish it")
    }
    if(textEditor.isReady){
        textEditor.save().then(data => {
            if(data.blocks.length){
                setBlog({ ...blog, content: data })
                setEditorState("publish")
            } else{
                return toast.error("Write something in your blog to publish it")
            }
        })
        .catch((err) => {
          console.log(err);
        })
    }
 }

 const handleSaveDraft = (e) => {
       if(e.target.className.includes("disable")){
          return;
      }
        
      if(!title.length){
          return toast.error("Write blog title before savivg it as a draft")
      }
     
  
       let loadingToast = toast.loading("Saving Draft...");
  
       e.target.classList.add('disable');
  
        if(textEditor.isReady){
        
           textEditor.save().then(content => {

              let blogObj = {
             title, banner, des, tags, content, draft: true
             }

             axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", blogObj, {
              headers: {
              'Authorization': `Bearer ${access_token}`
              }
             })
             .then(() => {
             e.target.classList.remove('disable');
  
             toast.dismiss(loadingToast);
             toast.success("Saved👍");
  
              setTimeout(() => {
              navigate("/")
             }, 500);

              })
             .catch(( { response } ) => {

             e.target.classList.remove('disable');
             toast.dismiss(loadingToast);

             return toast.error(response.data.error)
             })

            })
        }
       
       
    }

    return (
        <>
        <nav className="navbar">
            <Link to="/" className="logo-img">
            <img src={logo} />
            </Link>
            <p className="new-blog">
                { title.length ? title : "New Blog" }
                
            </p>

            <div className="editorpage-btn">
                <button className="publish-btn btn-dark" onClick={handlePublishEvent}>
                    Publish
                </button>

                  <button className="save-draft-btn btn-light" onClick={handleSaveDraft}>
                    Save Draft 
                </button>
            </div>
        </nav>

        <AnimationWrapper>
         <section>
            <div className="blog-container">

                <div className="blog-banner">
                  <label htmlFor="uploadBanner">
                    <img
                     
                    src={banner || "brokrn-path.png"}
                    className="banner-img" 
                    onError={handleError}
                    alt=""
                    />
                    <input
                    id="uploadBanner"
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    hidden
                    onChange={handleBannerUpload}
                    />
                  </label>

                </div>

                <textarea 
                defaultValue={title}
                placeholder="Blog Title"
                className="blogtitle"
                onKeyDown={handleTitleKeyDown}
                onChange={handleTitleChange}
                >

                </textarea>

                <hr  className="hr-tag"/>

                <div  id="textEditor"    className="">

                </div>


            </div>
         </section>
           

        </AnimationWrapper>



        </>
    )
}

export default BlogEditor;