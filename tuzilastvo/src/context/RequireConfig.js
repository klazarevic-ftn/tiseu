import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useConfigContext } from './ConfigContext';
import { Header } from '../components';

const RequireConfig = () => {
    const { checkConfig } = useConfigContext();
    const location = useLocation();
    const [configStatus, setConfigStatus] = useState(null);
    const [allowedRoutes, setAllowedRoutes] = useState([]);

    const ADMIN_ = ['/cases'];
    const CIVIL_ = ['/profile', '/cases'];
    const PROSECUTOR_ = ['/profile', '/cases'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { configured, userData } = await checkConfig(); 
                console.log(configured);
                console.log(userData.type);

                setConfigStatus(configured);

                const userRoutes = getUserRoutes(userData.type);
                const routes = userRoutes.map(route => route.toLowerCase());
                setAllowedRoutes(routes);

            } catch (error) {
                console.error('Error while checking configuration:', error);
                setConfigStatus(false); 
            }
        };

        fetchData();
    }, []);

    const getUserRoutes = (userType) => {
        switch (userType) {
            case 'ADMIN':
                return ADMIN_;
            case 'CIVIL':
                return CIVIL_;
            case 'PROSECUTOR':
                return PROSECUTOR_;
            default:
                return [];
        }
    };

    const isRouteAllowed = (route) => {
        return allowedRoutes.includes(route.toLowerCase());
    };

    return (
        <>
            <div className="root-layout h-screen flex flex-col">
                <Header />
                <section className="flex-grow overflow-hidden">
                    {configStatus === true ? (
                        allowedRoutes.length > 0 && isRouteAllowed(location.pathname) ? (
                            <Outlet className="flex-grow" />
                        ) : (
                            <Navigate to="/" state={{ from: location }} replace />
                        )
                    ) : configStatus === false ? (
                        <Navigate to="/" state={{ from: location }} replace />
                    ) : null}
                </section>
            </div>
        </>
    );
};

export default RequireConfig;
