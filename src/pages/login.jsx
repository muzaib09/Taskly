import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import { ClipLoader } from "react-spinners";
import "../styles/auth.css";
import supabase from "../supabase.js";
import { showToast } from "../utils/notifications";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    setLoading(false);

    if (error) {
      showToast("error", error.message);
      return;
    }

    await showToast("success", "Login successful!");
    navigate("/todo");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          ✓ <span>Taskly</span>
        </div>

        <h1>Welcome Back</h1>
        <p className="auth-subtitle">Login to continue managing your tasks.</p>

        <form onSubmit={handleLogin}>
          <label>Email Address</label>
          <div className="auth-input">
            <Mail size={19} />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label>Password</label>
          <div className="auth-input">
            <Lock size={19} />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="auth-forgot">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button className="auth-btn" disabled={loading}>
            {loading ? (
              <ClipLoader size={20} color="#fff" />
            ) : (
              <>
                <LogIn size={19} />
                Login
              </>
            )}
          </button>
        </form>

        <p className="auth-bottom">
          Don't have an account? <Link to="/signup">Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
