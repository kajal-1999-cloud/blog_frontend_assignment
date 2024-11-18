import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";

export const CreatePostPage = () => {
  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode(token)?.id : null;
const navigate = useNavigate()
  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]); // Access the selected file
  };

  const handleSubmit = async (values) => {
    const formDataToSend = new FormData();
    formDataToSend.append("userId", userId);
    formDataToSend.append("title", values.title);
    formDataToSend.append("content", values.content);
    formDataToSend.append("tags", values.tags);
    formDataToSend.append("image", image); 

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/api/blogs/post`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      message.success(response.data.message);
      navigate('/')
    } catch (error) {
      message.error(error.response?.data?.message || "An error occurred");
    }
  };
  useEffect(() => {
    if (!token) {
   
      message.warning('Please login to create a blog');
      navigate('/'); 
    }
  }, [token]);
  return (
    <div>
      <h1>Create Blog Post</h1>
      <Form onFinish={handleSubmit} layout="vertical">
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
          label="Tags (comma-separated)"
          name="tags"
          rules={[{ required: true, message: "Please enter some tags!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Image"
          name="image"
          rules={[{ required: true, message: "Please upload an image!" }]}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
