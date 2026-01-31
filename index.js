import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import jobVacancyRouter from './routes/jobVacancyRouter.js';
import userRouter from './routes/userRouter.js'
import jwt from 'jsonwebtoken'
import cors from 'cors'

const app = express();
app.use(cors())
app.use(bodyParser.json());

app.use((req,res,next)=>{
    const tokenString=req.header("Authorization")
    if(tokenString !=null){
        const token=tokenString.replace("Bearer ","")
        jwt.verify(token,"university-vacancySystem@2026",(err,decoded)=>{
            if(decoded != null){
                req.user=decoded
                next()
            }
            else{
                res.status(403).json({
                    message:"Invalid Token"
                })
            }
        })
    }
    else{
        next()
    }
})

//mongodb+srv://admin:<db_password>@cluster0.lgxco4u.mongodb.net/?appName=Cluster0
mongoose.connect("mongodb+srv://admin:1234@cluster0.lgxco4u.mongodb.net/?appName=Cluster0").then(() => {
    console.log("Connected to the database")
})
    .catch(() => {
        console.log("Database connection Failed")
    })

app.use("/api/users",userRouter)
app.use('/api/job',jobVacancyRouter);

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});