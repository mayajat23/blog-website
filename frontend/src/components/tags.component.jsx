import { useContext } from "react";
import { RxCross2 } from "react-icons/rx";
import { EditorContext } from "../pages/editor.page";


const Tag = ({ tag, tagIndex }) => {

   let { blog: { tags }, setBlog, blog } = useContext(EditorContext);


    const addEditable =(e) => {
        e.target.setAttribute("contentEditable", true);
        e.target.focus();
    }

    const handleTagEdit = (e) => {
        if(e.keyCode == 13 || e.keyCode == 188){
            e.preventDefault();

           let currentTag = e.target.innerText;

           tags[tagIndex] = currentTag;

           setBlog({ ...blog, tags });

           e.target.setAttribute("contentEditable", false);

        }
    }

    const handleTagDelete = () => {
        tags = tags.filter(t => t != tag);
        setBlog({ ...blog, tags })
    }
    return (
       <div className="tags">
        <p className="tag-text" onKeyDown={handleTagEdit} onClick={addEditable}>{tag}</p>
        <button className="cross-btn"  onClick={handleTagDelete}>
          <RxCross2 className="x-icon"/>
        </button>
       </div>
    )
}
export default Tag;