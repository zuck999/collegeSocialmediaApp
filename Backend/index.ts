import express, { urlencoded } from "express";
const app = express();
import cors from "cors"
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from './utils/db';
import userRoute from './routes/user.route';
import postRoute from './routes/post.rout';
import messageRoute from './routes/message.route';
dotenv.config({});

const port = process.env.PORT || 8000;

app.get("/",(req,res)=>{
    return res.status(200).json({
        message:"backend message",
        success:true
    })
});

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));

const crosOption = {
    origin:`http://localhost:3000`,
    credentials:true,
}
app.use(cors(crosOption));

// api
app.use("/api/v1/user",userRoute);
app.use("/api/v1/post",postRoute);
app.use("/api/v1/message",messageRoute);



app.listen(port,()=>{
    connectDB();
    console.log(`server listen at port ${port}`)
});


