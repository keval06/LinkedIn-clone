import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (filePath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
  });

  try {
    if (!filePath) {
      return null;
    }
    const uploadResult = await cloudinary.uploader.upload(filePath);//upload to cloudinary
    fs.unlinkSync(filePath); //delete from diskStorage after uploading in cloudinary

    return uploadResult.secure_url;
  } 
  catch (error) {
    fs.unlinkSync(filePath);
    console.log(error);
  }
};

export default uploadOnCloudinary;
