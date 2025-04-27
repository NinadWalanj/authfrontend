import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const TwoFA = () => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  //In development, 2 alerts are seen at the same time, this is due to react strict mode. This won't happen in
  //production code.
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        toast.error("No session. Redirecting to the login page.", {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "dark",
          closeButton: false,
        });

        navigate("/login");
        return;
      }

      try {
        await axios.post(`${backendUrl}/api/auth/validate-2fa-token`, {
          token,
        });
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        toast.error("Session expired. Redirecting to the login page.", {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "dark",
          closeButton: false,
        });

        setTimeout(() => {
          navigate("/login");
        }, 4000);
      }
    };

    validateToken();
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/auth/verify2FA`,
        { code, token },
        { withCredentials: true }
      );

      if (res.data.redirectTo) {
        toast.success("Login successful! Redirecting...", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "dark",
          closeButton: false,
        });

        setTimeout(() => {
          navigate(res.data.redirectTo);
        }, 2000); // ⏳ wait 2 sec before redirect
      } else {
        setMessage(res.data.message || "2FA verified.");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "2FA verification failed.";
      setMessage(errorMsg);

      if (errorMsg.toLowerCase().includes("10 minutes")) {
        toast.error(
          "All attempts have been exhausted. Redirecting to the login page...",
          {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "dark",
            closeButton: false,
          }
        );

        setTimeout(() => {
          navigate("/login");
        }, 4000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Two-Factor Authentication</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Enter 6-digit code:</label>
          <input
            type="text"
            maxLength="6"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
      {message && <p style={{ textAlign: "center" }}>{message}</p>}
    </div>
  );
};

export default TwoFA;
