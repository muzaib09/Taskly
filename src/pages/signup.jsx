import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserRound, Mail, Lock, UserPlus } from "lucide-react";
import { ClipLoader } from "react-spinners";
import "../styles/auth.css";
import supabase from "../supabase.js";
import { showToast } from "../utils/notifications";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      showToast("warning", "Password must be at least 6 characters!");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    setLoading(false);

    if (error) {
      showToast("error", error.message);
      return;
    }

    await showToast("success", "Account created successfully!");
    navigate("/login");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          ✓ <span>Taskly</span>
        </div>

        <h1>Create Account</h1>
        <p className="auth-subtitle">Start organizing your tasks today.</p>

        <form onSubmit={handleSignup}>
          <label>Your Name</label>
          <div className="auth-input">
            <UserRound size={19} />
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="auth-btn" disabled={loading}>
            {loading ? (
              <ClipLoader size={20} color="#fff" />
            ) : (
              <>
                <UserPlus size={19} /> Create Account
              </>
            )}
          </button>
        </form>

        <p className="auth-bottom">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
