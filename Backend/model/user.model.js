import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    profilePicture:{
        type:String,
        default:""
    },
    gender:{
        type:String,
        enum:["male",'female','']
    },
    faculty:{
        type:String,
        default:""
    },
    friends:[
        { type:mongoose.Schema.Types.ObjectId , ref:"User"}
     ],
    post:[
       { type:mongoose.Schema.Types.ObjectId , ref:"Post"}
    ],
    phoneNum:{
        type:Number,
        default:""
    },
    batch:{
        type:String,
        default:""
    },
    hobby:{
        type:String,
        default:""
    },
    adress:{
        type:String,
        default:""
    },
},{timestamps:true});

export const User = mongoose.model("User",userSchema);
