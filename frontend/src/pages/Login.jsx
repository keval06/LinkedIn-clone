import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import { authDataContext } from "../context/AuthContext.jsx";
import axios from "axios";
import { userDataContext } from "../context/UserContext.jsx";

function Login() {
  let [show, setShow] = useState(false);
  let navigate = useNavigate();
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [loading, setLoading] = useState(false);
  let [err, setErr] = useState("");
  let { userData, setUserData } = useContext(userDataContext);

  let { serverUrl } = useContext(authDataContext);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let result = await axios.post(
        serverUrl + "/api/auth/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      setUserData(result.data);
      navigate("/");
      setErr("");
      setLoading(false);
      setEmail("");
      setPassword("");
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
        className="w-[90%] max-w-[400px] h-[600px] rounded-lg md:shadow-xl flex flex-col justify-center gap-[10px] p-[15px] "
        onSubmit={handleSignIn}
      >
        <h1 className="text-gray-800 text-[30px] font-semibold mb-[30px] ">
          Sign In
        </h1>

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
          className="w-[100%] h-[50px] rounded-full bg-[#24b2ff] mt-[20px] text-white hover:bg-[#4ec1ff] transition-all "
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign In"}
        </button>

        <p
          className="text-center cursor-pointer "
          onClick={() => navigate("/signup")}
        >
          Want to create a new account ?{" "}
          <span className="text-[#1a93d4] ">Sign Up</span>
        </p>
      </form>
    </div>
  );
}

export default Login;
