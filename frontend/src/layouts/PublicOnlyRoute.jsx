import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";

const PublicOnly = ({ children }) => {
  const loggedIn = useAuthStore((state) => state.isLoggedIn)();

  return loggedIn ? <Navigate to="/user/dashboard/" />:<>{children}</> ;
};

export default PublicOnly;
