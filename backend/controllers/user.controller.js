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
    let {
      firstName,
      lastName,
      userName,
      headline,
      location,
      gender,
    } = req.body;
    //json to js object -> JSON.parse()
    // // 2. Parse JSON strings back to objects/arrays
    let skills=req.body.skills ? JSON.parse(req.body.skills) : [] ;
    let education=req.body.education ? JSON.parse(req.body.education) : [] ;
    let experience=req.body.experience ? JSON.parse(req.body.experience) : [] ;

     // 3. Handle file uploads
    let profileImage;
    let coverImage;
    // console.log(req.files);
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
    let user = await User.findByIdAndUpdate(req.userId, {
        firstName, lastName, userName, headline,location, gender, skills, education, experience,profileImage, coverImage
    },{new:true}).select("-password");

    return res.status(200).json(user)
    
  } catch (error) {
   console.error("🔥updateProfile error:", error);            // full stack in console
   
   return res
     .status(500)
     .json({ message: error.message || "Internal server error" });
  }
};

export default updateProfile;