import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Update full user and store in localStorage
    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    // ✅ Update only the avatar
    const updateUserAvatar = (newAvatar) => {
        setUser((prevUser) => {
            const updatedUser = { ...prevUser, profileImageUrl: newAvatar };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            return updatedUser;
        });
    };

    // Clear user and remove from localStorage
    const clearUser = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <UserContext.Provider 
            value={{ user, updateUser, updateUserAvatar, clearUser, loading }}
        >
            {!loading && children}
        </UserContext.Provider>
    );
}

export default UserProvider;
