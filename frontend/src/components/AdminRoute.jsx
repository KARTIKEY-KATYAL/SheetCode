import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Loader } from "lucide-react";

const AdminRoute = () => {
    const { authUser, isCheckingAuth } = useAuthStore();

    // Add more detailed logging for debugging
    console.log("AdminRoute check:", {
        authUser,
        role: authUser?.role,
        isAdmin: authUser?.role === "ADMIN",
        isCheckingAuth
    });

    if (isCheckingAuth) {
        return <div className="flex items-center justify-center h-screen"><Loader className="size-10 animate-spin" /></div>;
    }
  
    if (!authUser || authUser.role !== "ADMIN") {
        console.log("Access denied: Not an admin user");
        return <Navigate to="/" replace />;
    }

    console.log("Admin access granted");
    return <Outlet />;
}

export default AdminRoute;