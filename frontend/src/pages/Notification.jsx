import React from "react";
import Nav from "../components/Nav";
import { useContext } from "react";
import { authDataContext } from "../context/AuthContext.jsx";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import dp from "../assets/dp.webp";
import { RxCross2 } from "react-icons/rx";

function Notification() {
  let { serverUrl } = useContext(authDataContext);
  let [notificationData, setNotificationData] = useState([]);

  const handleGetNotification = async () => {
    try {
      let result = await axios.get(`${serverUrl}/api/notification/get`, {
        withCredentials: true,
      });
      setNotificationData(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      let result = await axios.delete(
        `${serverUrl}/api/notification/deleteone/${id}`,
        {
          withCredentials: true,
        }
      );
      await handleGetNotification();
    } catch (error) {
      console.log(error);
    }
  };
  
  const handleClearAllNotification = async () => {
    try {
      let result = await axios.delete(`${serverUrl}/api/notification`, {
        withCredentials: true,
      });
      await handleGetNotification();
    } catch (error) {
      console.log(error);
    }
  };

  const handleMessage = (type) => {
    if (type == "like") {
      return "Liked your Post";
    } else if (type == "comment") {
      return "Commented on your post";
    } else {
      return "Accepted your connection";
    }
  };

  useEffect(() => {
    handleGetNotification();
  }, []);

  return (
    <div className="w-screen h-[100vh] bg-[#f0efe7] pt-[100px] px-[20px] flex flex-col items-center gap-[40px] ">
      <Nav />

      <div className="w-full h-[100px] bg-white shadow-lg rounded-lg flex items-center p-[10px] text-[22px] text-gray-600 justify-between">
        <div>Notifications {notificationData.length}</div>
        {notificationData.length > 0 && (
          <button
            className="min-w-[100px] h-[40px] rounded-full border-2 border-[#ec4545] text-[#ec4545] hover:bg-[#ec4545] hover:text-white transition-all px-[20px] flex"
            onClick={handleClearAllNotification}
          >
            Clear all
          </button>
        )}
      </div>

      {notificationData.length > 0 && (
        <div className="w-[100%] max-w-[900px] shadow-lg bg-white rounded-lg flex flex-col h-[100vh] overflow-auto p-[20px] ">
          {notificationData.map((noti, index) => (
            <div key={index} className="relative border-b border-gray-200 last:border-b-0">
              {/* Delete button positioned at top right */}
              <div
                className="absolute top-[15px] right-[15px] cursor-pointer hover:bg-gray-100 rounded-full p-1"
                onClick={() => handleDeleteNotification(noti._id)}
              >
                <RxCross2 className="w-[20px] h-[20px] text-gray-600" />
              </div>

              <div className="p-[20px] pr-[50px]">
                {/* Main notification content */}
                <div className="flex items-center gap-[15px] mb-[15px]">
                  <div className="w-[50px] h-[50px] rounded-full overflow-hidden cursor-pointer flex-shrink-0">
                    <img
                      src={noti.relatedUser.profileImage || dp}
                      alt=""
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div className="text-[16px] text-gray-700">
                    <span className="font-semibold">
                      {noti.relatedUser.firstName} {noti.relatedUser.lastName}
                    </span>{" "}
                    {handleMessage(noti.type)}
                  </div>
                </div>

                {/* Related post preview */}
                {noti.relatedPost && (
                  <div className="ml-[65px] flex items-center gap-[15px] bg-gray-50 p-[10px] rounded-lg">
                    <div className="w-[60px] h-[40px] overflow-hidden rounded flex-shrink-0">
                      <img
                        src={noti.relatedPost.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-[14px] text-gray-600 line-clamp-2">
                      {noti.relatedPost.description}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notification;