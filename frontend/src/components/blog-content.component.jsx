

const Img = ({ url, caption }) => {
    return (
        <div>
            <img src={url}/>
            { caption.length ? <p className="img-caption">{caption}</p> : "" }
        </div>
    )
}

const Quote = ({ quote, caption}) => {
    return (
        <div className="quote-container">
            <p className="content-quote">{quote}</p>
            {caption.length ? <p className="quote-caption">{caption}</p> : ""}
        </div>
    )
}

const List = ({ style, items }) => {
    return (
        <ol className={`list-container ${style === "ordered" ? "ordered" : ""}`}>
            {
                items.map((listItem, i) => {
                    

                    return <li key={i} className="list" dangerouslySetInnerHTML={{ __html: listItem.content }} ></li>
                

                })
            }
        </ol>
    )
    
}
const BlogContent = ({ block }) => {
   
        let { type, data } = block;
            
        if(type == "paragraph"){
            return <p dangerouslySetInnerHTML={{ __html: data.text }}></p>
        }
        if(type == "header"){
            if(data.level == 3){
                return <h3 className="data-level-h3" dangerouslySetInnerHTML={{ __html: data.text }}></h3>
            }
              return <h2 className="data-level-h2" dangerouslySetInnerHTML={{ __html: data.text }}></h2>
        }

        if(type == "image"){
            return <Img  url={data.file.url} caption={data.caption}/>
        }

        if(type == "quote"){
            return <Quote quote={data.text} caption={data.caption} />
        }
         if(type == "list"){
            return <List style={data.style} items={data.items} />
            
         }
    
}

export default BlogContent;