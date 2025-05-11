import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Fix imports to use consistent folder structure
import HomePage from "./page/HomePage";
import LoginPage from "./page/LoginPage";
import SignUpPage from "./page/SignUpPage";
import Problems from "./page/Problems"; // Make sure this exists in the page folder
import Sheets from "./page/Sheets"; // Make sure this exists in the page folder
import Profile from "./page/Profile"; // Make sure this exists in the page folder
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import Layout from "./layout/Layout";
import AdminRoute from "./components/AdminRoute";
import AddProblem from "./page/AddProblem";
import CreateProblemForm from "./components/CreateProblemForm"; // Ensure this import exists

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start">
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={<HomePage />}
          />
          <Route
            path="/problems"
            element={authUser ? <Problems /> : <Navigate to="/login" />}
          />
          <Route
            path="/sheets"
            element={authUser ? <Sheets /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={authUser ? <Profile /> : <Navigate to="/login" />}
          />
        </Route>

        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />

        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />

        <Route
          path="/add-problem"
          element={
            <AdminRoute>
              <CreateProblemForm />
            </AdminRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
