import { useEffect } from "react";
import { useRef, useState } from "react";

export let activeTabLineRef;
export let activeTabRef;

const InpageNavigation = ({ routes,defaultHidden = [], defaultActiveIndex = 0, children }) => {

    activeTabLineRef = useRef();
    activeTabRef = useRef();
    
    let [ inPageNavIndex, setInPageNavIndex ] =useState(defaultActiveIndex);

    const changePageState = (btn, i) => {
        let { offsetWidth, offsetLeft } = btn;

        activeTabLineRef.current.style.width = offsetWidth + "px";
        activeTabLineRef.current.style.left = offsetLeft + "px";

        setInPageNavIndex(i);

    }
    useEffect(() => {
         changePageState( activeTabRef.current, defaultActiveIndex )
    }, [])

    return(
       <>
       <div className="scroll-container">
        {
            routes.map((route, i) => {
                return (
                    <button ref={ i === defaultActiveIndex ? activeTabRef : null } key={i} className={ `btns ${inPageNavIndex === i ? "active" : "inactive"} ${defaultHidden.includes(route) ? "btns-hidden" : " " }`} onClick={(e) => { changePageState(e.target, i) }} >
                        { route }
                    </button>
                )
            })
        }
        <hr  ref={activeTabLineRef} className="tabline"/>

       </div>
       { Array.isArray(children) ? children[inPageNavIndex] : children }
       </>
    )
}

export default InpageNavigation;