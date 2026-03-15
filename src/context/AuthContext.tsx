import React, { createContext, useContext } from 'react';

interface AuthContextType {
  user: null;
  session: null;
  loading: false;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: false,
  signOut: async () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthContext.Provider value={{ user: null, session: null, loading: false, signOut: async () => {} }}>
      {children}
    </AuthContext.Provider>
  );
};
