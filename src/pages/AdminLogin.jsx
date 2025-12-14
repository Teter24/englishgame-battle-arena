import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const correctPassword = import.meta.env.VITE_GM_PASSWORD;
 

    if (password === correctPassword) {
      localStorage.setItem("admin_auth", "true");
      navigate("/admin");
    } else {
      alert("Incorrect password!");
    }
  };

  return (
    <div className="login-container">
      <h1>Game Master Login</h1>

      <input 
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>
        Log in
      </button>
    </div>
  );
}
