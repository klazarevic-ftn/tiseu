import React from 'react'
import { Header } from '../components'
import { Outlet, useLocation, Navigate, useLoaderData } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Account from './pages/Account'

const AuthLayout = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    // console.log("isAuthenticatedaaA:", isAuthenticated); // Log the isAuthenticated value

    return (
        <div className="root-layout h-screen flex flex-col">
            <Header />
            <section className="flex-grow overflow-hidden">
                <Outlet className="flex-grow" />
            </section>
        </div>
  )
}

export default AuthLayout
