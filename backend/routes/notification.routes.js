import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { clearAllNotification, deleteNotification, getNotifications } from "../controllers/notification.controller.js";

let notificationRouter = express.Router();

notificationRouter.get("/get",isAuth,getNotifications )
notificationRouter.delete("/deleteone/:id",isAuth,deleteNotification )
notificationRouter.delete("/",isAuth,clearAllNotification )

export default notificationRouter;