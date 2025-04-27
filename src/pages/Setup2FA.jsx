import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Setup2FA = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [qr, setQr] = useState("");
  const [base32, setBase32] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  // Fetch QR code and base32 on load
  useEffect(() => {
    const fetchQR = async () => {
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
        navigate("/register");
        return;
      }

      try {
        const res = await axios.get(
          `${backendUrl}/api/auth/setup-2fa?token=${token}`
        );
        setQr(res.data.qr);
        setBase32(res.data.base32);
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        const errorMsg =
          err.response?.data?.message ||
          "Something went wrong. Please try again.";
        setMessage(errorMsg);

        if (errorMsg.toLowerCase().includes("session expired")) {
          toast.error("Session expired. Redirecting to registration...", {
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
            navigate("/register");
          }, 4000); // give user time to read the toast
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQR();
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setVerifying(true);

    try {
      const res = await axios.post(`${backendUrl}/api/auth/confirm-2fa-setup`, {
        token,
        code,
        base32,
      });

      setMessage(res.data.message);
      if (res.data.message.toLowerCase().includes("2fa setup complete")) {
        toast.success("Redirecting to the login page...", {
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
      }
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to verify 2FA code.";
      setMessage(errorMsg);
      if (errorMsg.toLowerCase().includes("10 minutes")) {
        toast.error(
          "All attempts have been exhausted. Redirecting to the registration page...",
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
          navigate("/register");
        }, 4000); // give user time to read the toast
      }
    } finally {
      setVerifying(false);
    }
  };

  if (loading) return <div className="container">Loading QR Code...</div>;

  return (
    <div className="container">
      <h2>Set up Two-Factor Authentication</h2>

      <div
        style={{
          backgroundColor: "#fff3cd",
          color: "#856404",
          padding: "1rem",
          border: "1px solid #ffeeba",
          borderRadius: "8px",
          marginBottom: "1.5rem",
          fontSize: "0.95rem",
          fontWeight: "500",
          textAlign: "center",
        }}
      >
        ⚠️ Important: If you scanned a QR code before, please remove the old
        account from your Authenticator app. Only the latest QR code will work
        for registration and login.
      </div>

      {qr && <img src={qr} alt="Scan QR Code" />}
      <p>
        Scan this QR code using Microsoft Authenticator or any TOTP-compatible
        app.
      </p>

      <form onSubmit={handleSubmit}>
        <label>Enter the 6-digit code from your app:</label>
        <input
          type="text"
          maxLength="6"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button type="submit" disabled={verifying}>
          {verifying ? "Verifying..." : "Verify"}
        </button>
      </form>

      {message && <p style={{ textAlign: "center" }}>{message}</p>}
    </div>
  );
};

export default Setup2FA;
