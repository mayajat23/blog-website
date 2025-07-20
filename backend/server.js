import 'dotenv/config';
import express from "express";
import bcrypt from "bcryptjs";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import User from './schema/User.js';
import admin from "firebase-admin";
import fs from 'fs';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getAuth } from "firebase-admin/auth"
import { url } from 'inspector';
import dotenv from "dotenv";
// import serviceAccountKey from './blog-website-964b0-firebase-adminsdk-fbsvc-39d8f94ba4.json' assert { type: "json" };
import Blog from './schema/Blog.js';


const serviceAccountKey = JSON.parse(
  fs.readFileSync('./blog-website-964b0-firebase-adminsdk-fbsvc-39d8f94ba4.json', 'utf8')
);



const server = express();
server.use(cors());
server.use(express.json());
connectDB();
const PORT = 3000;

admin.initializeApp({
     credential: admin.credential.cert(serviceAccountKey)
})

let emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;    // regex for password

//setting up s3 bucket

dotenv.config();

const s3 = new S3Client({
  region: "eu-north-1", 
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const generateUploadURL = async () => {
  const imageName = `${nanoid()}.jpeg`;

  const command = new PutObjectCommand({
    Bucket: "blog-website-everyview",
    Key: imageName,
    ContentType: "image/jpeg",
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return url;
};

const verifyJWT = (req, res, next) => {

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];

  if(token == null){
    return res.status(401).json({ error: "No access token" })
  }

  jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
    if(err){
      return res.status(403).json({ error: "Access token is invalid" })
  
    }

    req.user = user.id
    next()
  })

}

const formatDatatoSend = (user) => {

  const access_token = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY)

  return{
    access_token,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname
  }
}




const generateUsername = async (email) => {
  let username = email.split("@")[0];

  let isUsernameNotUnique = await User.exists({ "personal_info.username": username }).then((result) => result)
  isUsernameNotUnique ? username += nanoid().substring(0,5) : "";
  return username


} 


//upload img url route
server.get('/get-upload-url', (req, res) => {
  generateUploadURL().then(url => res.status(200).json({ uploadURL: url }))
  .catch(err => {
    console.log(err.message);
    return res.status(500).json({ error: err.message })
  })
})

//signup
server.post("/signup", (req, res) => {
   
  const  { fullname, email, password } = req.body;

    //validating the data from frontend
    if(fullname.length < 3 ){
         return res.status(403).json({ "error": "fullname must be at least 3 letters long" });

    }
    if(!email.length){
        return res.status(403).json({ "error": "enter email" })
    }
    if(!emailRegex.test(email)){
        return res.status(403)
.json({ "error": "email is invalid" })   
 }

 if(!passwordRegex.test(password)){
    return res.status(403).json({ "error": "password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters" })
 }

 bcrypt.hash(password, 10, async (err, hashed_password) => {

    let username = await generateUsername(email);
    
    let user = new User({
        personal_info: { fullname, email, password: hashed_password, username }
    })

    user.save().then((u) => {
        return res.status(200).json(formatDatatoSend(u))
    })
    .catch(err => {
      if(err.code == 11000) {
        return res.status(500).json({ "error": "email already exists" })
      }
        return res.status(500).json({ "error": err.message })
    })

    

 }) 


      //  return res.status(200).json({ "status": "okay" });



})

//signin
server.post("/signin", (req, res) => {

  const { email, password } = req.body;

  User.findOne({ "personal_info.email": email })
  .then((user) => {

    if(!user){
     return res.status(403).json({ "error": "email not found" });
    }

    if(!user.google_auth){
       bcrypt.compare(password, user.personal_info.password, (err, result) => {

      if(err) {
        return res.status(403).json({ "error": "error occured while login please try again"});
      }

      if(!result){
         return res.status(403).json({ "error": "incorrect password" });
      } else {
        return res.status(200).json(formatDatatoSend(user))
      }

    })
    // console.log(user)
    // return res.json({ "status": "got user document"})
  } 
  else {
    return res.status(403).json({ "error": "account was created using google. try logging in with google."})
  }
    })

   
  .catch(err => {
    console.log(err.message)
    return res.status(500).json({ "error": err.message })
  })



})

// goggle auth
server.post("/google-auth", async (req, res) => {

  let { access_token } = req.body;

  getAuth()
  .verifyIdToken(access_token)
  .then(async (decodedUser) => {
   
    let { email, name, picture } = decodedUser;

    picture = picture.replace("s96-c", "s384-c");

    let user = await User.findOne({"personal_info.email": email}).select("personal_info.fullname personal_info.username personal_info.profile_img google_auth").then((u) => {
      return u || null
    })
    .catch(err => {
      return res.status(500).json({"error": err.message })
    })

    if(user){ //have to log in the user
      if(!user.google_auth){
        return res.status(403).json({ "error": "this email was signed up without google. please log in with password to access the  account"})
      }

    }
    else { //sign up ( first time with google)
         
      let username = await generateUsername(email);
      user = new User({
        personal_info: { fullname: name, email, profile_img: picture , username },
        google_auth: true
      })

      await user.save().then((u) => {
        user = u;
      })
      .catch(err => {
       return res.status(500).json({"error": err.message })
      })
    }

    return res.status(200).json(formatDatatoSend(user))

  })

  .catch(err => {
    return res.status(500).json({"error": "failed to authenticate you with google. try with some other google account" })
  })

})

// latest blogs
server.post('/latest-blogs', (req, res) => {

  let { page } = req.body;

  let maxLimit = 5;

  Blog.find({ draft: false })
  .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
  .sort({ "publishedAt": -1 })
  .select("blog_id title des banner activity tags publishedAt -_id")
  .skip((page - 1) * maxLimit)
  .limit(maxLimit)
  .then(blogs => {
    return res.status(200).json({ blogs })
  })
  .catch(err => {
    return res.status(500).json({ error: err.message })
  })

})

