import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Send } from "lucide-react";
import { ClipLoader } from "react-spinners";
import "../styles/auth.css";
import supabase from "../supabase.js";
import { showToast } from "../utils/notifications";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/update-password",
    });

    setLoading(false);

    if (error) {
      showToast("error", error.message);
      return;
    }

    showToast("success", "Password reset link sent! Please check your email.");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          ✓ <span>Taskly</span>
        </div>

        <h1>Forgot Password?</h1>
        <p className="auth-subtitle">
          Enter your email to receive a password reset link.
        </p>

        <form onSubmit={handleReset}>
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

          <button className="auth-btn" disabled={loading}>
            {loading ? (
              <ClipLoader size={20} color="#fff" />
            ) : (
              <>
                <Send size={19} /> Send Reset Link
              </>
            )}
          </button>
        </form>

        <p className="auth-bottom">
          Remember your password? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
