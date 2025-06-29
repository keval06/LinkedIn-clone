import { io, userSocketMap } from "../index.js";
import Connection from "../models/connection.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const sendConnection = async (req, res) => {
  try {
    let { id } = req.params; //jene connectimn moklye teni id, receiver
    let sender = req.userId; //currentuser, who is sending conn, sender
    let user = await User.findById(sender);

    //if you send connection to self

    if (sender == id) {
      return res.status(400).json({
        message: "You can not send request to yourself",
      });
    }
    //already conn, established
    if (user.connection.includes(id)) {
      return res.status(400).json({
        message: "You are already connected",
      });
    }

    //if already requested, but not acceptted
    let existingConnection = await Connection.findOne({
      sender,
      receiver:id,
      status: "pending",
    });

    if (existingConnection) {
      return res.status(400).json({
        message: "Request already exists..!",
      });
    }

    //create connection
    let newRequest = await Connection.create({
      sender,
      receiver: id,
    });
    //send request to particular user
    // sender and receiver ni socket id

    let receiverSocketId = userSocketMap.get(id);

    let senderSocketId = userSocketMap.get(sender);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("statusUpdate", {
        updatedUserId: sender,
        newStatus: "received",
      });
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("statusUpdate", {
        updatedUserId: id,
        newStatus: "pending",
      });
    }

    return res.status(200).json(newRequest);

  } catch (error) {
    return res.status(500).json({
      message: `sendConnection error ${error}`,
    });
  }
};


//accept Connection
export const acceptConnection = async (req, res) => {
  try {
    let { connectionId } = req.params;
    let connection = await Connection.findById(connectionId);
    let userId = req.userId;
    if (!connection) {
      return res.status(400).json({
        message: "Connection does not exists",
      });
    }

    if (connection.status !== "pending") {
      return res.status(400).json({
        message: "Request under Process",
      });
    }

    //accept the connection
    connection.status = "accepted";
    let notification = await Notification.create({
        //whom to send
        receiver: connection.sender, //aapde j receiver, je connection mokle e receiver
        type:"connectionAccepted", 
        relatedUser: userId,  //who commented
       })
    await connection.save();

    //./ who accepts request
     // Update both users' connection arrays
    await User.findByIdAndUpdate(req.userId, {
      $addToSet: { connection: connection.sender._id },
    });
    //who sends reques
    await User.findByIdAndUpdate(connection.sender._id, {
      $addToSet: { connection: req.userId },
    });
    
 // 🔥 Real-time status updates
    let receiverSocketId = userSocketMap.get(connection.receiver._id.toString());

    let senderSocketId = userSocketMap.get(connection.sender._id.toString());
//updateduserId = > bija user ni id,, status ma enu j status
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("statusUpdate", {
        updatedUserId: connection.sender._id,
        newStatus: "disconnect",
      });
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("statusUpdate", {
        updatedUserId: req.userId ,
        // req.userId 
        newStatus: "disconnect",
      });
    }

    return res.status(200).json({ message: "connection accepted" });
  } catch (error) {
    return res

      .status(500)
      .json({ message: `connection accepted ERROR => ${error}` });
  }
};

//Reject
export const rejectConnection = async (req, res) => {
  try {
    let { connectionId } = req.params;
    let connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(400).json({
        message: "Connection does not exists",
      });
    }

    if (connection.status !== "pending") {
      return res.status(400).json({
        message: "Request under Process",
      });
    }

    //reject the connection
    connection.status = "rejected";
    await connection.save();

    let receiverSocketId = userSocketMap.get(otherUserId);

    let senderSocketId = userSocketMap.get(myId);
//updateduserId = > bija user ni id,, status ma enu j status
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("statusUpdate", {
        updatedUserId: connection.sender._id,
        newStatus: "disconnect",
      });
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("statusUpdate", {
        updatedUserId: req.userId ,
        // req.userId 
        newStatus: "disconnect",
      });
    }

    //who sends reques
    return res.status(200).json({ message: "connection rejected" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `connection rejected ERROR => ${error}` });
  }
};

export const getConnectionStatus = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.userId;

    let currentUser = await User.findById(currentUserId);

    // already a connection
    if (currentUser.connection.includes(targetUserId)) {
      return res.json({
        status: "disconnect",
      });
    }

    const pendingRequest = await Connection.findOne({
      $or: [
        {
          sender: currentUserId,
          receiver: targetUserId,
        },
        {
          sender: targetUserId,
          receiver: currentUserId,
        },
      ],
      status: "pending",
    });

    if (pendingRequest) {
      if (pendingRequest.sender.toString() === currentUserId.toString()) {
        return res.json({ status: "pending" });
      } else {
        return res.json({
          status: "received",
          requestId: pendingRequest._id,
        });
      }
    }

    //if no nconenecton or pending req found
    return res.json({ status: "Connect" });
  } catch (error) {
    return res.status(500).json({
      message: "getConnectionStatus Error",
    });
  }
};

export const removeConnection = async (req, res) => {
  try {
    const myId = req.userId;
    const otherUserId = req.params.userId;

    await User.findByIdAndUpdate(myId, {
      $pull: {
        connection: otherUserId,
      },
    });

    await User.findByIdAndUpdate(otherUserId, {
      $pull: {
        connection: myId,
      },
    });

    let receiverSocketId = userSocketMap.get(otherUserId);

    let senderSocketId = userSocketMap.get(myId);
//updateduserId = > bija user ni id,, status ma enu j status
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("statusUpdate", {
        updatedUserId: myId,
        newStatus: "connect",
      });
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("statusUpdate", {
        updatedUserId:otherUserId ,
        // req.userId 
        newStatus: "connect",
      });
    }

    return res.json({ message: "Connection removed Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "removeConnection Error" });
  }
};

// get all request, show on network tab,
//connection collection show

export const getConnectionRequests = async (req, res) => {
  try {
    const userId = req.userId;

    const requests = await Connection.find({
      //aapde receiver, aapdi aagal request avi e
      receiver: userId,
      status: "pending",
    }).populate(
      "sender",
      "firstName lastName email userName profileImage headline"
    );

    return res.status(200).json(requests);
  } catch (error) {
    console.error("Error in getConnectionRequests controller: ", error);

    return res.status(500).json({ message: "Server Error" });
  }
};

export const getUserConnections = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).populate(
      "connection",
      "firstName lastName userName profileImage headline connections"
    );

    return res.status(200).json(user.connection);
  } catch (error) {
    console.error("Error in getUserConnections controller: ", error);

    return res.status(500).json({ message: "Server Error" });
  }
};
