import { useState } from "react"
import { Navigate, redirect } from "react-router";

export default function ProtectedPage () {
    const rawUser = localStorage.getItem("user")
    if (!rawUser)
        return <Navigate to="/login" replace />

    const user = JSON.parse(rawUser)
    if (!user)
        return <Navigate to="/login" replace />

    return <div>
        This is an protected route. Hello, {user.email}
    </div>
}