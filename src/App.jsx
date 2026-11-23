import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import Login from "./pages/login";
import Signup from "./pages/signup";
import ForgotPassword from "./pages/forgotPassword";
import UpdatePassword from "./pages/updatePassword";
import Todo from "./pages/todo";
import ProtectedRoute from "./protectedRoute";
import "./styles/alerts.css";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        theme="light"
        closeButton
        duration={3000}
        toastOptions={{
          className: "taskly-sonner-toast",
          style: {
            fontFamily: "Inter, sans-serif",
            background: "#ffffff",
            color: "#172b4d",
            border: "1px solid #e8edf4",
            borderRadius: "14px",
            boxShadow: "0 12px 40px rgba(23, 43, 77, 0.12)",
          },
        }}
      />

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route
          path="/login"
          element={
            <ProtectedRoute type="guest">
              <Login />
            </ProtectedRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <ProtectedRoute type="guest">
              <Signup />
            </ProtectedRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute type="guest">
              <ForgotPassword />
            </ProtectedRoute>
          }
        />

        <Route path="/update-password" element={<UpdatePassword />} />

        <Route
          path="/todo"
          element={
            <ProtectedRoute>
              <Todo />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
