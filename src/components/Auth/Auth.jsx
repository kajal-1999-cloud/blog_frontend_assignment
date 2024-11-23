import React, { useState } from "react";
import { Button, Modal, message } from "antd";
import styles from "./styles/auth.module.scss";
import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { RegisterForm } from "./components/RegisterForm";
import { LoginForm } from "./components/LoginForm";

export const AuthLogin = ({ modalOpen, setModalOpen, id }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("All Fields Required");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/api/auth/login`,
        { email, password }
      );
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      message.success("Login successfull");
      setModalOpen(false);
      if(id !== undefined){
        navigate(`/blogDetails/${id}`);

      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !name) {
      setError("Please fill all the fields.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/api/auth/register`,
        { name, email, password }
      );
      message.success("Registration successful! Please log in.");
      setShowRegister(false);
      if(id !== undefined){
        navigate(`/blogDetails/${id}`);

      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.authLogin}>
        <Modal
          title={
            <div className={styles.title}>
              <img src={logo} alt="" />
              <div>
                <h3>{showRegister ? "Register" : "Login"}</h3>
                <p>
                  {showRegister
                    ? "Create a new account"
                    : "Login for a seamless experience"}
                </p>
              </div>
            </div>
          }
          centered
          open={modalOpen}
          onOk={() => setModalOpen(false)}
          onCancel={() => setModalOpen(false)}
          footer={null}
        >
          <div className={styles.loginForm}>
            {error && (
              <p className={styles.errorMessage} style={{ color: "red" }}>
                {error}
              </p>
            )}

            {showRegister && (
              <RegisterForm
                handleSubmit={handleRegisterSubmit}
                setName={setName}
                setEmail={setEmail}
                setPassword={setPassword}
                loading={loading}
                setShowRegister={setShowRegister}
              />
            )}

            {!showRegister && (
              <LoginForm
                handleSubmit={handleLoginSubmit}
                setEmail={setEmail}
                setPassword={setPassword}
                loading={loading}
              />
            )}
            <div>
              {!showRegister && (
                <>
                  <Button type="link" onClick={() => setShowRegister(true)}>
                    Create an Account - Register
                  </Button>
                </>
              )}
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};
