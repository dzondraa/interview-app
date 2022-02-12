import { useState } from "react";

export default function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem("token");
    return tokenString;
  };

  const getLoggedInUser = () => {
    const user = {
      user: JSON.parse(localStorage.getItem("user")),
      role: localStorage.getItem("role"),
    };
    return user;
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (userToken) => {
    localStorage.setItem("token", JSON.stringify(userToken));
    setToken(userToken);
  };

  return {
    setToken: saveToken,
    token,
    getToken,
    getLoggedInUser,
  };
}
