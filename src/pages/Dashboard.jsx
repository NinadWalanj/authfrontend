import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Dashboard = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/dashboard/home`, {
        withCredentials: true,
      })
      .then((res) => {
        setMessage(res.data.message);
      })
      .catch(() => {
        navigate("/");
      });
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${backendUrl}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="container">
      <h2>{message}</h2>

      <button onClick={handleLogout}>Logout</button>

      <div
        style={{
          marginTop: "2rem",
          backgroundColor: "#fff3cd",
          border: "1px solid #ffeeba",
          padding: "1rem",
          borderRadius: "5px",
          color: "#856404",
          fontWeight: "500",
        }}
      >
        You will be automatically logged out in <strong>5 minutes</strong> due
        to session timeout.
      </div>
    </div>
  );
};

export default Dashboard;
