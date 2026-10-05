import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        sessionStorage.setItem("token", data.token);
        navigate("/admin/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Could not reach server");
    }
  };

  return (
    <div className="admin-container" style={{ maxWidth: 400 }}>
      <h1 className="admin-title">Admin Login</h1>
      <div className="admin-card">
        <form className="admin-form" onSubmit={handleLogin}>
          <label>Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)} required />

          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />

          <button type="submit" className="submit-btn">Log In</button>
          {error && <p style={{ color: "#ff8080" }}>{error}</p>}
        </form>
      </div>
    </div>
  );
};