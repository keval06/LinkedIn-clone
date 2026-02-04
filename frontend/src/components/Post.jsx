import React, { useContext, useEffect, useState } from "react";
import dp from "../assets/dp.webp";
import moment from "moment";
import { BiLike } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa6";
import { BiSolidLike } from "react-icons/bi";
import axios from "axios";
import { authDataContext } from "../context/AuthContext.jsx";
import { socket, userDataContext } from "../context/UserContext.jsx";
import { LuSendHorizontal } from "react-icons/lu";
import ConnectionButton from "./ConnectionButton.jsx";

function Post({ id, author, like, comment, image, description, createdAt }) {
  let [more, setMore] = useState(false);
  let { serverUrl } = useContext(authDataContext);
  let [likes, setLikes] = useState([]);
  let { userData, setUserData, getPost, handleGetProfile } =
    useContext(userDataContext);
  let [commentContent, setCommentContent] = useState("");
  let [comments, setComments] = useState([]);
  let [showComment, setShowComment] = useState(false);

  useEffect(() => {
    socket.on("likeUpdated", ({ postId, likes }) => {
      if (postId == id) {
        setLikes(likes);
      }
    });
    socket.on("commentAdded", ({ postId, comm }) => {
      if (postId == id) {
        setComments(comm);
      }
    });
    return () => {
      socket.off("likeUpdated");
      socket.off("commentAdded");
    };
  }, [id]);

  useEffect(() => {
    setLikes(like);
    setComments(comment);
  }, [like, comment]);

  // handle like
  const handleLike = async () => {
    try {
      let result = await axios.get(serverUrl + `/api/post/like/${id}`, {
        withCredentials: true,
      });
      setLikes(result.data.like);
    } catch (error) {
      console.log("Post.jsx:53 |", error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();

    if (commentContent.trim() !== "") {
      try {
        let result = await axios.post(
          serverUrl + `/api/post/comment/${id}`,
          {
            content: commentContent,
          },
          {
            withCredentials: true,
          },
        );
        setComments(result.data.comment);
        setCommentContent("");
      } catch (error) {
        console.log("Post.jsx:58 |", error);
      }
    } else {
      alert("Please Enter a comment");
      setCommentContent("");
    }
  };

  // If author was deleted from database, don't render this post
  if (!author) {
    return null;
  }

  return (
    <div className="w-full min-h-[200px] bg-white rounded-lg shadow-lg p-[10px] flex flex-col gap-[20px] ">
      <div className="flex justify-between items-center ">
        <div
          className="flex justify-center items-start gap-[10px]"
          onClick={() => handleGetProfile(author.userName)}
        >
          {/* Profile img */}
          <div className="w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center cursor-pointer  ">
            <img src={author.profileImage || dp} alt="" className=" h-full " />
          </div>

          <div>
            {/* naam */}
            <div className=" text-[22px] font-semibold ">
              {`${author.firstName} ${author.lastName}`}
            </div>

            {/* Headlinr */}
            <div className=" text-[16px] ">{author.headline}</div>

            {/* moment */}
            <div className=" text-[16px] ">{moment(createdAt).fromNow()}</div>
          </div>
        </div>

        <div>
          {userData && userData._id !== author._id && (
            <ConnectionButton userId={author._id} />
          )}
        </div>
        {/* Description */}
      </div>
      <div
        className={`w-full ${
          !more ? "max-h-[100px] overflow-hidden" : ""
        }  pl-[50px] `}
      >
        {description}
      </div>
      <div
        className="pl-[50px] font-bold text-
        [19px] cursor-pointer "
        onClick={() => setMore((prev) => !prev)}
      >
        {more ? "Read Less..." : "Read More..."}
      </div>

      {/* Image of post */}
      {image && (
        <div className="w-full h-[300px] overflow-hidden flex justify-center rounded mb-[5px] ">
          <img src={image} alt="" className="h-full rounded-lg " />
        </div>
      )}
      {/* Like  */}
      <div>
        <div className="w-full flex justify-between items-center p-[20px] ">
          <div className="flex items-center justify-center gap-[5px] text-[18px] ">
            {/* {" "} */}
            <BiLike className="text-[#1ebbff] w-[25px] h-[25px]  rounded transition-all " />
            <span>{likes.length}</span>
          </div>
          <div
            className="flex justify-centeri items-center gap-[5px] text-[18px] cursor-pointer"
            onClick={() => setShowComment((prev) => !prev)}
          >
            <span>{comments.length}</span>
            <span> Comments</span>
          </div>
        </div>
        <hr className="bg-gray-500 shadow-none h-[3px]" />
        {/* comment */}
        <div className="flex justify-start items-center w-full p-[20px] gap-[20px] ">
          {userData && !likes.includes(userData._id) && (
            <div
              className="flex justify-center items-center gap-[5px] cursor-pointer"
              onClick={handleLike}
            >
              <BiLike className="w-[24px] h-[24px]" />
              <span>Like</span>
            </div>
          )}

          {userData && likes.includes(userData._id) && (
            <div
              className="flex justify-center items-center gap-[5px] cursor-pointer"
              onClick={handleLike}
            >
              <BiSolidLike className="w-[24px] h-[24px] text-[#1ebbff]" />
              <span className="text-[#1ebbff] font-semibold">Liked</span>
            </div>
          )}

          <div
            className="flex justify-center items-center gap-[5px] cursor-pointer "
            onClick={() => setShowComment((prev) => !prev)}
          >
            <FaRegCommentDots className="w-[24px] h-[24px]  " />
            <span className="">Comment</span>
          </div>
        </div>
        {/* comment */}

        {showComment && (
          <div>
            <form
              className="w-full flex justify-between items-center border-b-2 border-b-gray-300 p-[10px] cursor-text  "
              onSubmit={handleComment}
            >
              <input
                type="text"
                placeholder={"Leave a comment"}
                className="w-full outline-none border-none overflow-hidden "
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
              />
              <button>
                <LuSendHorizontal className="h-[25px] w-[25px] text-[#1ebbff] " />
              </button>
            </form>
            {/* Display / Map alll comments */}
            {/* com.user && kips rendering comments where the commenter was deleted */}
            <div className="flex flex-col gap-[10px]">
              {comments.map(
                (com) =>
                  com.user && (
                    <div
                      key={com._id}
                      className="flex flex-col gap-[10px] border-b-2 border-b-gray-300 p-[20px] "
                    >
                      <div className="w-full flex justify-start items-center gap-[10px] ">
                        {/* Profile, naam */}
                        <div className="w-[40px] h-[40px] rounded-full overflow-hidden flex items-center justify-center cursor-pointer  ">
                          <img
                            src={com.user.profileImage || dp}
                            alt=""
                            className=" h-full "
                          />
                        </div>
                        {/* TIME */}
                        <div>
                          <div className=" text-[16px] font-semibold ">
                            {`${com.user.firstName} ${com.user.lastName}`}
                          </div>
                          <div>{moment(com.createdAt).fromNow()}</div>
                        </div>
                      </div>
                      {/* Content */}
                      <div className="pl-[50px]">{com.content}</div>
                    </div>
                  ),
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Post;
