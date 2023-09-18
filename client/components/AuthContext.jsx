// AuthContext.jsx or AuthProvider.jsx

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for user data in sessionStorage when the component mounts
    const storedUserId = sessionStorage.getItem('user_id');
    const storedUserName = sessionStorage.getItem('user_name');

    if (storedUserId && storedUserName) {
      // User data found in sessionStorage, set the user state
      setUser({
        id: storedUserId,
        username: storedUserName,
      });
    }
  }, []); // Empty dependency array ensures this runs only on component mount

  const login = (userData) => {
    // Set the user data when the user logs in
    setUser(userData);

    // Also store the user data in sessionStorage
    sessionStorage.setItem('user_id', userData.id);
    sessionStorage.setItem('user_name', userData.username);
  };

  const logout = () => {
    // Clear user data when the user logs out
    setUser(null);

    // Also clear sessionStorage
    sessionStorage.removeItem('user_id');
    sessionStorage.removeItem('user_name');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};