// all-latest-blogs-count
server.post("/all-latest-blogs-count", (req, res) => {

  Blog.countDocuments({ draft: false })
  .then(count => {
    return res.status(200).json({ totalDocs: count })
  })
  .catch(err => {
    console.log(err.message);
    return res.status(500).json({ error: err.message })
  })
})


// treanding blogs
server.get("/trending-blogs", (req, res) => {
  
  Blog.find({ draft: false })
   .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
   .sort({ "activity.total_read": -1, "activity.total_likes": -1, "publishedAt": -1 })
   .select("blog_id title publishedAt -_id")
   .limit(5)
   .then(blogs => {
    return res.status(200).json({ blogs })
   })
   .catch(err => {
    return res.status(500).json({ error: err.message })
   })
   
})


// search-blogs
server.post("/search-blogs", (req, res) => {

  let { tag, query, author, page, limit, eliminate_blog } = req.body;

  let findQuery;

  if(tag){
      findQuery = { tags: tag, draft: false, blog_id: { $ne: eliminate_blog } };
  } else if(query){
       findQuery = { draft: false, title: new RegExp(query, 'i') }   //search by blogs' name (query)
  } else if(author){
       findQuery = { author, draft: false }
  }

  let maxLimit = limit ?  limit : 2;

  Blog.find(findQuery)
 .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
  .sort({ "publishedAt": -1 })
  .select("blog_id title des banner activity tags publishedAt -_id")
  .skip((page - 1)* maxLimit)
  .limit(maxLimit)
  .then(blogs => {
    return res.status(200).json({ blogs })
  })
  .catch(err => {
    return res.status(500).json({ error: err.message })
  })
  
})


// search-blogs-count
server.post("/search-blogs-count", (req,res) => {

  let { tag, author, query } = req.body;

  let findQuery;

  if(tag){
      findQuery = { tags: tag, draft: false };
  } else if(query){
       findQuery = { draft: false, title: new RegExp(query, 'i') }   //search by blogs' name (query)
  } else if(author){
       findQuery = { author, draft: false }
  }

  Blog.countDocuments(findQuery)
  .then(count => {
    return res.status(200).json({ totalDocs: count })
  })
  .catch(err => {
    console.log(err.message)
    return res.status(500).json({ error: err.message })
  })

})



// search-users
server.post("/search-users", (req,res) => {
  
  let { query } = req.body;

  User.find({ "personal_info.username": new RegExp(query, 'i') })
  .limit(50)
  .select("personal_info.fullname personal_info.username personal_info.profile_img -_id")
  .then(users => {
    return res.status(200).json({ users })
  })
  .catch(err => {
    return res.status(500).json({ error: err.message})
  })

})



// get profile
server.post("/get-profile", (req,res) => {
    
  let { username } = req.body;

  User.findOne({ "personal_info.username": username })
  .select("-personal_info.password -google_auth -updatedAt -blogs")
  .then(user => {
    return res.status(200).json(user)
  })
  .catch(err => {
    console.log(err);
    return res.status(500).json({ error: err.message } )
  })

})



//create-blog
server.post('/create-blog', verifyJWT, (req, res) => {

  let authorId = req.user;
 
    let { title, des, banner, tags, content, draft } = req.body;

    if(!title.length){
      return res.status(403).json({ error: "You must provide a title"})
    }

    if(!draft){

      if(!des.length){
      return res.status(403).json({ error: "You must provide blog description ubder 200 characters" });
     }
     if(!banner.length){
      return res.status(403).json({ error: "You must provide blog banner to publish it"});
     }

     if(!content.blocks.length){
      return res.status(403).json({ error: "There must be some blog content to publish it"});
     } 
     if(!tags.length || tags.length>10){
      return res.status(403).json({ error: "Provide tags in order to publish the blog, Maximum 10"});
     }
    }

    
     if (Array.isArray(tags)) {
  tags = tags.map(tag => tag.toLowerCase());
} else {
  tags = [];
}


     let blog_id = title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, "-").trim() + nanoid();
    
     let blog = new Blog({
      title, des, banner, content, tags, author: authorId, blog_id, draft: Boolean(draft)
     })

     blog.save().then(blog => {

      let incrementVal = draft ? 0 : 1 ;

      User.findOneAndUpdate({ _id: authorId }, { $inc : { "account_info.total_posts" : incrementVal }, $push : { "blogs": blog._id } })
      .then(user => {
        return res.status(200).json({ id: blog.blog_id })
      })
      .catch(err => {
        return res.status(500).json({ error: "Failed to update total posts number" })
      })

     })
     .catch(err => {
      return res.status(500).json({ error: "err.message" })
     })

    
  
})


// get blog
server.post("/get-blog", (req,res) => {

  let { blog_id } = req.body;
  let incrementVal = 1;

  Blog.findOneAndUpdate({ blog_id }, { $inc: { "activity.total_reads": incrementVal } })
  .populate("author", "personal_info.fullname personal_info.username personal_info.profile_img")
  .select("title des content banner activity publishedAt blog_id tags")
  .then(blog => {

    User.findOneAndUpdate({ "personal_info.username": blog.author.personal_info.username }, {
      $inc: { "account_info.total_reads": incrementVal }
    })
    .catch(err => {
      return res.status(500).json({ error: err.message })
    })
    return res.status(200).json({ blog });

  })
  .catch(err => {
    return res.status(500).json({ error: err.message });
  })
})


server.listen(PORT, () => {
    console.log("listening on port ->" + PORT);
});
