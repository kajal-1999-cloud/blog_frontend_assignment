import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react'
import styles from "./styles/profile.module.scss"
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { SvgRepo } from "../../components/SvgRepo";
import { Spin } from "antd";
import img1 from "../../assets/img11.jpg";
import axios from "axios";
import Navbar from '../../components/navbar';



function ProfilePage() {

  const user = JSON.parse(localStorage.getItem("user"));
  // Decode token to get user ID
  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode(token)?.id : null;
  const [loading, setLoading] = useState()
  const [blogData, setBlogData] = useState([])
  const navigate = useNavigate()

  const BLogData = [
    {
      image: img1,
      title: "Technologies",
      content: " The AMC 8 is a 25-question, 40-minute competition for students   in grade 8 and below. The material covered on the AMC 8 includes topics from a typical middle school mathematics curriculum. Possible topics include but are not limited to counting and probability, estimation, proportional reasoning, elementary geometry including the Pythagorean Theorem, spatial visualization, everyday applications, and reading and interpreting graphs and tables. In addition, some of the later questions may involve linear or quadratic functions and equations, coordinate geometry, and other topics traditionally covered in a beginning algebra course.",
      tags: "technology",
    },
    {
      image: img1,
      title: "Technologies",
      content: "  The AMC 8 is a 25-question, 40-minute competition for students   in grade 8 and below. The material covered on the AMC 8 includes topics from a typical middle school mathematics curriculum. Possible topics include but are not limited to counting and probability, estimation, proportional reasoning, elementary geometry including the Pythagorean Theorem, spatial visualization, everyday applications, and reading and interpreting graphs and tables. In addition, some of the later questions may involve linear or quadratic functions and equations, coordinate geometry, and other topics traditionally covered in a beginning algebra course.",
      tags: "technology",
    },
    {
      image: img1,
      title: "Technologies",
      content: "  The AMC 8 is a 25-question, 40-minute competition for students   in grade 8 and below. The material covered on the AMC 8 includes topics from a typical middle school mathematics curriculum. Possible topics include but are not limited to counting and probability, estimation, proportional reasoning, elementary geometry including the Pythagorean Theorem, spatial visualization, everyday applications, and reading and interpreting graphs and tables. In addition, some of the later questions may involve linear or quadratic functions and equations, coordinate geometry, and other topics traditionally covered in a beginning algebra course.",
      tags: "technology",
    },
    {
      image: img1,
      title: "Technologies",
      content: "  The AMC 8 is a 25-question, 40-minute competition for students   in grade 8 and below. The material covered on the AMC 8 includes topics from a typical middle school mathematics curriculum. Possible topics include but are not limited to counting and probability, estimation, proportional reasoning, elementary geometry including the Pythagorean Theorem, spatial visualization, everyday applications, and reading and interpreting graphs and tables. In addition, some of the later questions may involve linear or quadratic functions and equations, coordinate geometry, and other topics traditionally covered in a beginning algebra course.",
      tags: "technology",
    },
  ];

  const fetchPosts = async () => {
    setLoading(true);
    console.log(import.meta.env.VITE_BACKEND_API)
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/blogs/user/post/${userId}`);
      console.log("response", response)

      setBlogData(response.data.reverse());
    } catch (error) {
      console.error("Error fetching posts:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };
  
const handleNavigate =(blogId) =>{

  if(token){
navigate(`/blogDetails/${blogId}`)
  }
}

const handleLogout = () => {
  localStorage.removeItem("token"); // Remove token
  localStorage.removeItem("user");  // Optionally remove user data from localStorage
  navigate("/"); // Redirect to login page
  message.success("Logged out successfully");
};
  useEffect(() => {
    fetchPosts()
  },[])


  return (
    <>
    <Navbar/>
    <div  className={styles.profilePage}>

<div className={styles.profileWrapper}>

<h5>{user.name.charAt(0).toUpperCase()}</h5>
<div>
<p>NAME: {user.name}</p>
<p>EMAIL: {user.email}</p>
<button onClick={handleLogout}>
  Logout
</button>
</div>

</div>

<div>
<div className={styles.listContainer}>
<div className={styles.listWrapper}>
  {blogData?.map((item) => {
    return (
      <div className={styles.blogList} onClick={() => handleNavigate(item._id)}>
        {/* <div className={styles.imageWrapper}>
          <img src={item.image} alt="" />
        </div> */}
        <div className={styles.paraWrapper}>
          <h4>{item.title.toUpperCase()}</h4>
          <p>
          {item.content.slice(0, 100)}{item.content.length > 100 && "...Read more"}
         
          </p>
         
        </div>
      </div>
    );
  })}
</div>
</div>
</div>
</div>
    </>
  )
}

export default ProfilePage