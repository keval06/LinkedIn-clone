import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    //cookie mathi token fetch and then verify using jwt.verify
    let { token } = req.cookies;

    if (!token) {
      return res.status(400).json({
        message: "User Doesn't have token",
      });
    }

    let verifiedToken =  jwt.verify(token, process.env.JWT_SECRET);
    if (!verifiedToken) {
      return res.status(400).json({
        message: "User Doesn't have valid token",
      });
    }
    
    //set new query params
    req.userId = verifiedToken.userId;
    next();
  } catch (error) {
    return res.status(500).json({
      message: "is Auth error",
    });
  }
};

export default isAuth;
