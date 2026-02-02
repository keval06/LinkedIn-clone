import jwt from "jsonwebtoken";

const generateToken = async (userId) => {
  //use jwt, pass as object
  try {
    let token = await jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return token;
  } catch (error) {
    console.log("token.js:10 |", error);
  }
};

export default generateToken;
