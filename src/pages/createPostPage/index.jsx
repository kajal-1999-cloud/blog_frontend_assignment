import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Form, Input, Button, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./styles/createPost.module.scss";
import background from "../../assets/math.jpeg";

import Navbar from "../../components/navbar";

export const CreatePostPage = () => {
  const { id } = useParams(); // Get the post ID from the route params
  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode(token)?.id : null;
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [form] = Form.useForm(); // Ant Design form instance
  const [loading, setLoading] = useState(false);

  // Fetch post data if editing
  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          setLoading(true);
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_API}/api/blogs/post/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const { title, content, tags, image } = response.data;
          form.setFieldsValue({ title, content, tags });
          setImage(image); // Set the existing image (optional)
          setLoading(false);
        } catch (error) {
          message.error("Failed to fetch post details.");
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [id, token, form]);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (values) => {
    const formDataToSend = new FormData();
    formDataToSend.append("userId", userId);
    formDataToSend.append("title", values.title);
    formDataToSend.append("content", values.content);
    formDataToSend.append("tags", values.tags);
    if (image instanceof File) formDataToSend.append("image", image);

    try {
      const endpoint = id
        ? `${import.meta.env.VITE_BACKEND_API}/api/blogs/post/${id}`
        : `${import.meta.env.VITE_BACKEND_API}/api/blogs/post`;
      const method = id ? "put" : "post";

      const response = await axios[method](endpoint, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      message.success(response.data.message);
      navigate("/");
    } catch (error) {
      message.error(error.response?.data?.message || "An error occurred");
    }
  };

  useEffect(() => {
    if (!token) {
      message.warning("Please login to create a blog");
      navigate("/");
    }
  }, [token]);

  return (
    <>
      <Navbar />
      <div className={styles.CreatePostPage}>
        <img src={background} alt="" />
        <div className={styles.CreatePostWrapper}>
          <h1>{id ? "Edit Blog Post" : "Create Blog Post"}</h1>
          {!loading ? (
            <Form form={form} onFinish={handleSubmit} layout="vertical">
              <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true, message: "Please enter a title!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Content"
                name="content"
                rules={[{ required: true, message: "Please enter content!" }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>

              <Form.Item
                label="Tags"
                name="tags"
                rules={[{ required: true, message: "Please enter some tags!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Image"
                name="image"
                rules={[
                  !id && { required: true, message: "Please upload an image!" },
                ]}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {id ? "Update" : "Submit"}
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </>
  );
};
