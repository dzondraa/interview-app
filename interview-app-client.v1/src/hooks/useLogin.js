import { useState, useEffect } from "react";
import validator from "validator";
import { Alert } from "react-bootstrap";
import ApiFactory from "../services/Service";
import useToken from "../hooks/useToken";

export default function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const api = ApiFactory.getAuthServiceInstance();
  const { token, setToken } = useToken();

  useEffect(() => {
    if(token) redirect()
    
  });

  const handleSubmit = async () => {
    const errorsList = validateFormData();
    const errorsToDisplay = buildErrorList(errorsList);
    setErrors((e) => (e = errorsToDisplay));
    if (errorsList.length > 0) return;
    await handleLogin();
  };

  const handleLogin = async () => {
    const response = await api.post("login", { email, password });
    const { error, token } = response;
    if (error) setErrors(buildErrorList([error]));
    if (token) {
      setToken(token);
      // TODO -> avoid full reaload
      redirect();
    }
  };

  // should be in Login.js
  const buildErrorList = (errorsList) => {
    const errs = errorsList.map((value, key) => {
      return <li key={key}>{value}</li>;
    });

    return errorsList.length ? (
      // should not be here (no UI elements)
      <Alert id="errors" variant="danger">
        {errs}
      </Alert>
    ) : null;
  };

  // returns errors array
  const validateFormData = () => {
    var errors = [];
    !validator.isEmail(email) && errors.push("Not a valid email");
    !validator.isStrongPassword(password) && errors.push("Please enter a strong password");
    return errors;
  };

  const handleGoogleLogin = (payload) => {
    if(payload.tokenId) setToken(payload.tokenId)
    else alert("Something went wrong with Google auth!")
  } 

  const redirect = () => {
    window.location.href = "interviews";
  };

  return {
    handleSubmit,
    errors,
    setEmail,
    setPassword,
    handleGoogleLogin
  };
}
