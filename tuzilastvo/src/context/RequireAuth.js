import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useConfigContext } from '././ConfigContext';
import { Header } from '../components';
import { Account } from '../_root/pages';

const RequireAuth = () => {
    const { isAuthenticated, checkAuth } = useAuth();
    const { checkConfig } = useConfigContext();

    const location = useLocation();
    const [authStatus, setAuthStatus] = useState(null);
    const [configStatus, setConfigStatus] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const status = await checkAuth();
                setAuthStatus(status);
                if (status) {
                    const configStatus = await checkConfig();
                    if (!configStatus.configured) {
                        setConfigStatus(false);
                        // console.log("cccccCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC: " + false);
                    } else {
                        // console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAconfigStatusAAAAAA: " + configStatus);
                        // console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA: " + true);
                        setConfigStatus(true);
                        // console.log("cccccccccccc: " + configStatus.configured);
                    }

                }
            } catch (error) {
                console.error('Error while checking authentication:', error);
                setAuthStatus(false); // Set authentication status to false if there's an error
            }
        };

        fetchData();
    }, [authStatus, configStatus]);

    return (
        <>
            <div className="root-layout h-screen flex flex-col">
                <Header />
                <section className="flex-grow overflow-hidden">
                    {authStatus === true ? (
                        configStatus === true ? ( 
                        <Navigate to="/"  replace />
                    ) : (
                        <Outlet className="flex-grow" />
                            // <Account className="flex-grow" />
                            // <Navigate to="/" state={{ from: location }} replace />
                        )
                    ) : authStatus === false ? (
                        <Navigate to="/" state={{ from: location }} replace />
                    ) : null}
                </section>
            </div>
        </>
    );
};

export default RequireAuth;