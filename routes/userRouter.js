import express from 'express'
import { createUser, getUser, getAllUsers, loginUser, updateUser } from '../controllers/userController.js';

const userRouter=express.Router();

userRouter.post("/login",loginUser)
userRouter.post("/",createUser)
userRouter.get("/",getAllUsers)
userRouter.get("/:userName",getUser)
userRouter.put("/:userName",updateUser)
//userRouter.delete("/:userName", deleteUser);
//userRouter.put("/toggle-block/:userName",toggleBlockUser);

export default userRouter