import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

const LS_USER_KEY = 'agrismart_user';
const LS_HARVEST_KEY = 'agrismart_harvest';

export const AuthProvider = ({ children }) => {
    // Initialise from localStorage so data survives refresh
    const [user, setUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem(LS_USER_KEY)) || null; }
        catch { return null; }
    });
    const [harvestInputs, setHarvestInputsState] = useState(() => {
        try { return JSON.parse(localStorage.getItem(LS_HARVEST_KEY)) || null; }
        catch { return null; }
    });

    // Keep localStorage in sync whenever state changes
    useEffect(() => {
        if (user) localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
        else localStorage.removeItem(LS_USER_KEY);
    }, [user]);

    const setHarvestInputs = (value) => {
        const next = typeof value === 'function' ? value(harvestInputs) : value;
        setHarvestInputsState(next);
        if (next) localStorage.setItem(LS_HARVEST_KEY, JSON.stringify(next));
        else localStorage.removeItem(LS_HARVEST_KEY);
    };

    const login = (role, name = 'Demo User', extraData = {}) => {
        setUser({ name, role, registeredAt: new Date().toISOString(), ...extraData });
    };

    /** Update profile fields without logging out */
    const updateUser = (fields) => {
        setUser(prev => ({ ...prev, ...fields }));
    };

    const logout = () => {
        setUser(null);
        setHarvestInputsState(null);
        localStorage.removeItem(LS_USER_KEY);
        localStorage.removeItem(LS_HARVEST_KEY);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, harvestInputs, setHarvestInputs }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
