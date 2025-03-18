"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import LoginForm from "./components/LoginForm";
import UserProfile from "./components/UserProfile";
import { redirect } from "next/navigation";
import { useAuthStore } from "./store/authStore";

export default function Home() {
  const { user, isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    const token = Cookies.get('logged_in')
    console.log(token)
    if (token) {
      checkAuth()
    }
  }, [checkAuth]);

  // If user is already authenticated, redirect to home
  if (isAuthenticated) {
    redirect('/home');
  }

  // Otherwise show login form
  return (
    <div className="min-h-screen bg-gray-100">
      <LoginForm user={user} />
    </div>
  );
}
