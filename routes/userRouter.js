import express from 'express'
import { createUser, deleteUser, getUserByUserName, getUsers, loginUser, toggleBlockUser, updateUser } from '../controllers/userController.js';

const userRouter=express.Router();

userRouter.post("/login",loginUser)
userRouter.post("/",createUser)
userRouter.get("/",getUsers)
userRouter.get("/:userName",getUserByUserName)
userRouter.put("/:userName",updateUser)
userRouter.delete("/:userName", deleteUser);
userRouter.put("/toggle-block/:userName",toggleBlockUser);

export default userRouter