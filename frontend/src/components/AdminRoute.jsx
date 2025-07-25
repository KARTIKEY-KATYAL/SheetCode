import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Loader } from "lucide-react";
import Header from "./Header";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";

const AdminRoute = () => {
  const { authUser, isCheckingAuth } = useAuthStore();

  // Add more detailed logging for debugging
  console.log("AdminRoute check:", {
    authUser,
    role: authUser?.role,
    isAdmin: authUser?.role === "ADMIN",
    isCheckingAuth,
  });

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  if (!authUser || authUser.role !== "ADMIN") {
    console.log("Access denied: Not an admin user");
    return <Navigate to="/" replace />;
  }

  console.log("Admin access granted");
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="flex-grow w-full">
        <Outlet />
      </main>
    </div>
  );
};

// Ensure edit problem route loads the correct data

const EditProblemWrapper = ({ children }) => {
  const { id } = useParams();
  const { getProblemById } = useProblemStore();

  useEffect(() => {
    if (id) {
      // Route: GET /problems/get-problems/:id
      getProblemById(id).catch((error) => {
        console.error("Error loading problem for edit:", error);
      });
    }
  }, [id, getProblemById]);

  return children;
};

export default AdminRoute;
export { EditProblemWrapper };
