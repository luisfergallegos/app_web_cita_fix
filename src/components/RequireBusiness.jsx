import { Navigate } from "react-router-dom";
import { useProfile } from "../ProfileContext";

const RequireBusiness = ({ children }) => {
  const { profile } = useProfile();

  if (profile !== "business") {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default RequireBusiness;