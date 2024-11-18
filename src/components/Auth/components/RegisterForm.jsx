import { Link } from "react-router-dom";
import styles from "../styles/auth.module.scss"
import { Button } from "antd";

export const RegisterForm = ({ handleSubmit, setName, setEmail, setPassword, loading, setShowRegister }) => (
    <>
        <form onSubmit={handleSubmit} className={styles.centerForm}>
            <div className={styles.inputGroup}>
                <input type="text" placeholder="Enter Your Name" onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className={styles.inputGroup}>
                <input type="email" placeholder="Enter Your Email" onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className={styles.inputGroup}>
                <input type="password" placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
            </button>
        </form>
        <div className={styles.extraOptions}>
            <Button type="link" onClick={() => setShowRegister(false)}>
                Already have an account? Login
            </Button>
        </div>
    </>
);
