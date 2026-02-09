import { Navigate } from "react-router-dom";
import Login from "../components/Login.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Dashboard from "../pages/dashboard/Dashboard.jsx";
import Home from "../components/Home.jsx";
import AddProduct from "../pages/dashboard/inventory/product/AddProduct.jsx";

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
    element: <ProtectedRoute />,
    children: [
      {
        element: <Dashboard />,
        children: [
          { index: true, element: <Home /> },
          { path: "product/add", element: <AddProduct /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
];
