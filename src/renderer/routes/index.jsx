import { Navigate } from "react-router-dom";
import Login from "../components/Login.jsx";
import Home from "../components/Home.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

export const routes = [
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
];
