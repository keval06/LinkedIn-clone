import React, { use, useContext, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { userDataContext } from "../context/userContext";
import dp from "../assets/dp.webp";
import { FiCamera, FiPlus } from "react-icons/fi";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";

function EditProfile() {
  let { edit, setEdit, userData, setUserData } = useContext(userDataContext);
  let { serverUrl } = useContext(authDataContext);
  let [firstName, setFirstName] = useState(userData.firstName || "");
  let [lastName, setLastName] = useState(userData.lastName || "");
  let [userName, setUserName] = useState(userData.userName || "");
  let [headline, setHeadline] = useState(userData.headline || "");
  let [location, setLocation] = useState(userData.location || "");
  let [gender, setGender] = useState(userData.gender || "");
  let [skills, setSkills] = useState(userData.skills || []);
  let [newSkills, setNewSkills] = useState("");
  let [education, setEducation] = useState(userData.education || []);
  let [newEducation, setNewEducation] = useState({
    college: "",
    degree: "",
    fieldOfStudy: "",
  });
  let [experience, setExperience] = useState(userData.experience || []);
  let [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    description: "",
  });

  //2 useState() for frontend and backend
  let [frontendProfileImage, setFrontendProfileImage] = useState(
    userData.profileImage || dp
  );
  let [backendProfileImage, setBackendProfileImage] = useState(null);

  let [frontendCoverImage, setFrontendCoverImage] = useState(
    userData.coverImage || null
  );
  let [backendCoverImage, setBackendCoverImage] = useState(null);

  //Saving profile
  let [saving, setSaving] = useState(false);

  //useRef for , return object
  const profileImage = useRef();
  const coverImage = useRef();

  function handleProfileImage(e) {
    //select file from frontend, then send to backend
    let file = e.target.files[0];

    setBackendProfileImage(file);

    setFrontendProfileImage(URL.createObjectURL(file));
  }
  function handleCoverImage(e) {
    //select file from frontend, then send to backend
    let file = e.target.files[0];

    setBackendCoverImage(file);

    setFrontendCoverImage(URL.createObjectURL(file));
  }

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      //send image as form data
      let formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("userName", userName);
      formData.append("headline", headline);
      formData.append("location", location);
      //js object to JSON -> Json.stringify()
      formData.append("skills", JSON.stringify(skills));
      formData.append("education", JSON.stringify(education));
      formData.append("experience", JSON.stringify(experience));

      if (backendProfileImage) {
        formData.append("profileImage", backendProfileImage);
      }
      if (backendCoverImage) {
        formData.append("coverImage", backendCoverImage);
      }
      //send all form data
      let result = await axios.put(
        serverUrl + "/api/user/updateprofile",
        formData,
        { withCredentials: true }
      );
      setUserData(result.data);
      setSaving(false);
      setEdit(false);
      // console.log(result);
    } catch (error) {
      console.log(error);
      setSaving(false);
    }
  };

  // Add skill
  function addSkill(e) {
    e.preventDefault();
    if (newSkills && !skills.includes(newSkills)) {
      setSkills([...skills, newSkills]);
    }
    setNewSkills("");
  }
  //remove Skill
  function removeSkill(skill) {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    }
  }
  //Add education
  function addEducation(e) {
    e.preventDefault();
    if (
      newEducation.college &&
      newEducation.degree &&
      newEducation.fieldOfStudy &&
      !education.includes(newEducation)
    ) {
      setEducation([...education, newEducation]);
    }
    setNewEducation({
      college: "",
      degree: "",
      fieldOfStudy: "",
    });
  }
  //remove education
  function removeEducation(edu) {
    if (education.includes(edu)) {
      setEducation(education.filter((e) => e !== edu));
    }
  }
  //add experience
  function addExperience(e) {
    e.preventDefault();
    if (
      newExperience.title &&
      newExperience.company &&
      newExperience.description &&
      !experience.includes(newExperience)
    ) {
      setExperience([...experience, newExperience]);
    }
    setNewExperience({
      title: "",
      company: "",
      description: "",
    });
  }
  //remove experience
  function removeExperience(exp) {
    if (experience.includes(exp)) {
      setExperience(experience.filter((e) => e !== exp));
    }
  }

  return (
    <div className="w-full h-[100vh] fixed top-0 z-[100] flex justify-center items-center ">
      {/* Image handling hidden input */}
      <input
        type="file"
        accept="image/*"
        hidden
        ref={profileImage}
        onChange={handleProfileImage}
      />
      <input
        type="file"
        accept="image/*"
        hidden
        ref={coverImage}
        onChange={handleCoverImage}
      />

      <div className="w-full h-full bg-black opacity-[0.5] absolute top-0 left-0  "></div>

      {/* main div/ */}
      <div className="w-[90%] max-w-[500px] h-[600px] bg-white relative z-[200] shadow-lg rounded-lg p-[10px]  overflow-auto">
        {/* cross svg */}
        <div
          className="absolute top-[20px] right-[20px] cursor-pointer "
          onClick={() => setEdit(false)}
        >
          <RxCross2 className="w-[35px] h-[30px] text-gray-700 font-bold " />
        </div>
        {/* Cover img */}
        <div
          className="w-full h-[150px] bg-gray-500 rounded-lg mt-[40px] overflow-hidden cursor-pointer"
          onClick={() => coverImage.current.click()}
        >
          <img src={frontendCoverImage} alt="" className="w-full" />
          <FiCamera className="w-[25px] h-[25px] text-white absolute right-[20px] top-[60px]" />
        </div>
        {/* profile img */}
        <div
          className="w-[80px] h-[80px] rounded-full overflow-hidden absolute top-[150px] ml-[20px] cursor-pointer "
          onClick={() => profileImage.current.click()}
        >
          <img src={frontendProfileImage} alt="" />
        </div>
        {/* + icon */}
        <div
          className="w-[20px] h-[20px] bg-[#17c1ff] absolute top-[200px] left-[90px] rounded-full flex justify-center items-center cursor-pointer "
          onClick={() => profileImage.current.click()}
        >
          <FiPlus className="text-white" />
        </div>
        <div className="w-full flex flex-col items-center justify-center gap-[20px] mt-[50px]">
          <input
            type="text"
            placeholder="firstName"
            className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="lastName"
            className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="text"
            placeholder="userName"
            className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="text"
            placeholder="headline"
            className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
          />
          <input
            type="text"
            placeholder="location"
            className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <input
            type="text"
            placeholder="gender(Male/Female?Other)"
            className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          />

          {/* skills */}
          <div className="w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px] rounded-lg">
            <h1 className="text-[19px] font-semibold ">Skills</h1>
            {skills && (
              <div className="flex flex-col gap-[10px]">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="w-full h-[40px]  border-[1px] border-gray-600 bg-gray-200 p-[10px] flex justify-between items-center"
                  >
                    <span>{skill}</span>
                    <RxCross2
                      className="w-[20px] h-[20px] text-gray-700 font-bold cursor-pointer"
                      onClick={() => removeSkill(skill)}
                    />
                  </div>
                ))}
              </div>
            )}
            {/* Add new skill */}
            <div className="flex flex-col gap-[10px] items-start ">
              <input
                type="text"
                placeholder="Add new skill"
                className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg"
                value={newSkills}
                onChange={(e) => setNewSkills(e.target.value)}
              />
              <button
                className="w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]"
                onClick={addSkill}
              >
                Add
              </button>
            </div>
          </div>
          {/* New Education*  */}

          <div className="w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px] rounded-lg">
            <h1 className="text-[19px] font-semibold ">Education</h1>
            {education && (
              <div className="flex flex-col gap-[10px]">
                {education.map((education, index) => (
                  <div
                    key={index}
                    className="w-full  border-[1px] border-gray-600 bg-gray-200 p-[10px] flex justify-between items-center"
                  >
                    {/* New div fro education */}
                    <div>
                      <div>College : {education.college} </div>
                      <div>Degree : {education.degree} </div>
                      <div>Field Of Study : {education.fieldOfStudy} </div>
                    </div>
                    <RxCross2
                      className="w-[20px] h-[20px] text-gray-700 font-bold cursor-pointer"
                      onClick={() => removeEducation(education)}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Add new edu */}
            <div className="flex flex-col gap-[10px] items-start ">
              <input
                type="text"
                placeholder="College"
                className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg"
                value={newEducation.college}
                onChange={(e) =>
                  setNewEducation({ ...newEducation, college: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Degree"
                className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg"
                value={newEducation.degree}
                onChange={(e) =>
                  setNewEducation({ ...newEducation, degree: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Field Of Study"
                className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg"
                value={newEducation.fieldOfStudy}
                onChange={(e) =>
                  setNewEducation({
                    ...newEducation,
                    fieldOfStudy: e.target.value,
                  })
                }
              />
              <button
                className="w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]"
                onClick={addEducation}
              >
                Add
              </button>
            </div>
          </div>

          {/* Experience  */}
          <div className="w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px] rounded-lg">
            <h1 className="text-[19px] font-semibold ">Experience</h1>
            {experience && (
              <div className="flex flex-col gap-[10px]">
                {experience.map((exp, index) => (
                  <div
                    key={index}
                    className="w-full  border-[1px] border-gray-600 bg-gray-200 p-[10px] flex justify-between items-center"
                  >
                    {/* New div fro education */}
                    <div>
                      <div> Title : {exp.title} </div>
                      <div> Company : {exp.company} </div>
                      <div> Description : {exp.description} </div>
                    </div>
                    <RxCross2
                      className="w-[20px] h-[20px] text-gray-700 font-bold cursor-pointer"
                      onClick={() => removeExperience(exp)}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Add new edu */}
            <div className="flex flex-col gap-[10px] items-start ">
              <input
                type="text"
                placeholder="Title"
                className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg"
                value={newExperience.title}
                onChange={(e) =>
                  setNewExperience({ ...newExperience, title: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Company"
                className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg"
                value={newExperience.company}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    company: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Description"
                className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg"
                value={newExperience.description}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    description: e.target.value,
                  })
                }
              />
              <button
                className="w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] hover:text-white hover:bg-[#2dc0ff] transition-all font-semibold "
                onClick={addExperience}
              >
                Add
              </button>
            </div>
          </div>

          <button
            className="w-[100%] h-[50px] rounded-full bg-[#24b2ff] mt-[20px] text-white hover:bg-[#4ec1ff] transition-all text-[18px] "
            disabled={saving}
            onClick={() => handleSaveProfile()}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
