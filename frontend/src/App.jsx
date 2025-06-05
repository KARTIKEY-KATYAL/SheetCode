import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Sheets from "./page/Sheets";
import HomePage from "./page/HomePage";
import LoginPage from "./page/LoginPage";
import SignUpPage from "./page/SignUpPage";
import Problems from "./page/Problems";
import Profile from "./page/Profile";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import Layout from "./layout/Layout";
import AdminRoute from "./components/AdminRoute";
import AddProblem from "./page/AddProblem";
import ProblemPage from "./page/ProblemPage";
import CreateProblemForm from "./components/CreateProblemForm";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    console.log("Checking authentication...");
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    console.log("Auth state changed:", {
      authUser,
      isAuthenticated: !!authUser,
      isAdmin: authUser?.role === "ADMIN",
    });
  }, [authUser]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <Loader className="size-10 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
      <Routes>
        {/* Public and User Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />

          {/* Protected User Routes */}
          <Route
            path="/problems"
            element={authUser ? <Problems /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/problem/:id"
            element={authUser ? <ProblemPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/sheets"
            element={authUser ? <Sheets /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/profile"
            element={authUser ? <Profile /> : <Navigate to="/login" replace />}
          />
        </Route>

        {/* Auth Routes */}
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" replace />}
        />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route path="add-problem" element={<CreateProblemForm />} />
          <Route path="edit-problem/:id" element={<CreateProblemForm />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
