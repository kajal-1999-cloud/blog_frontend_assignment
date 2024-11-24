import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { format } from "timeago.js";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { SvgRepo } from "../../../components/SvgRepo";
import styles from "../styles/blogDetails.module.scss";
import { message, Spin } from "antd";
import io from "socket.io-client";  


const socket = io(import.meta.env.VITE_BACKEND_API);


export function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = token ? jwtDecode(token)?.id : null;
  const [blogDetails, setBlogDetails] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  let commentData 
  
  // Fetch blog details by ID
useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}/api/blogs/post/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBlogDetails(response.data);
        setComments(response.data.comments || []);
        setIsLiked(
          response?.data?.likes?.some((like) => like.userId === userId)
        );
      } catch (err) {
        console.error(err);
        message.error("Server error");
      }
    };

    fetchBlogDetails();

    // Listen for new comments via Socket.IO
  
  }, [id, userId, token]);


  useEffect(()=> {
    socket.emit("joinBlogRoom", id);
    socket.on("commentAdded", (data) => {
      console.log("comments on ", data.comment)
      if (data.blogId === id) {
        setComments((prev) => [...prev, data.comment]);
      }
    });

    return () => {
      socket.off("commentAdded");
    };
  },[id])
  // delete post
  const handleDelete = async (postId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmed) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_API}/api/blogs/delete/post/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Post deleted successfully");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to delete the post");
    }
  };
  const handleAddComment = () => {
    if (!newComment.trim()) return;

     commentData = {
      blogId: id,
      comment:{
        userId,
        name: user?.name,
        comment: newComment,
      }
     
    };
console.log("commentData", commentData)
    socket.emit("newComment", commentData);
// setComments([...comments, commentData.comment])

    console.log("data added")
    setNewComment(""); 
  };



  // like/unlike
  const handleLike = async (postId) => {
    console.log("hello");
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/api/blogs/like/post/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsLiked(!isLiked);
      setBlogDetails((prev) => ({
        ...prev,
        likes: isLiked
          ? prev.likes.filter((like) => like.userId !== userId)
          : [...prev.likes, { userId }],
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to like the post");
    }
  };

  if (!blogDetails)
    return (
      <div>
        <Spin />
      </div>
    );

  return (
    <div className={styles.blogDetails}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <Link to="/" className={styles.goBack}>
            <span className={styles.arrow}>Go Back</span>
          </Link>
                <img src={`${import.meta.env.VITE_BACKEND_API}${blogDetails.image}`} alt="" />
                {/* <img src={`${item.image}`} alt="" /> */}

          {/* <img src={blogDetails.image} alt={blogDetails.title} /> */}
          <div className={styles.titleAndControls}>
            <h3 className={styles.title}>{blogDetails.title.toUpperCase()}</h3>
            {blogDetails.userId === userId && (
              <div className={styles.controls}>
                <div className={styles.delete}>
                  <span onClick={() => handleDelete(blogDetails._id)}>
                    {SvgRepo.Delete}
                  </span>
                  <span
                    onClick={() => navigate(`/edit/post/${blogDetails._id}`)}
                  >
                    {SvgRepo.edit}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className={styles.desc}>
            <p>{blogDetails.content}</p>
            <div>
              <span onClick={() => setShowComments(!showComments)}>{SvgRepo.Comment}</span>
              
                <span onClick={() => handleLike(blogDetails._id)}>
                  {isLiked ? (
                    <> 
                     <b> {blogDetails?.likes?.length}</b> {SvgRepo.likes}
                    </>
                  ) : (
<div style={{marginTop:"-0px", display:"flex"}}>
<span style={{marginTop:"12px"}}> <b>{blogDetails?.likes?.length}</b></span> <span >{ SvgRepo.outLineLike}</span>
</div>
                  )}
                </span>
            
            </div>
          </div>

          {showComments && (
            <div className={styles.commentSection}>
              <div className={styles.commentBox}>
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className={styles.commentInput}
                />
                <button onClick={handleAddComment} className={styles.addButton}>
                  Add
                </button>
              </div>

              <div className={styles.commentList}>
                {comments.slice().reverse().map((comment, index) => (
                  <div key={index} className={styles.comment}>
                    <strong>{comment.name}</strong> •{" "}
                    <span>{format(comment.createdAt)}</span>
                    <p>{comment.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div>

          </div>
        </div>
      </div>
    </div>
  );
}
