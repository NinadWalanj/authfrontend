import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [buttonLoading, setbuttonLoading] = useState(false);
  const [spamTip, setSpamTip] = useState(false);

  const navigate = useNavigate();
  const { loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [loading, isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSpamTip(false);
    setbuttonLoading(true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/auth/login`,
        { email },
        { withCredentials: true }
      );
      setMessage(res.data.message || "Magic link sent! Check your inbox.");
      setSpamTip(true); // show spam folder tip
    } catch (err) {
      console.error(err);
      const errorMsg =
        err.response?.data?.message || "Failed to send magic link.";
      setMessage(errorMsg);
      setSpamTip(false);
    } finally {
      setbuttonLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <br />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={buttonLoading}
          />
        </div>
        <button type="submit" disabled={loading}>
          {buttonLoading ? "Sending..." : "Send Login Link"}
        </button>
      </form>

      {message && <p style={{ textAlign: "center" }}>{message}</p>}

      {spamTip && (
        <div
          style={{
            marginTop: "0.5rem",
            backgroundColor: "#fff3cd",
            color: "#856404",
            padding: "0.75rem",
            borderRadius: "5px",
            border: "1px solid #ffeeba",
            fontSize: "0.95rem",
          }}
        >
          Don’t see the email? Check your spam or promotions folder.
        </div>
      )}

      <div className="link-group">
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
        <p>
          <Link to="/">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
