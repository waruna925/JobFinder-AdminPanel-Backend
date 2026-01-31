import express from 'express'
import { createUser, getUserByUserName, getUsers, loginUser, updateUser } from '../controllers/userController.js';

const userRouter=express.Router();

userRouter.post("/login",loginUser)
userRouter.post("/",createUser)
userRouter.get("/",getUsers)
userRouter.get("/:userName",getUserByUserName)
userRouter.put("/:userName",updateUser)

export default userRouter