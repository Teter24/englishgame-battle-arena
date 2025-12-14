import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isGM = localStorage.getItem("gm_auth");

  if (!isGM) {
    return <Navigate to="/gm-login" replace />;
  }

  return children;
}
