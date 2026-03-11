import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { isAuthenticated } from '../lib/auth'

export default function ProtectedRoute() {
  const [checking, setChecking] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    isAuthenticated().then((result) => {
      setAuthenticated(result)
      setChecking(false)
    })
  }, [])

  if (checking) return null

  return authenticated ? <Outlet /> : <Navigate to="/login" replace />
}
