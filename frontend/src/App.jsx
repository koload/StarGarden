import react, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Navigate, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Welcome from './pages/Welcome'
import NotFound from "./pages/NotFound"
import ProtectedRoute from './components/ProtectedRoute'


// as soon as user logs out the refresh and access tokens are removed and the user is directed to
// LOGIN view
function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="*" element={<NotFound />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App

