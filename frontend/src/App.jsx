import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import HomePage from "./page/HomePage";
import LoginPage from "./page/LoginPage";
import SignUpPage from "./page/SignUpPage";
import Problems from "./page/Problems";
import Sheets from "./page/Sheets";
import Profile from "./page/Profile";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import Layout from "./layout/Layout";
import AdminRoute from "./components/AdminRoute";
import AddProblem from "./page/AddProblem";
import UpdateProblem from "./page/UpdateProblem";
import ProblemPage from "./page/ProblemPage";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    // Log before checking auth
    console.log("Checking authentication...");
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Log auth state changes
    console.log("Auth state changed:", { authUser, isAdmin: authUser?.role === "ADMIN" });
  }, [authUser]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <Toaster position="top-center" />
      <Routes>
        {/* Public and User Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          
          {/* Protected User Routes */}
          <Route path="/problems" element={
            authUser ? <Problems /> : <Navigate to="/login" />
          } />
          <Route
          path="/problem/:id"
          element={authUser ? <ProblemPage /> : <Navigate to={"/login"} />}
        />
          <Route path="/sheets" element={
            authUser ? <Sheets /> : <Navigate to="/login" />
          } />
          <Route path="/profile" element={
            authUser ? <Profile /> : <Navigate to="/login" />
          } />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={
          !authUser ? <LoginPage /> : <Navigate to="/" />
        } />
        <Route path="/signup" element={
          !authUser ? <SignUpPage /> : <Navigate to="/" />
        } />
       

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route path="add-problem" element={<AddProblem />} />
          {/* <Route path="/update-problem/:id" element={<UpdateProblem />} /> */}
        </Route>
      </Routes>
    </div>
  );
};

export default App;
