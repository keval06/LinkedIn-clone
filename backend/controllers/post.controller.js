// badhi post mali jay
// create post

import Post from "../models/post.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import { io } from "../index.js";
import Notification from "../models/notification.model.js";

export const createPost = async (req, res) => {
  try {
    //description
    let { description } = req.body;
    let newPost;

    if (req.file) {
      //upload on cloudinary, it return path string, we use it
      let image = await uploadOnCloudinary(req.file.path);
      newPost = await Post.create({
        author: req.userId,
        description,
        image,
      });
    } else {
      // Text-only post
      newPost = await Post.create({
        author: req.userId,
        description,
      });
    }
    return res.status(201).json(newPost);
  } catch (error) {
    return res.status(500).json(`Create post error ${error}`);
  }
};

//access all post, controller

export const getPost = async (req, res) => {
  try {
    //you forget await

    const post = await Post.find()
      .populate("author", "firstName lastName profileImage headline userName")
      .populate("comment.user", "firstName lastName profileImage headline ") //when refersh, all username and commnet are diplayed
      .sort({ createdAt: -1 }); // // Latest posts first, spell mistake in profileImage
    return res.status(200).json(post);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "getPost error",
    });
  }
};

// Population Explained:

// Before population
// {
//   author: ObjectId("60d5ec49f1b2c8b1f8e4e1a1"),
//   description: "Hello World"
// }

// // After population
// {
//   author: {
//     _id: "60d5ec49f1b2c8b1f8e4e1a1",
//     firstName: "John",
//     lastName: "Doe",
//     profileImage: "https://cloudinary.com/image.jpg"
//   },
//   description: "Hello World"
// }

export const like = async (req, res) => {
  try {
    let postId = req.params.id;
    // jwt, uthentication
    let userId = req.userId;
    let post = await Post.findById(postId);

    if (!post) {
      return res.status(400).json({
        messge: "Post not Found",
      });
    }

    //user already liked it or not
    if (post.like.includes(userId)) {
      post.like = post.like.filter((id) => id != userId);
    } else {
      post.like.push(userId);
      //ehwn like, send notification
      if(post.author != userId ){
      let notification = await Notification.create({
        //whom to send
        receiver: post.author,
        type:"like", 
        relatedUser: userId,
        relatedPost:postId,
      })
    }
    }

    //save after updating
    await post.save();

    //web scocket
    // 🔥 Real-time update to all connected clients
    io.emit("likeUpdated", {
      postId,
      likes: post.like,
    });

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({
      message: "Like error",
    });
  }
};

export const comment = async (req, res) => {
  try {
    let postId = req.params.id;
    let userId = req.userId;
    let { content } = req.body;
    //commment is an array
    let post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comment: { content, user: userId } },
      },
      { new: true }
    ).populate("comment.user", "firstName lastName profileImage headline");
    if(post.author != userId ){
    let notification = await Notification.create({
        //whom to send
        receiver: post.author,
        type:"comment", 
        relatedUser: userId,  //who commented
        relatedPost:postId,
      })}
    // .sort()
    //populate
    // 🔥 Real-time comment update
    io.emit("commentAdded", {
      postId,
      comm: post.comment,
    });

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({
      message: "Comment error",
    });
  }
};
