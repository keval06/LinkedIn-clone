import React, { useContext, useEffect, useState } from "react";
import Nav from "../components/Nav";
import dp from "../assets/dp.webp";
import { FiPlus } from "react-icons/fi";
import { FiCamera } from "react-icons/fi";
import { userDataContext } from "../context/UserContext.jsx";
import { RiPencilFill } from "react-icons/ri";
import EditProfile from "../components/EditProfile";
import { RxCross2 } from "react-icons/rx";
import { BsImage } from "react-icons/bs";
import { useRef } from "react";
import axios from "axios";
import { authDataContext } from "../context/AuthContext.jsx";
import Post from "../components/Post";

function Home() {
  let {
    userData,
    setUserData,
    edit,
    setEdit,
    postData,
    profilkeData,
    setProfileData,
    handleGetProfile,
    setPostData,
    getPost,
  } = useContext(userDataContext);

  let { serverUrl } = useContext(authDataContext);

  let [frontendImage, setFrontendImage] = useState("");
  let [backendImage, setBackendImage] = useState("");
  let [description, setDescription] = useState("");
  let [uploadPost, setUploadPost] = useState(false);
  let [posting, setPosting] = useState(false);
  let [suggestedUser, setSuggestedUser] = useState([]);

  let image = useRef();

  function handleImage(e) {
    //aakhi file ne backend ma moklvi
    let file = e.target.files[0];
    setBackendImage(file);

    //file to url, set in src
    setFrontendImage(URL.createObjectURL(file));
  }

  //click post button, run
  async function handleUploadPost() {
    try {
      setPosting(true);
      //send data to backend as
      let formData = new FormData();
      formData.append("description", description);

      if (backendImage) {
        formData.append("image", backendImage);
      }

      //fetch
      let result = await axios.post(serverUrl + "/api/post/create", formData, {
        withCredentials: true,
      });
      console.log(result);
      setPosting(false);
      setUploadPost(false);
    } catch (error) {
      setPosting(false);
      console.log(error);
    }
  }

  const handleSuggestedUser = async () => {
    try {
      let result = await axios.get(`${serverUrl}/api/user/suggestedusers`, {
        withCredentials: true,
      });
      console.log(result.data);
      setSuggestedUser(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleSuggestedUser();
  }, [uploadPost]);

  useEffect(() => {
    getPost();
  }, [uploadPost]);

  return (
    <div className="w-full min-h-[100vh] bg-[#f0efe7] pt-[100px] flex lg:items-start items-center lg:justify-center gap-[20px] px-[20px] flex-col lg:flex-row relative pb-[50px] ">
      {edit && <EditProfile />}
      <Nav />

      {/* Left div */}
      <div className="lg:w-[25%] w-full min-h-[200px] bg-[white] shadow-lg rounded-lg p-[10px] relative">
        {/* Cover img */}
        <div
          className="w-[100%] h-[100px] bg-gray-400 rounded shadow-lg overflow-hidden flex items-center justify-center cursor-pointer "
          onClick={() => setEdit(true)}
        >
          <img src={userData.coverImage || ""} alt="" className="w-full" />
          <FiCamera className="w-[25px] h-[25px] text-white absolute right-[20px] top-[20px ]" />
        </div>

        {/* DP vali */}
        <div
          className="w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center absolute top-[65px] left-[35px] cursor-pointer "
          onClick={() => setEdit(true)}
        >
          <img src={userData.profileImage || dp} alt="" className=" h-full " />
        </div>
        <div className="w-[20px] h-[20px] bg-[#17c1ff] absolute top-[105px] left-[90px] rounded-full flex justify-center items-center cursor-pointer ">
          <FiPlus className="text-white" onClick={() => setEdit(true)} />
        </div>

        <div className="mt-[30px] pl-[20px] font-semibold text-gray-700 ">
          {/* name */}
          <div className=" text-[22px]">{`${userData.firstName} ${userData.lastName}`}</div>
          <div className=" text-[18px] text-gray-600 font-semibold ">
            {userData.headline || ""}
          </div>

          {/* Location */}
          <div className=" text-[16px] text-gray-500 ">
            {userData.location}{" "}
          </div>
        </div>
        <button
          className="w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] my-[20px] cursor-pointer flex items-center justify-center gap-[10px] "
          onClick={() => setEdit(true)}
        >
          Edit Profile
          <RiPencilFill className="w-[20px] h-[25px]" />
        </button>
      </div>

      {/* Post Popup */}
      {uploadPost && (
        <div className="w-full h-full bg-black opacity-[0.5] fixed top-0 left-0">
          {/* upload div */}
        </div>
      )}

      {uploadPost && (
        <div className="w-[90%] max-w-[500px] h-[600px] bg-white fixed z-[200] shadow-lg top-[100px] rounded-lg p-[20px] flex justify-start items-start flex-col gap-[20px] mt-[30px] ml-auto mr-auto">
          {/* cross */}
          <div className="absolute top-[20px] right-[20px] cursor-pointer ">
            <RxCross2
              className="w-[35px] h-[30px] text-gray-700 font-bold "
              onClick={() => setUploadPost(false)}
            />
          </div>

          <div className="flex justify-start items-center ">
            {/* Profile img */}
            <div className="w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center cursor-pointer ">
              <img
                src={userData.profileImage || dp}
                alt=""
                className=" h-full  "
              />
            </div>

            {/* naame */}
            <div className=" text-[22px] ml-[10px]">{`${userData.firstName} ${userData.lastName}`}</div>
          </div>

          {/* text area */}
          <textarea
            className={`w-full ${
              frontendImage ? "h-[200px]" : "h-[550px]"
            } outline-none border-none p-[10px] resize-none text-[19px] overflow-auto `}
            placeholder="What do you want to talk About..!"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          <input type="file" ref={image} hidden onChange={handleImage} />

          {/* show image  */}
          <div className="w-full h-[300px] overflow-hidden flex justify-center items-center rounded-lg ">
            <img
              src={frontendImage || ""}
              alt=""
              className="h-full rounded-lg"
            />
          </div>

          <div className="w-full h-[200px] flex flex-col ">
            {/* img  */}
            <div className="p-[20px] flex items-center justify-start border-b-2 border-gray-500 ">
              <BsImage
                className="w-[24px] h-[24px] text-gray-600 cursor-pointer"
                onClick={() => image.current.click()}
              />
            </div>
            {/* hidden input */}

            {/* button */}
            <div className="flex justify-end items-center">
              <button
                className="w-[100px] h-[50px] rounded-full bg-[#24b2ff] mt-[20px] text-white hover:bg-[#4ec1ff] transition-all text-[20px]  "
                disabled={posting}
                onClick={handleUploadPost}
              >
                {posting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* middle div */}
      {/* 
       post Upload click start */}

      <div className="lg:w-[50%] w-full min-h-[200px] bg-[#f0efe7] flex flex-col gap-[20px]  ">
        <div className="w-full h-[120px] bg-white shadow-lg rounded-lg flex justify-center items-center gap-[10px] p-[20px]">
          {/* Profile img */}
          <div className="w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center cursor-pointer ">
            <img
              src={userData.profileImage || dp}
              alt=""
              className=" h-full "
            />
          </div>

          {/* //start a post */}
          <button
            className="w-[80%] h-[60px] border-2 border-gray-500 rounded-full flex items-center justify-start px-[15px] cursor-pointer hover:bg-gray-200"
            onClick={() => setUploadPost(true)}
          >
            Start a post
          </button>
        </div>
        {/* Post componenet */}

        {/* {postData.map((post,index)=>(
          <Post/>
        ))} */}
        {postData.map((post, index) => (
          //
          <Post
            key={index}
            id={post._id}
            description={post.description}
            author={post.author}
            image={post.image}
            like={post.like}
            comment={post.comment}
            createdAt={post.createdAt}
          />
        ))}
      </div>

      <div className=" w-full lg:w-[25%] min-h-[200px] bg-[white] shadow-lg hidden lg:flex flex-col p-[20px] ">
        <h1 className="text-[20px] text-gray-600 font-semibold  ">
          Suggested User
        </h1>
        {suggestedUser.length > 0 && (
          <div className="flex flex-col gap-[10px]">
            {suggestedUser.map((sugg) => (
              <div className="flex items-center gap-[10px] shadow-sm mt-[10px] rounded-lg p-[5px] hover:bg-gray-200 cursor-pointer "
              onClick={()=>handleGetProfile(sugg.userName)} >
                <div className="w-[40px] h-[40px] rounded-full overflow-hidden ">
                  <img
                    src={sugg.profileImage || dp}
                    alt=""
                    className="w-fit h-fit"
                  />
                </div>
                <div>
                  <div className="text-[19px] font-semibold text-gray-700 ">
                    {`${sugg.firstName} ${sugg.lastName} `}
                  </div>

                  <div className="text-[12px] font-semibold text-gray-700 ">
                    {`${sugg.headline} `}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {suggestedUser.length == 0 &&
         <div>No suggested User</div>}
      </div>
    </div>
  );
}

export default Home;
