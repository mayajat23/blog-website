import { createContext, useContext, useState } from "react";
import { UserContext } from "../App";
import { Navigate } from "react-router-dom";
import BlogEditor from "../components/blog-editor.component";
import PublishForm from "../components/publish-form.component";


const blogStructure = {
    title: '',
    banner: '',
    conent: [],
    des: '',
    author: { personal_info: { } }
}

 export const EditorContext = createContext({ });

const Editor = () => {
    
    const [blog, setBlog ] = useState(blogStructure)

    const [ editorState, setEditorState ] = useState("editor")
    const [ textEditor, setTextEditor ] = useState({ isReady: false  });

   const { userAuth } = useContext(UserContext);
const { access_token } = userAuth || {};


    return (

        <EditorContext.Provider value={{ blog, setBlog, editorState, setEditorState, textEditor, setTextEditor }}>
            {
             access_token === null ? <Navigate to="/signin" /> 
             : editorState == "editor" ? <BlogEditor /> : <PublishForm />
            }
        </EditorContext.Provider>
       
    )
}

export default Editor;