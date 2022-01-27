import { useState, useEffect } from "react";
import validator from "validator";
import { Alert } from "react-bootstrap";
import Api from "../services/Service";
import useToken from "../hooks/useToken";

export default function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const api = Api.getAuthServiceInstance();
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
    console.log(response);
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
    // !validator.isStrongPassword(password) && errors.push("Please enter a strong password");
    return errors;
  };

  const redirect = () => {
    window.location.href = "questions";
  };

  return {
    handleSubmit,
    errors,
    setEmail,
    setPassword,
  };
}
