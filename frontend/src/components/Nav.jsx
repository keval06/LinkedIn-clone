import React, { useContext, useEffect, useState } from "react";
import logo2 from "../assets/logo2.png";
import { IoSearchOutline } from "react-icons/io5";
import { TiHome } from "react-icons/ti";
import { FaUserGroup } from "react-icons/fa6";
import { IoMdNotifications } from "react-icons/io";
import dp from "../assets/dp.webp";
import { userDataContext } from "../context/UserContext.jsx";
import { authDataContext } from "../context/AuthContext.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Nav() {
  let [activeSearch, setActiveSearch] = useState(false);
  let { userData, setUserData, handleGetProfile } = useContext(userDataContext);
  let { serverUrl } = useContext(authDataContext);
  let navigate = useNavigate();
  let [showPopup, setShowPopup] = useState(false);
  let [searchInput, setSearchInput] = useState("");
  let [searchData, setSearchData] = useState([]);

  const handleSignOut = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/auth/logout", {
        withCredentials: true,
      });
      setUserData(null); //IMP for login
      navigate("/login");
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async () => {
    try {
      let result = await axios.get(
        `${serverUrl}/api/user/search?query=${searchInput}`,
        {
          withCredentials: true,
        }
      );
      setSearchData(result.data);
    } catch (error) {
      setSearchData([])
    }
  };

  useEffect(() => {
    
      handleSearch();
  }, [searchInput]);

  return (
    <div className="w-full h-[80px] bg-[white] fixed top-0 left-0 shadow-lg flex md:justify-around justify-between items-center px-[10px] z-[80] ">
      {/* Left Div, logo,search bar, input */}
      <div className="flex justify-center items-center gap-[10px]">
        <div
          onClick={() => {
            setActiveSearch(false);
            navigate("/");
          }}
        >
          <img src={logo2} alt="" className="w-[50px] cursor-pointer" />
        </div>
        {!activeSearch && (
          <div>
            <IoSearchOutline
              className="w-[23px] h-[23px] text-gray-600 cursor-pointer lg:hidden "
              onClick={() => setActiveSearch(true)}
            />
          </div>
        )}

        {/* Search input */}
        {searchData.length>0 && (
          <div className="absolute top-[90px] min-h-[100px] left-[0px] w-[100%] lg:left-[20px] md:w-[700px]  bg-white shadow-lg flex flex-col gap-[20px] p-[20px] h-[500px] overflow-auto  "
          >
            {searchData.map((sea) => (
              <div className="flex gap-[20px] items-center border-b-2 border-b-gray-300 p-[10px] cursor-pointer hover:bg-gray-200  rounded-lg"
              onClick={()=>handleGetProfile(sea.userName)}>
                <div className="w-[70px] h-[70px] rounded-full overflow-hidden ">
                  <img
                    src={sea.profileImage || dp}
                    alt=""
                    className="w-fit h-fit"
                  />
                </div>
                <div>
                  <div className="text-[19px] font-semibold text-gray-700 ">
                    {`${sea.firstName} ${sea.lastName} `}
                  </div>

                  <div className="text-[15px] font-semibold text-gray-700 ">
                    {`${sea.headline} `}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <form
          className={`w-[190px] lg:w-[350px] h-[40px] bg-[#f0efe7] lg:flex items-center gap-[10px] px-[10px] py-[5px] rounded-md ${
            !activeSearch ? "hidden" : "flex"
          }`}
        >
          <div>
            <IoSearchOutline className="w-[23px] h-[23px] text-gray-600 cursor-pointer " />
          </div>
          <input
            type="text"
            className="w-full h-full bg-transparent outline-none border-0 "
            placeholder="Seacrh User..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>
      </div>

      {/* Right dive */}
      <div className="flex justify-center items-center gap-[20px] ">
        {/* Pop up Card */}
        {showPopup && (
          <div className="w-[300px] min-h-[300px] bg-white shadow-lg absolute top-[75px] rounded-lg flex flex-col items-center p-[20px] gap-[20px] right-[20px] lg:right-[100px] ">
            {/* IMG */}
            <div className="w-[70px] h-[70px] rounded-full overflow-hidden ">
              <img
                src={userData.profileImage || dp}
                alt=""
                className="w-full h-full"
              />
            </div>

            {/* Username */}
            <div className="text-[19px] font-semibold text-gray-700 ">
              {`${userData.firstName} ${userData.lastName} `}{" "}
            </div>
            <button
              className="w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] hover:text-white hover:bg-[#2dc0ff] transition-all  "
              onClick={() => handleGetProfile(userData.userName)}
            >
              View Profile
            </button>
            <div className="w-full h-[1px] bg-gray-700"></div>

            <div
              className="w-full flex items-center justify-start cursor-pointer text-gray-600 gap-[10px]"
              onClick={() => navigate("/network")}
            >
              <FaUserGroup className="w-[23px] h-[23px] text-gray-600 " />
              <div>My Network</div>
            </div>

            <button
              className="w-[100%] h-[40px] rounded-full border-2 border-[#ec4545] text-[#ec4545] hover:text-white hover:bg-[#ec4545] transition-all "
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        )}

        <div
          className="lg:flex flex-col items-center justify-cente cursor-pointer text-gray-600 hidden"
          onClick={() => navigate("/")}
        >
          <TiHome className="w-[23px] h-[23px] text-gray-600 " />
          <div>Home</div>
        </div>
        <div
          className="lg:flex flex-col items-center justify-cente cursor-pointer text-gray-600 hidden"
          onClick={() => navigate("/network")}
        >
          <FaUserGroup className="w-[23px] h-[23px] text-gray-600 " />
          <div>My Network</div>
        </div>
        <div className="flex flex-col items-center justify-cente cursor-pointer text-gray-600  "
        onClick={()=>navigate("/notification")}>
          <IoMdNotifications className="w-[23px] h-[23px] text-gray-600 " />
          <div className="hidden md:block ">Notifications</div>
        </div>
        <div
          className="w-[50px] h-[50px] rounded-full overflow-hidden cursor-pointer transition-all"
          onClick={() => setShowPopup((prev) => !prev)}
        >
          <img
            src={userData.profileImage || dp}
            alt=""
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}

export default Nav;
