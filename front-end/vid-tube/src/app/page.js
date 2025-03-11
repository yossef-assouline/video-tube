"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import LoginForm from "./components/LoginForm";
import UserProfile from "./components/UserProfile";
import { redirect } from "next/navigation";
import { useAuthStore } from "./store/authStore";

export default function Home() {
  const { user , isAuthenticated , checkAuth } = useAuthStore();
  useEffect(() => {
    
    checkAuth()
  }, [checkAuth])


  return (
    <div className="min-h-screen bg-gray-100">

        {!isAuthenticated ? (
        <LoginForm user={user} />
      ) : (
        redirect('/home')
      )}
    </div>
  );
}
