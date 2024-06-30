import React, { createContext, useContext, ReactNode } from "react";

interface UserContextProps {
  email: string | null;
  userId: string | null;
  userRole: string | null;
  setUserDataContext: (email: string, userId: string, userRole: string) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [email, setEmail] = React.useState<string | null>(null);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [userRole, setUserRole] = React.useState<string | null>(null);

  const setUserDataContext = (newEmail: string, newUserId: string, newUserRole: string) => {
    setEmail(newEmail);
    setUserId(newUserId);
    setUserRole(newUserRole);
  };

  const userContextValue: UserContextProps = {
    email,
    userId,
    userRole,
    setUserDataContext,
  };

  return <UserContext.Provider value={userContextValue}>{children}</UserContext.Provider>;
};
