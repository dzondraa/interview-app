import useToken from "./useToken";
import { Navigate } from "react-router";

const RequireAuth = ({ children }) => {
  const tokenService = useToken();
  const user = tokenService.getLoggedInUser();
  return <Navigate to="/login" replace />;
//   return authed === true ? children : <Navigate to="/login" replace />;
};

export default RequireAuth;
