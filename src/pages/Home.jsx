import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Welcome to Authera</h1>

      {/* 🛡 Warning OUTSIDE the button group */}
      <div
        style={{
          backgroundColor: "#fff3cd",
          color: "#856404",
          padding: "1rem",
          border: "1px solid #ffeeba",
          borderRadius: "8px",
          marginBottom: "2rem",
          fontSize: "0.95rem",
          fontWeight: "500",
          maxWidth: "100%",
          textAlign: "left",
        }}
      >
        ⚠️ <strong>Important Notice:</strong>
        <ul style={{ paddingLeft: "1.2rem" }}>
          <li>
            After setting up Two-Factor Authentication (2FA), do not delete the
            account from your Authenticator app.
          </li>
          <li>If deleted, you will be permanently locked out.</li>
          <li>Recovery options will be available in future updates.</li>
        </ul>
      </div>
      <p>Please choose an option:</p>

      {/* 🚀 Buttons grouped here */}
      <div className="home-buttons">
        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/register")}>Register</button>
      </div>
    </div>
  );
};

export default Home;
