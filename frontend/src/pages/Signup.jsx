import React, { use, useContext, useState } from "react";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";
import { userDataContext } from "../context/userContext";

function SignUp() {
  let [show, setShow] = useState(false);
  let navigate = useNavigate();
  let [firstName, setFirstName] = useState("");
  let [lastName, setLastName] = useState("");
  let [userName, setUserName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [loading, setLoading] = useState(false);
  let [err, setErr] = useState("");

  let { serverUrl } = useContext(authDataContext);
  let { userData, setUserData } = useContext(userDataContext);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let result = await axios.post(
        serverUrl + "/api/auth/signup",
        {
          firstName,
          lastName,
          userName,
          email,
          password,
        },
        { withCredentials: true }
      );
      console.log(result);
      setUserData(result.data);
      navigate("/");
      setLoading(false);
      setErr("");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setUserName("");
    } catch (error) {
      console.error("Signup Error from JSX", error);
      // const serverMsg = error.response?.data?.message||  error.response?.data?.error || error.message || "Something Went Wrong..!"
      setErr(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[90%] bg-white flex flex-col items-center justify-start gap-[10px]">
      <div className="p-[30px] lg:p-[35px] w-full items-center">
        <img src={logo} alt="" className="w-[102px] h-[26px]" />
      </div>

      {/* Signup form */}
      <form
        className="w-[90%] max-w-[400px] h-[650px] rounded-lg md:shadow-xl flex flex-col justify-center gap-[10px] p-[15px] "
        onSubmit={handleSignUp}
      >
        <h1 className="text-gray-800 text-[30px] font-semibold mb-[30px] ">
          Sign Up
        </h1>
        <input
          type="text"
          placeholder="Firstname"
          required
          className="w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md outline-blue-800 "
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Lastname"
          required
          className="w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md outline-blue-800 "
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username"
          required
          className="w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md outline-blue-800 "
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          required
          className="w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md outline-blue-800 "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] rounded-md relative">
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            required
            className="w-full h-full border-none text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md outline-blue-800 "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="absolute right-[20px] top-[8px] font-semibold cursor-pointer text-[#24b2ff] "
            onClick={() => setShow((prev) => !prev)}
          >
            {show ? "hide" : "show"}
          </span>
        </div>

        {/* Error message */}
        {err && (
          <p className="w-full text-center text-red-600 text-sm font-medium mb-4">
            *{err}
          </p>
        )}

        <button
          className="w-[100%] h-[50px] rounded-full bg-[#24b2ff] mt-[20px] text-white hover:bg-[#4ec1ff] transition-all"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>

        <p
          className="text-center cursor-pointer "
          onClick={() => navigate("/login")}
        >
          Already have an account ?{" "}
          <span className="text-[#1a93d4] ">Sign In</span>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
