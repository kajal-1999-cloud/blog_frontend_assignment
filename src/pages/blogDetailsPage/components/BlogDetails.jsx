import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { format } from "timeago.js";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { SvgRepo } from "../../../components/SvgRepo";
import styles from "../styles/blogDetails.module.scss";
import { message, Spin } from "antd";

export function BlogDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [blogDetails, setBlogDetails] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  // Decode token to get user ID
  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode(token)?.id : null;
  console.log("token", token);
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
        console.log(response);
        setIsLiked(
          response?.data?.likes?.some((like) => like.userId === userId)
        );
      } catch (err) {
        console.error(err);
        message.error("server error");
        // navigate("/"); // Redirect to home on error
      }
    };
    fetchBlogDetails();
  }, [id, userId, token, navigate]);

  // delete post
  const handleDelete = async (postId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_API}/api/blogs/post/${postId}`,
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

  // like/unlike
  const handleLike = async (postId) => {
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

  if (!blogDetails) return <div><Spin/></div>;

  return (
    <div className={styles.blogDetails}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <Link to="/" className={styles.goBack}>
            <span className={styles.arrow}>Back</span>
          </Link>
          <img src={blogDetails.image} alt={blogDetails.title} />
          <div className={styles.titleAndControls}>
            <h3 className={styles.title}>{blogDetails.title.toUpperCase()}</h3>
            {blogDetails.userId?._id === userId ? (
              <div className={styles.controls}>
                <div className={styles.delete}>
                  <span onClick={() => handleDelete(blogDetails._id)}>
                    {SvgRepo.Delete}
                  </span>
                </div>
              </div>
            ) : (
              <div className={styles.like}>
                <span onClick={() => handleLike(blogDetails._id)}>
                  {isLiked ? (
                    <>
                      {" "}
                      {blogDetails?.likes?.length} {SvgRepo.likes}{" "}
                    </>
                  ) : (
                    SvgRepo.outLineLike
                  )}
                </span>
              </div>
            )}
          </div>
         
          <div className={styles.descAndLikes}>
            <p className={styles.desc}>
              
              {blogDetails.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
