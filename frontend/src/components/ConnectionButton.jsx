import React from "react";
import { useContext } from "react";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";
import { useEffect } from "react";
import io from "socket.io-client";
import { userDataContext } from "../context/userContext";
import { useState } from "react";
import {  useNavigate } from "react-router-dom";

const socket = io("http://localhost:8000");

function ConnectionButton({ userId }) {
  let { serverUrl } = useContext(authDataContext);
  let { userData, setUserData } = useContext(userDataContext);
  let [status, setStatus] = useState("");
  let navigate = useNavigate();

  const handleSendConnection = async () => {
    try {
      let result = await axios.post(`${serverUrl}/api/connection/send/${userId}`,
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
      let result = await axios.delete(`${serverUrl}/api/connection/remove/${userId}`,
        {
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
      let result = await axios.get(`${serverUrl}/api/connection/getstatus/${userId}`
        // serverUrl + "/api/connection/send/" + userId
        ,
        {
          withCredentials: true,
        }
      );
      console.log(result);
      setStatus(result.data.status);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {

    socket.emit("register", userData._id);
    handleGetStatus();

    socket.on("statusUpdate", ({ updatedUserId, newStatus }) => {
      if (updatedUserId == userId) {
        setStatus(newStatus);
      }
    });

    return () => {
      socket.off("statusUpdate");
    };
  }, [userId]);   

  const handleClick = async()=>{
    if(status == "disconnect"){
      await handleRemoveConnection();
    }else if(status == "received"){
      navigate("/network");
    }
    //now connect
    else{
      await handleSendConnection();

    }
  }



  return (
    <button className={`min-w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] text-[16px] font-semibold   px-[25px] py-[20px] items-center justify-center flex cursor-not-allowed ${status=="connect" ?"hover:bg-[#4ec1ff] hover:text-white transition-all cursor-pointer":""}`}
    onClick={handleClick}
    disabled={status=="pending"}>
      {status}
    </button>
  );
}

export default ConnectionButton;
