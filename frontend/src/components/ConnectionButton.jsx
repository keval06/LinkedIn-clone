import React from "react";
import { useContext } from "react";
import { authDataContext } from "../context/AuthContext.jsx";
import axios from "axios";
import { useEffect } from "react";
import io from "socket.io-client";
import { userDataContext } from "../context/UserContext.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const socket = io(import.meta.env.MODE === "development" ? "http://localhost:5000" : undefined);

function ConnectionButton({ userId }) {
  let { serverUrl } = useContext(authDataContext);
  let { userData, setUserData } = useContext(userDataContext);
  let [status, setStatus] = useState("");
  let navigate = useNavigate();

  const handleSendConnection = async () => {
    try {
      let result = await axios.post(
        `${serverUrl}/api/connection/send/${userId}`,
        {},
        {
          withCredentials: true,
        }
      );
      // console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  //remove connection
  const handleRemoveConnection = async () => {
    try {
      // Sending a DELETE request to the server to remove the connection
      // The userId is passed in the URL to identify which connection to remove
      let result = await axios.delete(
        `${serverUrl}/api/connection/remove/${userId}`,
        {
          // The withCredentials option is set to true to include cookies in the request
          withCredentials: true,
        }
      );
      // console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetStatus = async () => {
    try {
      let result = await axios.get(
        `${serverUrl}/api/connection/getstatus/${userId}`,
        // serverUrl + "/api/connection/send/" + userId
        {
          withCredentials: true,
        }
      );
      console.log(result);
      // Set the status based on the response from the server
      // The status can be "connect", "disconnect", "pending", or "received"
      setStatus(result.data.status);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Fetch the initial status of the user when the component mounts
    socket.emit("register", userData._id);
    handleGetStatus();
    // Listen for status updates from the server
    // This will update the status in real-time when the server sends a status update
    socket.on("statusUpdate", ({ updatedUserId, newStatus }) => {
      if (updatedUserId == userId) {
        setStatus(newStatus);
      }
    });

    return () => {
      // Clean up the socket connection when the component unmounts
      socket.off("statusUpdate");
    };
  }, [userId]);

  const handleClick = async () => {
    // Handle the click event based on the current status
    // If the status is "disconnect", remove the connection
    if (status == "disconnect") {
      await handleRemoveConnection();
    } else if (status == "received") {
      navigate("/network");
    }
    //now connect
    else {
      await handleSendConnection();
    }
  };

  return (
    <button
      className={`min-w-[150px] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] text-[16px] font-semibold px-[25px] py-[20px] items-center justify-center flex ml-[20px] my-[20px] ${
        status == "connect"
          ? "hover:bg-[#4ec1ff] hover:text-white transition-all cursor-pointer"
          : status === "pending" ? "cursor-not-allowed" : "cursor-pointer"
      }`}
      onClick={handleClick}
      disabled={status == "pending"}
    >
      {status}
    </button>
  );
}

export default ConnectionButton;
