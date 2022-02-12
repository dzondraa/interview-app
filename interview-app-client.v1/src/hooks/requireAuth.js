import useToken from "./useToken";
import { Navigate } from "react-router";
import config from "../config/config";

const RequireAuth = ({ children }) => {
  const INTERVIEWER_ROLE = "interviewer";
  const CANDIDATE_ROLE = "candidate";
  const targetRoute = window.location.pathname.split("/")[1];
  const tokenService = useToken();
  const user = tokenService.getLoggedInUser();

  const checkAuth = () => {
    const role = user.role;
    if (role == CANDIDATE_ROLE)
      return (
        config.routerProtection.candidate.filter(
          (route) => route == targetRoute
        ).length > 0
      );
    if (role == INTERVIEWER_ROLE)
      return (
        config.routerProtection.interviewer.filter(
          (route) => route == targetRoute
        ).length > 0
      );
  };
  console.log("ROUTE: " + targetRoute);
  return checkAuth() ? children : <Navigate to="/login" replace />;
};

export default RequireAuth;
