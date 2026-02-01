import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function loginUser(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({ email: email });
        if (user == null) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isPasswordCorrect = bcrypt.compareSync(password, user.password);
        if (isPasswordCorrect) {
            const token = jwt.sign({
                email: user.email,
                role: user.role
            }, "university-vacancySystem@2026");
            
            res.json({
                message: "Login Successfull",
                token: token,
                role: user.role
            });
        } else {
            res.status(401).json({
                message: "Invalid Password"
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function createUser(req, res) {
    if (!req.user || req.user.role != "admin") {
        return res.status(403).json({
            message: "Unauthorized:Admins Only"
        });
    }

    try {
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        const user = new User({ ...req.body, password: hashedPassword });
        await user.save();
        
        res.json({
            message: "User Created Successfully"
        });
    } catch (err) {
        res.status(500).json({
            message: "Error",
            error: err
        });
    }
}

export async function getUsers(req, res) {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            message: "Unauthorized:Access Denied"
        });
    }

    try {
        const users = await User.find();
        res.json({
            list: users
        });
    } catch (error) {
        res.status(500).json({
            message: "Database Error"
        });
    }
}

export async function updateUser(req, res) {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            message: "Unauthorized:Admins Only"
        });
    }

    try {
        await User.updateOne({ userName: req.params.userName }, req.body);
        res.json({
            message: "User updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Update failed"
        });
    }
}

export async function getUserByUserName(req, res) {
    if (!req.user || req.user.role != "admin") {
        return res.status(403).json({
            message: "Unuthorized:Access Denied"
        });
    }

    try {
        const userName = req.params.userName;
        const user = await User.findOne({ userName: userName });
        
        if (user) {
            res.json({
                message: "User found",
                user: user
            });
        } else {
            res.status(404).json({
                message: "User not Found"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error searching for user"
        });
    }
}
export function isAdmin(req){
    if(req.user==null){
        return false
    }
    if(req.user.role!="admin"){
        return false
    }
    return true
}

export async function deleteUser(req, res) {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized: Admins Only" });
    }

    try {
        // We use the userName as the identifier to match your other routes
        await User.deleteOne({ userName: req.params.userName });
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Delete failed" });
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