import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export function loginUser(req,res){
    const email=req.body.email;
    const password=req.body.password;

    User.findOne({email:email}).then((user)=>{
        if(user==null){
            return res.status(404).json({
                message:"User not found"
            })
        }
        
        const isPasswordCorrect=bcrypt.compareSync(password,user.password);
        if(isPasswordCorrect){
            const token=jwt.sign({
                email:user.email,
                role:user.role
            },"university-vacancySystem@2026")
            res.json({
                message:"Login Successfull",
                token:token,
                role:user.role
            })
        }
        else{
            res.status(401).json({
                message:"Invalid Password"
            });
        }
    })
}

export function createUser(req,res){
    if(!req.user || req.user.role !="admin"){
        return res.status(403).json({
            message:"Unauthorized:Admins Only"
        })
    }
    const hashedPassword=bcrypt.hashSync(req.body.password,10);
    const user=new User({ ...req.body,password:hashedPassword})

    user.save()
        .then(()=>res.json({
            message:"User Created Successfully"
        }))
        .catch(err=>res.status(500).json({
            message:"Error",
            error:err
        }))
}

export function getUsers(req,res){
    if(!req.user || req.user.role !=="admin"){
        return res.status(403).json({
            message:"Unauthorized:Access Denied"
        })
    }
    User.find().then(users=>res.json({
        list:users
    }))
    .catch(()=>res.status(500).json({
        message:"Database Error"
    }))
}

export async function updateUser(req,res){
    if(!req.user || req.user.role !== "admin"){
        return res.status(403).json({
            message:"Unauthorized:Admins Only"
        })
    }
    await User.updateOne({email:req.params.email},req.body)
    .then(()=>res.json({
        message:"User updated successfully"
    }))
    .catch(()=>res.status(500).json({
        message:"Update failed"
    }))
}
