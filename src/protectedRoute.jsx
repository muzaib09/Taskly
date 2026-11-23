import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import supabase from "./supabase";
import { ClipLoader } from "react-spinners";

const ProtectedRoute = ({ children, type = "protected" }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (mounted) {
        setUser(user);
        setLoading(false);
      }
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <ClipLoader size={35} color="#244b80" />;
  }

  if (type === "guest") {
    return user ? <Navigate to="/todo" replace /> : children;
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
