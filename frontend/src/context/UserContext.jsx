import React, { createContext, useContext, useEffect, useState } from "react";
import { authDataContext } from "./AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const userDataContext = createContext();
import { io } from "socket.io-client";
export let socket = io("https://linkedin-backend-excd.onrender.com");

function UserContext({ children }) {
  let [userData, setUserData] = useState(null);
  let { serverUrl } = useContext(authDataContext);
  let [edit, setEdit] = useState(false);
  let [postData, setPostData] = useState([]);
  let [profileData, setProfileData] = useState([]);
  let navigate = useNavigate();

  const getCurrentUser = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/user/currentuser", {
        withCredentials: true,
      });
      setUserData(result.data);
      // console.log(result);
    } catch (error) {
      console.log(error);
      setUserData(null);
    }
  };

  const getPost = async () => {
    // Fetch all posts from the server
    // This function will be called to get the posts when the component mounts
    // and whenever the user data changes
    // It will update the postData state with the fetched posts
    try {
      let result = await axios.get(serverUrl + "/api/post/getpost", {
        withCredentials: true,
      });
      setPostData(result.data);
      // console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetProfile = async (userName) => {
    try {
      let result = await axios.get(
        serverUrl + `/api/user/profile/${userName}`,
        {
          withCredentials: true,
        }
      );
      setProfileData(result.data);
      navigate(`/profile/${userName}`);

      // console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCurrentUser();
    getPost();
  }, []);

  const value = {
    userData,
    setUserData,
    edit,
    setEdit,
    postData,
    setPostData,
    getPost,
    handleGetProfile,
    profileData,
    setProfileData,
  };
  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;
