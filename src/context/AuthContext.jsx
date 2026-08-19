import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

const LS_USER_KEY = 'agrismart_user';
const LS_HARVEST_KEY = 'agrismart_harvest';
const LS_HARVEST_RECORDS = 'agrismart_harvest_records';
// sessionStorage sentinel — wiped automatically when the browser tab is closed.
// Prevents a stale localStorage session from faking authentication on a fresh visit.
const SS_SESSION_KEY = 'agrismart_session';

/**
 * A user object is valid only when it has non-empty `name` and `role` strings.
 * Anything else (null, partial, corrupt) is rejected.
 */
function isValidUser(u) {
    return (
        u !== null &&
        typeof u === 'object' &&
        typeof u.name === 'string' && u.name.trim() !== '' &&
        typeof u.role === 'string' && u.role.trim() !== ''
    );
}

/**
 * Return the persisted user ONLY when the sessionStorage sentinel is also present.
 *
 * sessionStorage lives only for the current tab/session. When the user closes the
 * tab or opens a fresh browser window, sessionStorage is wiped, so even if
 * localStorage still has `agrismart_user` from the last visit, we treat the user
 * as logged out until they explicitly log in again.
 */
function readUserFromStorage() {
    try {
        // No sentinel → fresh visit or tab closed → must log in again
        if (!sessionStorage.getItem(SS_SESSION_KEY)) {
            return null;
        }
        const raw = localStorage.getItem(LS_USER_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!isValidUser(parsed)) {
            localStorage.removeItem(LS_USER_KEY);
            return null;
        }
        return parsed;
    } catch {
        localStorage.removeItem(LS_USER_KEY);
        return null;
    }
}

export const AuthProvider = ({ children }) => {
    // Synchronous init — both localStorage and sessionStorage reads are sync
    const [user, setUser] = useState(() => readUserFromStorage());

    const [harvestInputs, setHarvestInputsState] = useState(() => {
        try { return JSON.parse(localStorage.getItem(LS_HARVEST_KEY)) || null; }
        catch { return null; }
    });

    // Keep localStorage in sync whenever user state changes
    useEffect(() => {
        if (user && isValidUser(user)) {
            localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(LS_USER_KEY);
        }
    }, [user]);

    const setHarvestInputs = (value) => {
        const next = typeof value === 'function' ? value(harvestInputs) : value;
        setHarvestInputsState(next);
        if (next) localStorage.setItem(LS_HARVEST_KEY, JSON.stringify(next));
        else localStorage.removeItem(LS_HARVEST_KEY);
    };

    // Sync harvest inputs to a collection of harvest records per farmer for Marketplace
    useEffect(() => {
        if (!user || !harvestInputs) return;
        try {
            const records = JSON.parse(localStorage.getItem(LS_HARVEST_RECORDS)) || [];
            const existingIdx = records.findIndex(r => r.farmerName === user.name && r.crop === harvestInputs.crop);
            const newRecord = {
                ...harvestInputs,
                farmerName: user.name,
                farmerId: user.id || crypto.randomUUID(),
                // Ensure each record has a stable id for Marketplace rendering
                id: user.id ? `${user.id}-${harvestInputs.crop}` : crypto.randomUUID()
            };
            if (existingIdx >= 0) {
                records[existingIdx] = newRecord;
            } else {
                records.push(newRecord);
            }
            localStorage.setItem(LS_HARVEST_RECORDS, JSON.stringify(records));
        } catch (e) {
            console.error('Failed to sync harvest records', e);
        }
    }, [harvestInputs, user]);

    const login = (role, name = 'Demo User', extraData = {}) => {
        const newUser = { name, role, registeredAt: new Date().toISOString(), ...extraData };
        // Mark this tab as actively authenticated
        sessionStorage.setItem(SS_SESSION_KEY, '1');
        setUser(newUser);
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
        // Clear sentinel so the next visit starts in logged-out state
        sessionStorage.removeItem(SS_SESSION_KEY);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, harvestInputs, setHarvestInputs }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
