import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Signup from './auth/Signup'
import Login from './auth/Login'
import Activate from './auth/Activate'
import Private from './core/Private'
import ProtectedRoute from './auth/ProtectedRoute'
import AdminRoute from './auth/AdminRoute'
import Admin from './core/Admin'
import Forgot from './auth/Forgot'
import Reset from './auth/Reset'

const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
          <Route index element={<App />} />
          <Route path='signup' element={<Signup />} />
          <Route path='login' element={<Login />} />
          <Route path='auth/activate/:token' element={<Activate />} />
          <Route path='private' element={<ProtectedRoute> <Private /> </ProtectedRoute>} />
          <Route path='admin' element={<AdminRoute> <Admin /> </AdminRoute>} />
          <Route path='forgot-password' element={<Forgot />} />
          <Route path='auth/reset-password/:resetPasswordLink' element={<Reset />} />
      </Routes>
  </BrowserRouter>
  )
}

export default Routing
