import express from "express";
import  {sendConnection, acceptConnection, rejectConnection, getConnectionStatus, removeConnection, getConnectionRequests, getUserConnections } from "../controllers/connection.controller.js";
import isAuth from "../middlewares/isAuth.js"


let connectionRouter = express.Router();

connectionRouter.post("/send/:id",isAuth,sendConnection)
connectionRouter.put("/accept/:connectionId",isAuth,acceptConnection) //connection ni id
connectionRouter.put("/reject/:connectionId",isAuth,rejectConnection) //connection ni id
connectionRouter.get("/getstatus/:userId",isAuth,getConnectionStatus) //jena rsespect ma status ni id
connectionRouter.delete("/remove/:userId",isAuth,removeConnection) //jena rsespect ma status ni id
connectionRouter.get("/requests",isAuth,getConnectionRequests) //jena rsespect ma status ni id
connectionRouter.get("/",isAuth,getUserConnections) //jena rsespect ma status ni id

export default connectionRouter;