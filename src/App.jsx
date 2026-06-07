import React, { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsAuthenticated(Boolean(localStorage.getItem('bevvi_order_monitor_token')))
    setIsLoading(false)
  }, [])

  const handleLogin = (token) => {
    localStorage.setItem('bevvi_order_monitor_token', token)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('bevvi_order_monitor_token')
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bevvi-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-bevvi-600" />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
