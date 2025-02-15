"use client"
import React from 'react'
import { useAuthStore } from '../store/authStore'
import axios from 'axios'
import UserProfile from '../components/UserProfile.jsx'
export default function Profile() {
  const { logout } = useAuthStore()
  
 
  return (
    <UserProfile/>
  )
}
