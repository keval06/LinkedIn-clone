import generateToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  try {
    // console.log("Received signup request:", req.body); // 👈 log request
    // 1. Extract data from request body
    const { firstName, lastName, userName, email, password } = req.body;
    // 2. Validation checks
    let existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({
        message: "Email already exists..!",
      });
    }

    // useranme exist
    let existUsername = await User.findOne({ userName });
    if (existUsername) {
      return res.status(400).json({
        message: "Username already exists..!",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }
    //end input validation
    // 3. Hash password
    let hashedPassword = await bcrypt.hash(password, 10);

    //  4. Create user in database
    const user = await User.create({
      firstName,
      lastName,
      userName,
      email,
      password: hashedPassword,
    });

    // 5. Generate JWT token
    let token = await generateToken(user._id);

    // 6. Set cookie with token
    res.cookie("token", token, {
      httpOnly: true, // Prevents XSS attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      sameSite: "strict", // CSRF protection
      secure: process.env.NODE_ENVIRONMENT === "production", // HTTPS only in production
    });
    //token stored in cookie, signup success
    //    7. Return user data
    return res.status(201).json(user);
  } catch (error) {
    console.error("🔥 signUp error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

//User Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //  1. Find user by email
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User Doesn't Exists..!",
      });
    }

    //check password, hashed password by bcrypt and user innput
    // 2. Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect Password",
      });
    }

    // 3. Generate token and set cookie (same as signup)
    //    after creating user, generate token
    let token = await generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, //milisecond
      sameSite: "strict",
      secure: process.env.NODE_ENVIRONMENT === "production",
    });
    console.log("auth.controller.js:97 | User LoggedIn Success");

    return res.status(200).json(user);
    //token stored in cookie, login success
  } catch (error) {
    console.error("Login error details:", error);
    return res.status(500).json({
      message: "Login error",
    });
  }
};

//User Logout, clear token from cookies

export const logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      message: "Logout Success",
    });
  } catch (error) {
    console.error("Login error details:", error);
    return res.status(500).json({
      message: "Logout error",
    });
  }
};
