import React, { createContext, useContext, useState, ReactNode } from "react";

interface UserInfo {
  nickname: string;
  email: string;
}

interface UserContextType {
  userInfo: UserInfo;
  setUserInfo: (info: UserInfo) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({ nickname: "나연", email: "nayeon@example.com" });
  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};
