import sharp from "sharp"
import cloudinary from "../utils/cloudanary.js";
import {Post} from "../model/post.model.js";
import { User } from "../model/user.model.js";
import { Comment } from "../model/comment.model.js";

export const addNewPost = async(req,res)=>{
    try{
        const {caption} = req.body;
        const image = req.file;
        const authorId = req.id;//authentation

        if(!image)return res.status(401).json({message:"image required"});

        //image upload
        const optimizedImageBuffer = await sharp(image.buffer)
        .resize({width:800,height:800,fit:"inside"})
        .toFormat("jpeg",{quality:80})
        .toBuffer();

        //buffer uri
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption,
            image:cloudResponse.secure_url,
            author:authorId
        });
        const user = await User.findById(authorId);

        if(user){
            user.post.push(post._id);
            await user.save();
        }

        await post.populate({path:"author",select:'-password'});

        return res.status(200).json({
            message:'new post added',
            post,
            success:true,
        });

    }catch(err){
        console.log(err);
    }
}


export const getAllPost = async(_,res)=>{
    try{
    const posts = await Post.find().sort({createdAt:1})
    .populate({path:'author',select:'username  profilePicture'}).
    populate({
        path:'comments',
        short:{createdAt:-1},
        populate:{
            path:'author',
            select:'username profilePicture'
        }
    });

    return res.status(200).json({
        posts,
        success:true,
    });

    }catch(err){
        console.log(err);
    }
}


export const getUserPost = async (req,res)=>{
    try{

        const posts = await Post.find({ author: authorId })
        .sort({ createdAt: -1 })
        .populate({
            path: 'author',
            select: 'username profilePicture',
        })
        .populate({
            path: 'comments',
            options: { sort: { createdAt: -1 } }, // latest comments first
            populate: {
            path: 'author',
            select: 'username profilePicture',
            },
        });

        // const authorId = req.id;
        // const posts = await Post.find({author:authorId}).sort({createdAt:-1}).populate({
        //     path:'author',
        //     select:'username,profilepicture'
        // }).populate({
        //     path:"comments",
        //     sort:{createdAt:- -1},
        //     populate:{
        //         paht:'author',
        //         select:'username,profilePicture'
        //     }
        // });
        return res.status(200).json({
            posts,
            success:true,
        });

    }catch(error){
        console.log(error);
    }
}

export const likePost = async(req,res)=>{
    try{
        const likeGarneWalaKoId = req.id
        const postId = req.params.id
        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message:"post not found",success:false});

        // like ligic
        await post.updateOne({$addToSet:{likes:likeGarneWalaKoId}});
        await post.save();

        //  shocketIO -- realtime notifacition

        return res.status(200).json({message:'post liked',success:true});


    }catch(err){
        console.log(err);
    }
}


export const disLikePost = async(req,res)=>{
    try{
        const likeGarneWalaKoId = req.id
        const postId = req.params.id
        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message:"post not found",success:false});

        // like ligic
        await post.updateOne({$pull:{likes:likeGarneWalaKoId}});
        await post.save();

        // implement shocketIO for realtime notifacition


        return res.status(200).json({message:'post disliked',success:true});

    }catch(err){
        console.log(err);
    }
}

export const addComment = async(req,res)=>{
    try{
        const postId = req.params.id;
        const commentGarneWalaKoId = req.id;
        const {text} = req.body;
        const post = await Post.findById(postId);
        if(!text) return res.status(400).json({message:"text is required",success:true});

        const comment = await Comment.create({
            text,
            author:commentGarneWalaKoId,
            post:postId
        })
        await comment.populate({
            path:'author',
            select:'username  profilePicture'
        });

        post.comments.push(comment._id);
        await post.save();

        return res.status(201).json({
            message:"comment added",
            comment,
            success:"true"
        });

    }catch(error){
        console.log(error)
    }
}


export const getCommentsOfPost = async (req,res)=>{
    try{
        const postId = req.params.id;

        const comments = await Comment.find({post:postId}).populate('author','username profilePicture');
        if(!comments) return res.status(404).json({message:'no comments found for this post,success:falst'});

        return res.status(200).json({success:true,comments})
    }catch(err){
        console.log(err);
    }
}



export const deletePost = async (req,res)=>{
    try{
        const postId = req.params.id;
        const adminId = "64891aefd53c9e0aaf2b91a7"
        const authorId = req.id;
        console.log(authorId == adminId);
        
        
        const post = await Post.findById(postId);
        console.log(post.author == req.id)

        if(!post) return res.status(404).json({message:'cant delete post',success:false});



//-----------jhjhghjgjhgjhgjgjg



        if(!(post.author == req.id || req.id == adminId) ) return res.status(404).json({message:"unauthorized user",success:false});

        // delete post

        await Post.findByIdAndDelete(postId);

        let user = await User.findById(post.author);

        user.post = user.post.filter(id => id.toString()!= postId);
        await user.save();

        await Comment.deleteMany({post:postId});

        return res.status(200).json({
            message:'post deleted successfully',
            success:true
        });


    }catch(err){
        console.log(err);
    }
}



                ///api hsnt tested-----



