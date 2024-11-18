import styles from "../styles/auth.module.scss"

export const LoginForm = ({ handleSubmit, setEmail, setPassword, loading }) => (
    <>
        <form onSubmit={handleSubmit} className={styles.centerForm}>
            <div className={styles.inputGroup}>
                <input
                    type="email"
                    placeholder="Enter Your Email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className={styles.inputGroup}>
                <input
                    type="password"
                    placeholder="Enter Your Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </button>
        </form>

    </>
);
