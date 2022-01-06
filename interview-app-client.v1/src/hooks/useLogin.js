import { useState } from "react";
import validator from "validator";
import { Alert } from "react-bootstrap";
import Api from "../services/Service";

export default function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const api = new Api();

  const handleSubmit = async () => {
    const errorsList = validateFormData();
    const errorsToDisplay = buildErrorList(errorsList);
    setErrors((e) => (e = errorsToDisplay));
    if (errorsList.length > 0) return;
    const response = await api.post("login", { email, password })
    console.log(response);
    const { error, token } = response
    if(error) setErrors(buildErrorList([error])) 
    if(token) alert("success")
  };

  const buildErrorList = (errorsList) => {
    const errs = errorsList.map((value, key) => {
      return <li key={key}>{value}</li>;
    });

    return errorsList.length ? (
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

  return {
    handleSubmit,
    errors,
    setEmail,
    setPassword,
  };
}
