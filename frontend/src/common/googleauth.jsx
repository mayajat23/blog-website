import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebaseConfig from '../common/firebase';


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

//google auth
const provider = new GoogleAuthProvider();

const auth = getAuth();

 export const authWithGoogle = async () => {

  let user = null;

  await signInWithPopup(auth, provider)
  .then((result) => {
    user = result.user
  })
  .catch((err) => {
    console.log(err)
  })
   return user;

}