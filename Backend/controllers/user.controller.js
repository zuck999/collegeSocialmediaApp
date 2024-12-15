
import { User } from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt  from "jsonwebtoken";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudanary.js";
import path from 'path';
path.resolve('../model/user.model.js');
import {Post} from '../model/post.model.js';


// app.use(express.urlencoded({ extended: true }));

export const register = async (req,res)=>{
    try{
        
        const {username,email,password,faculty} = req.body;
        console.log("req.body>>",req.body);
        if(!email||!password||!username||!faculty){
            return res.status(401).json({
                message:"All fields are required",
                success:false
            });
        };

        const u_name_check = await User.findOne({username})
        if(u_name_check){
            return res.status(401).json({
                message:"username already exist",
                success:false
            });
        }

        const user = await User.findOne({email});
        if(user){
            return res.status(401).json({
                message:"username already exist",
                success:false
            });
        };

        let hashedPassword = await bcrypt.hash(password,10);
        await User.create({
            username,
            email,
            faculty,
            password:hashedPassword
        });

        return res.status(201).json({
            message: "user created successfully",
            success:true,
        });

    }catch(err){
        console.log("error:",err);
    }
    }

 //                   #######--------login--------#######


export const login = async(req,res)=>{
    try{

        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                message:"something is missing",
                success:false
            });
        }

        if(email==process.env.EMAIL && password == process.env.PASSWORD){

           const user = {
                _id:"64891aefd53c9e0aaf2b91a7",
                username:'Admin',
                email:"--",
                profilePicture:"https://static.vecteezy.com/system/resources/previews/000/290/610/non_2x/administration-vector-icon.jpg",
                hobby:"--",
                faculty:"⚙️",
                post:null
            }

        const token = await jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:"1d"});
        

        return res.cookie("token",token,{httpOnly:true,sameSite:"strict",maxAge: 1*24*60*60*1000}).json({
            message:"Welcom back, Chief",
            success: true,
            user
        });
           
    }


        let user = await User.findOne({email});

        if(!user){
            return res.status(401).json({
                message:"email doesnot exixt",
                success:false
            });
        }

        const isPassword = await bcrypt.compare(password,user.password);
        if(!isPassword){
            console.log("passoord milena");
            res.status(401).json({
                message:"invalid email or password",
                success:false
            });
        }


        const populatedPost = await Promise.all(
            user.post.map(async(postId)=>{
                const post = await Post.findById(postId);
                console.log("post>>>",post.author);
                if(post.author.equals(user._id)){
                    return post
                }return null;
            })
        );
        

        user = {
            _id:user._id,
            username:user.username,
            email:user.email,
            profilePicture:user.profilePicture,
            hobby:user.hobby,
            faculty:user.faculty,
            post:populatedPost
        }

        const token = await jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:"1d"});
        //populate each post in the post array...
        

        return res.cookie("token",token,{httpOnly:true,sameSite:"strict",maxAge: 1*24*60*60*1000}).json({
            message:`hello ${user.username} 👋`,
            success: true,
            user
        });
 
    }catch(err){
        console.log("error:",err);
    }
}

export const logout  = async (_,res) => {
    try{
        return res.cookie("token","",{maxAge:0}).json({
            message: "logged out successfully",
            success:true,
        });

    }catch(err){
        console.log("error:",err);
    }
}

export const getprofile = async(req,res)=>{
    console.log("hello from getProfile");
    try{
        const userId = req.params.id;
        const user = await User.findById(userId).populate("post");

        return res.status(200).json({
            user,
            success:true,
        });
    }catch(err){
        console.log("error:",err);
    }
}

export const editProfile = async (req,res)=>{
    try{

        const userId = req.id;
        const {hobby , gender} = req.body;
        let profilePicture = req.file;
        let cloudResponse;
        
        if(profilePicture){
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }
        console.log(cloudResponse);
        const user = await User.findById(userId);
        if(!user){
           return res.status(404).json({
            message:"user not found",
            success:false
           });
        };
        if(hobby) user.hobby = hobby;
        if(gender) user.gender = gender;
        if(profilePicture) user.profilePicture = cloudResponse.secure_url;


        await user.save()
        return res.status(200).json({
            message:" profile updated ",
            success:true,
            user
        });
    }catch(err){
        console.log("error:",err);
    }
};

export const getSuggestedUsers = async (req,res)=>{
    try{

        const suggestedUsers = await User.find({ 
            _id: { $nin: [req.id, "64891aefd53c9e0aaf2b91a7"] } 
        }).select("-password");
            
        if(!suggestedUsers){
            return res.status(401).json({
                messgaer:"dont have suggestion",
            })
        }

        return res.status(200).json({
            success:true,
            users:suggestedUsers,
        });

    }catch(err){
        console.log("err:",err);
    }
}


const addFriends = async (req, res) => {
    try {
        const userId = req.params.id; // Friend user id
        const currentUserId = req.id; // logged-in user id

        const user = await User.findById(currentUserId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.friends.includes(userId)) {
            return res.status(400).json({
                success: false,
                message: "User is already in your friends list"
            });
        }

        user.friends.push(userId);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Friend added successfully"
        });

    } catch (err) {
        console.error("Error>>:", err);
        return res.status(500).json({
            success: false,
            message: "An error occurred while adding the friend"
        });
    }
};




// export const followOrUnfollow = async (req,res)=>{
//     try{
//         const followGarneWala = req.id;
//         const jolaiFollowGarneHo = req.params.id;
        
//         if(followGarneWala === jolaiFollowGarneHo){
//             return res.Status(400).json({
//                 message:"you cant follow/unfollow",
//                 success:false,
//             });
//         };
//         const user = await User.findById(followGarneWala);
//         const targetUser = await User.findById(jolaiFollowGarneHo);

//         if(!user || !targetUser){
//             return res.Status(400).json({
//                 message:"user not found",
//                 success:false,
//             });
//         };

//         const idFollowing = user.following.includes(jolaiFollowGarneHo);//return true
//         if(idFollowing){
//             //unfollow
//             await Promise.all([
//                 User.updateOne({_id:followGarneWala},{$pull:{following:jolaiFollowGarneHo}}),
//                 User.updateOne({_id:jolaiFollowGarneHo},{$pull:{followers:followGarneWala}}),
//             ]);
//             return res.status(200).json({
//                 message:"unfollow successfully",
//                 success:true,
//             });
//         }else{
//             //follow
//             await Promise.all([
//                 User.updateOne({_id:followGarneWala},{$push:{following:jolaiFollowGarneHo}}),
//                 User.updateOne({_id:jolaiFollowGarneHo},{$push:{followers:followGarneWala}}),
//             ]);
//             return res.status(200).json({
//                 message:"followed successfully",
//                 success:true,
//             });
//         };

//     }catch(err){console.log("error:",err);}

// }

