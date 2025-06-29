import React, { useContext, useEffect } from "react";
import Nav from "../components/Nav";
import dp from "../assets/dp.webp";
import { useState } from "react";
import { FiCamera, FiPlus } from "react-icons/fi";
import { RiPencilFill } from "react-icons/ri";
import { userDataContext } from "../context/userContext";
import EditProfile from "../components/EditProfile";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";
import Post from "../components/Post";
import ConnectionButton from "../components/ConnectionButton";

function Profile() {
  let {
    userData,
    setUserData,
    edit,
    setEdit,
    postData,
    setPostData,
    profileData,
    setProfileData,
  } = useContext(userDataContext);
  let { serverUrl } = useContext(authDataContext);

  // let [userConnection, setUserConnection] = useState([]);
  //   let [postData, setPostData] = useState([]);
  let [profilePost, setProfilePost] = useState([]);

  // const handleGetUserConnection = async () => {
  //   try {
  //     let result = await axios.get(`${serverUrl}/api/connection`, {
  //       withCredentials: true,
  //     });
  //     console.log(result);

  //     setUserConnection(result.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // useEffect(() => {
  //   // Fetch user connection data when the component mounts
  //   // This will ensure that the userConnection state is populated with the user's connections
  //   handleGetUserConnection();
  // }, []);

  useEffect(() => {
    // Filter the postData to get only the posts made by the current user
    // Assuming postData is an array of posts and each post has an author field that contains the author's user ID
    setProfilePost(
      postData.filter((post) => post.author._id == profileData._id)
    );
  }, [profileData]);

  return (
    <div className="w-full min-h-[100vh] bg-[#f0efe7] flex flex-col items-center pt-[100px] pb-[40px] ">
      <Nav />
      {edit && <EditProfile />}

      <div className="w-full max-w-[900px]  min-h-[100vh] flex flex-col gap-[10px]  ">
        {/* Images and data */}
        <div className="relative bg-white pb-[40px] rounded shadow-lg ">
          <div
            className="w-[100%] h-[100px] bg-gray-400 rounded shadow-lg overflow-hidden flex items-center justify-center cursor-pointer "
            onClick={() => setEdit(true)}
          >
            <img src={profileData.coverImage || ""} alt="" className="w-full" />
            <FiCamera className="w-[25px] h-[25px] text-white absolute right-[20px] top-[20px ]" />
          </div>

          {/* DP vali */}
          <div
            className="w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center absolute top-[65px] left-[35px] cursor-pointer "
            onClick={() => setEdit(true)}
          >
            <img
              src={profileData.profileImage || dp}
              alt=""
              className=" h-full "
            />
          </div>
          <div className="w-[20px] h-[20px] bg-[#17c1ff] absolute top-[105px] left-[90px] rounded-full flex justify-center items-center cursor-pointer ">
            <FiPlus className="text-white" onClick={() => setEdit(true)} />
          </div>

          <div className="mt-[30px] pl-[20px] font-semibold text-gray-700 ">
            {/* name */}
            <div className=" text-[22px]">{`${profileData.firstName} ${profileData.lastName}`}</div>
            <div className=" text-[18px] text-gray-600 font-semibold ">
              {profileData.headline || ""}
            </div>

            {/* Location */}
            <div className=" text-[16px] text-gray-500 ">
              {profileData.location}
            </div>
            <div className="text-[16px] text-gray-500 ">
              {`${profileData.connection.length} Connections`}
            </div>
          </div>
          {profileData._id == userData._id && (
            <button
              className="min-w-[150px] h-[40px] ml-[20px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] my-[20px] cursor-pointer flex items-center justify-center gap-[10px] "
              onClick={() => setEdit(true)}
            >
              Edit Profile
              <RiPencilFill className="w-[20px] h-[25px]" />
            </button>
          )}

          {profileData._id !== userData._id && (
            <div >
              <ConnectionButton userId={profileData._id} />
            </div>
          )}
        </div>

        <div className="w-full min-h-[100px] flex items-center p-[20px] text-[22px] text-gray-600 font-semibold bg-white shadow-lg  ">
          {" "}
          {`Post (${profilePost.length}) `}
        </div>
        {/* map post */}
        {profilePost.map((post, index) => (
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

        {/* skills */}
        {profileData.skills.length > 0 && (
          <div className="w-full min-h-[100px] flex flex-col justify-center gap-4[10px] p-[20px] font-semibold bg-white shadow-lg rounded-lg  ">
            <div className="text-[22px] text-gray-600 "> Skills</div>
            <div className="flex flex-wrap justify-start items-center gap-[20px] text-gray-600 p-[20px] ">
              {profileData.skills.map((skill) => (
                <div className="text-[20px]">{skill}</div>
              ))}
              {profileData._id == userData._id && <button
                className="min-w-[150px] h-[40px] ml-[20px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]  cursor-pointer flex items-center justify-center gap-[10px] hover:bg-[#4ec1ff] transition-all hover:text-white "
                onClick={() => setEdit(true)}
              >
                Add Skills
              </button>}
              
            </div>
          </div>
        )}

        {/* Education */}
        {profileData.education.length > 0 && (
          <div className="w-full min-h-[100px] flex flex-col justify-center gap-4[10px] p-[20px] font-semibold bg-white shadow-lg rounded-lg  ">
            <div className="text-[22px] text-gray-600 "> Education </div>
            <div className="flex flex-col justify-start items-start gap-[20px] text-gray-600 p-[20px] ">
              {profileData.education.map((edu) => (
                <div>
                  <div className="text-[20px]">College : {edu.college}</div>
                  <div className="text-[20px]">Degree : {edu.degree}</div>
                  <div className="text-[20px]">
                    Field Of Study : {edu.fieldOfStudy}
                  </div>
                </div>
              ))}
              {profileData._id == userData._id && <button
                className="min-w-[150px] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]  cursor-pointer flex items-center justify-center gap-[10px] hover:bg-[#4ec1ff] transition-all hover:text-white "
                onClick={() => setEdit(true)}
              >
                Add Education
              </button>}
              
            </div>
          </div>
        )}

        {/* Experience */}
        {profileData.experience.length > 0 && (
          <div className="w-full min-h-[100px] flex flex-col justify-center gap-4[10px] p-[20px] font-semibold bg-white shadow-lg rounded-lg  ">
            <div className="text-[22px] text-gray-600 "> Experience </div>
            <div className="flex flex-col justify-start items-start gap-[20px] text-gray-600 p-[20px] ">
              {profileData.experience.map((exp) => (
                <div>
                  <div className="text-[20px]">Title : {exp.title}</div>
                  <div className="text-[20px]">Companay : {exp.company}</div>
                  <div className="text-[20px]">
                    Description : {exp.description}
                  </div>
                </div>
              ))}
              {profileData._id == userData._id && <button
                className="min-w-[150px] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]  cursor-pointer flex items-center justify-center gap-[10px] hover:bg-[#4ec1ff] transition-all hover:text-white "
                onClick={() => setEdit(true)}
              >
                Add Experience
              </button>}
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
