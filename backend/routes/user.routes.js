import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { getCurrentUser, updateProfile } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.js"

let userRouter = express.Router();

//middleware
// GET current user - Protected route
userRouter.get("/currentuser",isAuth,getCurrentUser);

// UPDATE profile with multiple file uploads - Protected route
userRouter.put("/updateprofile",isAuth,upload.fields([
    {
        name:"profileImage",maxCount:1,
    },
    {
        name:"coverImage", maxCount:1,
    },
]),updateProfile);


export default userRouter;