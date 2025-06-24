import React from "react";
import Nav from "../components/Nav";
import axios from "axios";
import { useContext } from "react";
import { authDataContext } from "../context/AuthContext";
import { useState } from "react";
import { useEffect } from "react";
import dp from "../assets/dp.webp";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { RxCrossCircled } from "react-icons/rx";

function Network() {
  let { serverUrl } = useContext(authDataContext);
  let [connections, setConnections] = useState([]);

  const handleGetRequests = async () => {
    try {
      let result = await axios.get(`${serverUrl}/api/connection/requests`, {
        withCredentials: true,
      });
      setConnections(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAcceptConncetion = async(requestId)=>{
    try {
        let result = await axios.put(`${serverUrl}/api/connection/accept/${requestId}`,{}, {
        withCredentials: true,
    });
setConnections(connections.filter((con)=>con._id==requestId))
} catch (error) {
        
    }
  }
  const handleRejectConncetion = async(requestId)=>{
    try {
        let result = await axios.put(`${serverUrl}/api/connection/reject/${requestId}`, {
        withCredentials: true,
      });
      setConnections(connections.filter((con)=>con._id==requestId))
    } catch (error) {
        
    }
  }

  useEffect(() => {
    handleGetRequests();
  }, []);

  return (
    <div className="w-screen h-[100vh] bg-[white] pt-[100px] px-[20px] flex flex-col items-center gap-[40px] ">
      {/* <h1>Network</h1> */}
      <Nav />
      <div className="w-full h-[100px] bg-white shadow-lg rounded-lg flex items-center p-[10px] text-[22px] text-gray-600 ">
        Invitations {connections.length}
      </div>

      {connections.length > 0 && (
        <div className="w-[100%] max-w-[900px] shadow-lg rounded-lg flex flex-col gap-[20px] min-h-[100px] ">
          {connections.map((connection, index) => (
            <div
              key={index}
              className="w-full min-h-[100px] flex justify-between items-center p-[20px] "
            >
              {/* Image,left div */}
              <div className="flex justify-center items-center gap-[10px]">
                <div className="w-[60px] h-[60px] rounded-full overflow-hidden cursor-pointer ">
                  <img
                    src={connection.sender.profileImage || dp}
                    alt=""
                    className="w-full h-full"
                  />
                </div>
                <div className="text-[19px] font-semibold text-gray-700 ">
                  {`${connection.sender.firstName} ${connection.sender.lastName} `}{" "}
                </div>
              </div>
              {/* button */}
              <div>
                <button className="text-[#18c5ff] font-semibold " onClick={()=>handleAcceptConncetion(connection._id)}>
                  <IoIosCheckmarkCircleOutline className="w-[40px] h-[40px]" />
                </button>
                <button className="text-[#ff4218] font-semibold">
                  <RxCrossCircled className="w-[36px] h-[36px]"onClick={()=>handleRejectConncetion(connection._id)} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Map all */}
    </div>
  );
}

export default Network;
