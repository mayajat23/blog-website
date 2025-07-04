import googleIcon from "../imgs/google.png";
import { RiUserLine } from "react-icons/ri";
import { MdOutlineEmail } from "react-icons/md";
import { IoKeyOutline } from "react-icons/io5";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";
import { useState } from "react";
import { useEffect } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import { useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { storeInSession } from "../common/session";
import { useContext } from "react";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/googleauth";
import Navbar from "../components/navbar.component";


const UserAuthForm = ({ type }) => {

    const [ passwordVisible, setPasswordVisible ] = useState(false);
    const location =useLocation();



    const authForm = useRef();

    const { userAuth = {}, setUserAuth } = useContext(UserContext);
    const { access_token } = userAuth;

    console.log(access_token);
    


    const userAuthThroughServer = (serverRoute, formData) => {

        

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
        .then(({ data }) => {
            // console.log(data);
            storeInSession("user", JSON.stringify(data))
            // console.log(sessionStorage)
            setUserAuth(data)

        })
        .catch (({ response }) => {
            toast.error(response.data.error)
        })

    }

    const handleSubmit = (e) => {

        
         e.preventDefault();

         let serverRoute = type == "sign-in" ? "/signin" : "/signup" ;

         let emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/; // regex for email
         let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;    // regex for password

// formData
        let form = new FormData(authForm.current);
        // console.log(form);
        let formData = {};

        for(let [key, value ] of form.entries()){
            formData[key] = value;
        }

        // console.log(formData);

        let { fullname, email, password } = formData;

        // form validation
        if(fullname){
           if(fullname.length < 3 ){
         return toast.error( "fullname must be at least 3 letters long" );

           }
        }
        
    if(!email.length){
        return toast.error( "enter email" )
    }
    if(!emailRegex.test(email)){
        return toast.error("email is invalid")   
    }

    if(!passwordRegex.test(password)){
    return toast.error( "password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters" )
    }

    userAuthThroughServer(serverRoute, formData)

    }


    const handleGoogleAuth = (e) => {
        e.preventDefault();

        authWithGoogle().then(user => {
           
            let serverRoute = "/google-auth";

            let formData = {
                access_token: user.accessToken

            }

            userAuthThroughServer(serverRoute, formData)


        })
        .catch(err => {
            toast.error('trouble login through google');
            return console.log(err)
        })

    }


    const slides = [
  { 
    image: ["/spoon1.png", "/spoon2.png", "/food.png", "/cheery.png"], 
    bgColor: "#d32f2f" 
},

  { 
    image: ["/suitcase.png", "/passport.png", "/camera.png", "/drink.png"], 
    bgColor: "#9acd32" 
},

  {
     image: ["/robo.png", "phone.png", "/headphn.png", "/m2.png"], 
     bgColor: "#0288d1" 
    },
];

const [current, setCurrent] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, 3000);  // slow a bit for testing
  return () => clearInterval(interval);
}, []);
const [isActive, setIsActive] = useState(false);

useEffect(() => {
  setIsActive(false);
  const timeout = setTimeout(() => {
    setIsActive(true);
  }, 50); // short delay
  return () => clearTimeout(timeout);
}, [current]);



    return (
        access_token ?
        <Navigate to="/" />



        :
        <AnimationWrapper key={location.pathname}>
        <div
         className="auth-bg-wrapper"
  style={{ backgroundColor: slides[current].bgColor }}
>
 {slides[current].image.map((src, i) => (
  <img
    key={i}
    src={src}
    className={`auth-bg-image position-${i} ${isActive ? "active" : ""}`}
    
    alt=""
  />
))}




              <section className="h-cover authform-container">
            <form ref={authForm} className="authform">
                <h1 className="text">
                    {type == "sign-in" ? "Welcome back!" : "join us now"}
                </h1>
               
               {
                 type !== "sign-in" ?
                 <div className="input-box-container">
                  <input
                  name="fullname"
                  type="text"
                  placeholder="full name"
                  className="input-box"
                 />
                 <RiUserLine className="user-icon"  />
                
                
                 
                  
                 </div>
                 : ""
               }
                <input
                  name="email"
                  type="text"
                  placeholder="email"
                  className="input-box"
                 /> 
                 <span className="mail-icon-span">
                    <MdOutlineEmail className="mail-icon" />
                 </span>
                 
                  <input
                  name="password"
                  type={passwordVisible ? "text" : "password"}
                  placeholder="password"
                  className="input-box"
                 />
                 <span className="password-icon-span">
                    <IoKeyOutline className="password-icon" />
                     </span>
                 {
                    passwordVisible ? (
                        <span className="eye-icon-span">
                       <AiOutlineEye className="eye-icon" onClick={() => setPasswordVisible(false)} /> 
                        </span>
                    ) : (
                        <span className="eye-icon-span">
                         <AiOutlineEyeInvisible  className="eye-icon" onClick={() => setPasswordVisible(true)}/>
                            </span>
                    )
                 }

                
                 

               <button className="signup-btn"
               type="submit"
               onClick={handleSubmit}>
                { type.replace("-", " ")}

               </button>

               <div className="or-separator">
                <hr className="line" />
                <p>or</p>
                <hr className="line" />

               </div>

                <div className="google-wrapper">
                     <button className=" google-container" onClick={handleGoogleAuth}>
                <img src={googleIcon} className="google-icon" />
                continue with Google
               </button>
                </div>

                {
                    type == "sign-in" ?
                    <p className="account-container">
                        Don't have an account ?
                        <Link to="/signup" className="account" >
                        Join us today
                        </Link>
                    </p>
                    :
                    <p className="account-container">
                        Already a member ?
                        <Link to="/signin" className="account" >
                        Sign in here.
                        </Link>
                    </p>
                }
              
            </form>

        </section>
        </div>
        </AnimationWrapper>
       
    )

}
export default UserAuthForm;