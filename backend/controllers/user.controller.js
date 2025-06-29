import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";

export const getCurrentUser = async (req, res) => {
  try {
    let id = req.userId; // Set by isAuth middleware
    const user = await User.findById(id).select("-password"); //get all fields except password

    if (!user) {
      return res.status(400).json({
        message: "User Does not found",
      });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({
      message: "Get current user Error",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    // 1. Extract text data
    let { firstName, lastName, userName, headline, location, gender } =
      req.body;
    //json to js object -> JSON.parse()
    // // 2. Parse JSON strings back to objects/arrays
    let skills = req.body.skills ? JSON.parse(req.body.skills) : [];
    let education = req.body.education ? JSON.parse(req.body.education) : [];
    let experience = req.body.experience ? JSON.parse(req.body.experience) : [];

    // 3. Handle file uploads
    let profileImage;
    let coverImage;
    // console.log(req.files);
    //req.files is an object, if file is uploaded, it will have key as profileImage or coverImage
    //if file is uploaded, it will be an array of objects, each object has path
    //ipload on cloudinary, if condition true

    if (req.files.profileImage) {
      //return url, stored in the db

      profileImage = await uploadOnCloudinary(req.files.profileImage[0].path);
    }

    if (req.files.coverImage) {
      //return url, stored in the db
      coverImage = await uploadOnCloudinary(req.files.coverImage[0].path);
    }

    //update, new :true
    // 4. Update user in database
    //findByIdAndUpdate, new:true will return the updated user
    //select("-password") will not return password field
    let user = await User.findByIdAndUpdate(
      req.userId,
      {
        firstName,
        lastName,
        userName,
        headline,
        location,
        gender,
        skills,
        education,
        experience,
        profileImage,
        coverImage,
      },
      { new: true }
    ).select("-password");

    return res.status(200).json(user);
  } catch (error) {
    console.error("🔥updateProfile error:", error); // full stack in console

    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

export default updateProfile;

export const getProfile = async (req, res) => {
  try {
    //get userName from params
    //req.params is an object, it contains key as userName

    let { userName } = req.params;
    //find user by userName
    let user = await User.findOne({ userName }).select("-password");

    if (!user) {
      return res.status(400).json({
        message: "Username does not exist",
      });
    }
    //if user found, return user
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: `get profile error ${error}`,
    });
  }
};

export const search = async (req, res) => {
  try {
    //get userName from query
    let { query } = req.query;

    if (!query) {
      return res.status(400).json({
        message: "Query is required",
      });
    }

    let users = await User.find({
      //   i =>insensitive
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        { userName: { $regex: query, $options: "i" } },
        // skills array search
        { skills: { $in: [query] } },
      ],
    });

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `searchUser error ${error}`,
    });
  }
};

export const getSuggestedUser = async (req, res) => {
  try {
    //koi bhi 3 user show
    let currentUser = await User.findById(req.userId).select("connection");

    // $ne - not equal to, $nin -> not inluded
    let suggestedUsers = await User.find({
      _id: {
        $ne: currentUser,
        $nin: currentUser.connection,
      },
    }).select("-password");
    return res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `suggestedUser error ${error}`,
    });
  }
};
