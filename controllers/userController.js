import User from "../models/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config()

export async function createUser(req,res){

  

    if(req.body.role=="admin"){
        if(req.user!=null){
            if(req.user.role != "admin"){
                res.status(403).json({
                    message:"You are not authorized to create an admin account"
                })
                return
            }
        }else{
            res.status(403).json({
                message:"you are not authorized to create an admin accouts please login first"
            })
            return
        } 
    }
    if(req.body.role=="madam"){
        if(req.user!=null){
            if(req.user.role != "madam"){
                res.status(403).json({
                    message:"You are not authorized to create an co-admin account"
                })
                return
            }
        }else{
            res.status(403).json({
                message:"you are not authorized to create an co-admin accouts please login first"
            })
            return
        } 
    }



    const hashedPassword=bcrypt.hashSync(req.body.password,10)
    const user =new User({
        email:req.body.email,
        userName:req.body.userName,
        firstName: req.body.firstName,
        lastName :req.body.lastName,
        password:hashedPassword,
        role:req.body.role,
    })

    try{    
            const findName = await User.findOne({userName:req.body.userName})
            const findEmail = await User.findOne({email:req.body.email})

            if(findName!=null){
                res.status(403).json({
                    message:"UserName already exit"
                })
                return
            }
             else if(findEmail!=null){
                res.status(403).json({
                    message:"Gmail already exit"
                })
                return
            }

            else{
  
                await user.save()
                res.json({
                message:"user created suceessfully"
       })
    }
            
      
    }catch(err){
            res.status(500).json({
            message:"failed to create user",
            error:err
        })
    
}
}

export function loginUser(req,res){
    const email=req.body.email
    const password=req.body.password
    const userName=req.body.userName

    User.findOne({
        $or:[
            {email:email},
            {userName:userName}
        ]
    }).then((user)=>{
            if(user==null){
                res.status(404).json({
                    message:"User not found"
                })
                return
            }else{
                const isPasswordCorrect=bcrypt.compareSync(password,user.password)
                if(isPasswordCorrect){
                    const token = jwt.sign({
                        email:user.email,
                        userName:user.userName,
                        firstName:user.firstName,
                        lastName:user.lastName,
                        role:user.role,
                        img:user.img
                    },
                      "university-vacancySystem@2026",
                )
                  res.json({
                    message:"login successfully",
                    token:token,
                    type:user.role
                  })
                }else{
                    res.status(401).json({
                        message:"invalid password"
                    })
                }
            }
    })
}
export async function updateUser(req, res) {
    try {
        // 1️⃣ Must be logged in
        if (!req.user) {
            return res.status(401).json({
                message: "Please login first"
            });
        }

        // 2️⃣ Only admin can update other users
        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Only admin can update users"
            });
        }

        // 3️⃣ Get TARGET user from URL
        const targetUserName = req.params.userName;

        // 4️⃣ Get update data from body
        const updateData = req.body;

        const updatedUser = await User.findOneAndUpdate(
            { userName: targetUserName },
            { $set: updateData },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser
        });

    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            error: err
        });
    }
}

export function isAdmin(req){
    if (req.user == null){
        return false
    }

    if (req.user.role != "admin"){
        return false
 
    }

    return true

}

export async function getUser(req,res){
    const userName=req.params.userName
    try{
        if(req.user==null){
            return
        }
  
        const user=await User.findOne(
            {userName:userName}
        )

        if(user==null){
            res.status(404).json({
                message:"user not found"
            })
            return
        }
        if(user.isBlocked==false && user.role != "admin" || user.role != "madam" ){
            res.json(user)
        }
        else{
            if(!isAdmin(req)){
                res.status(404).json({
                    message:"user not found"
                })
            }else{
                res.json(user)
            }
        }

}catch(err){
    res.status(500).json({
        message:"internal error",
        error:err
    })
}

}

export async function getAllUsers(req,res) {
    try{
      if(isAdmin(req)){
        const user=await User.find()
        res.json(user)
      }else{
        res.status(403).json({
            message:"not authorized"
        })
      }
    }catch(error){
        res.json({
            message:"failed to get Users",
            error:err
        })
    }
}

export async function toggleBlockUser(req, res) {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized: Admins Only" });
    }

    try {
        const user = await User.findOne({ userName: req.params.userName });
        if (!user) return res.status(404).json({ message: "User not found" });

        user.isBlocked = !user.isBlocked;
        await user.save();

        res.json({ 
            message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
            isBlocked: user.isBlocked 
        });
    } catch (error) {
        res.status(500).json({ message: "Toggle block status failed" });
    }
}