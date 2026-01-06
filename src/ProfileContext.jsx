import { createContext, useContext, useEffect, useState } from "react";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfileState] = useState("user");

  useEffect(() => {
    const stored = localStorage.getItem("profileMode");
    if (stored) setProfileState(stored);
  }, []);

  const setProfile = (mode) => {
    localStorage.setItem("profileMode", mode);
    setProfileState(mode);
  };

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);