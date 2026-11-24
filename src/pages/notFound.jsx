import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import "../styles/auth.css";
const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>
        Oops! The page you're looking for doesn't exist
        or may have been moved.
      </p>

      <Link to="/login" className="not-found-btn">
        <Home size={18} />
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;