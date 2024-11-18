import React, { useState } from "react";
import styles from "./styles/Navbar.module.scss";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { AuthLogin } from "../Auth/Auth";
import { SvgRepo } from "../SvgRepo";
import { jwtDecode } from "jwt-decode";
import { message, Select } from "antd";
const { Option } = Select;

const Navbar = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  if (token) {
    const decodedToken = jwtDecode(token);

    console.log(decodedToken);
  }

  return (
    <div className={styles.navbar}>
      <Link to={"/"}>
        <img className={styles.logo} src={logo} alt="" />
      </Link>
      <div className={`${styles.navlinks} ${styles.desktopView}`}>
        <Link to={"/"}>
          <span>{SvgRepo.blog}</span>
          <p> Blogs </p>
        </Link>
        <div
          className={styles.createBlog}
          onClick={() => {
            if (!token) {
              message.warning("Please login to create a blog");
              navigate("/");
            } else {
              navigate("/create");
            }
          }}
        >
          <Link >
            <span
              onClick={() => {
                if (!token) message.warning("Please login to create a blog");
              }}
            >
              {SvgRepo.createPost}
            </span>
            <p
              onClick={() => {
                if (!token) message.warning("Please login to create a blog");
              }}
            >
              Create Blog
            </p>
          </Link>
        </div>

        {token ? (
          <div className={styles.loginIcon}>
            <span>{SvgRepo.notification}</span>
            <span onClick={() => navigate("/profile")}>K</span>
          </div>
        ) : (
          <button
            className={styles.loginButton}
            onClick={() => setModalOpen(true)}
          >
            Sign In
          </button>
        )}
        <AuthLogin modalOpen={modalOpen} setModalOpen={setModalOpen} />
      </div>

      <div className={styles.mobileView}>
        <div onClick={() => setMenuOpen((prev) => !prev)}>
          <span>{SvgRepo.menubar}</span>
        </div>
        <MobileMenuList
          menuOpen={menuOpen}
          setModalOpen={setModalOpen}
          modalOpen={modalOpen}
        />
      </div>
    </div>
  );
};

export default Navbar;

const MobileMenuList = ({ menuOpen, setModalOpen, modalOpen }) => {
  return (
    <div>
      {menuOpen && (
        <div className={styles.mobileList}>
          <Link to={"/"}>
            <p> Blogs </p>
          </Link>
          <Link to={"/blog"}>
            <p>Create Blog</p>
          </Link>

          <button
            className={styles.loginButton}
            onClick={() => setModalOpen(true)}
          >
            Sign In
          </button>
          <AuthLogin modalOpen={modalOpen} setModalOpen={setModalOpen} />
        </div>
      )}
    </div>
  );
};
