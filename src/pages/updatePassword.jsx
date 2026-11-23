import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Save } from "lucide-react";
import { ClipLoader } from "react-spinners";
import "../styles/auth.css";
import supabase from "../supabase.js";
import { showToast } from "../utils/notifications";

const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      showToast("warning", "Password must be at least 6 characters!");
      return;
    }

    if (password !== confirmPassword) {
      showToast("error", "Passwords do not match!");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: password,
    });
    setLoading(false);

    if (error) {
      showToast("error", error.message);
      return;
    }

    await showToast("success", "Password updated successfully!");
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          ✓ <span>Taskly</span>
        </div>

        <h1>Update Password</h1>
        <p className="auth-subtitle">Create a new password for your account.</p>

        <form onSubmit={handleUpdatePassword}>
          <label>New Password</label>
          <div className="auth-input">
            <Lock size={19} />
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <label>Confirm Password</label>
          <div className="auth-input">
            <Lock size={19} />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button className="auth-btn" disabled={loading}>
            {loading ? (
              <ClipLoader size={20} color="#fff" />
            ) : (
              <>
                <Save size={19} /> Update Password
              </>
            )}
          </button>
        </form>

        <p className="auth-bottom">
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default UpdatePassword;
