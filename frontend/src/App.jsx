import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css"
import './App.css'
import { Route, Routes } from "react-router-dom";
import UserAuthForm from "./pages/userAuthForm.page";
import AnimationWrapper from "./common/page-animation";
import { createContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { lookInSession } from "./common/session";
import Navbar from "./components/navbar.component.jsx";
import Editor from "./pages/editor.page.jsx";
import HomePage from "./pages/home.page.jsx";
import SearchPage from "./pages/search.page.jsx";
import PageNotFound from "./pages/404.page.jsx";
import ProfilePage from "./pages/profile.page.jsx";
import BlogPage from "./pages/blog.page.jsx";

 export const UserContext = createContext({})

const App =() => {

  const [userAuth, setUserAuth] = useState();

  useEffect(() => {

    let userInSession = lookInSession("user");

    userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ access_token: null })
  }, [])
  
  return (
  <>
<ToastContainer
  position="top-center"
  autoClose={3000}
  
/>

  <UserContext.Provider value={{userAuth, setUserAuth}}>
  
    
    <Routes>
      <Route path="/editor" element={<Editor />} />
      <Route path="/editor/:blog_id" element={<Editor />} />
      <Route  path="/" element={<Navbar />}>
      <Route index element={<HomePage />} />
       <Route  path="signin" element={<UserAuthForm type="sign-in" />} />
       <Route  path="signup" element={<UserAuthForm type="sign-up" />} />
       <Route path="search/:query" element={<SearchPage />} />
       <Route  path="user/:id" element={<ProfilePage />}/>
       <Route path="blog/:blog_id" element={<BlogPage />} />
       <Route path="*"  element={<PageNotFound />}/>
      </Route>
    </Routes>
    </UserContext.Provider>
  </>
    
   
  )

}

export default App;
