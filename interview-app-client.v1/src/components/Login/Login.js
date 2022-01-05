import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import validator from "validator";

import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");

  const handleSubmit = () => {
    const errorsList = validateFormData();
    const errorsToDisplay = buildErrorList(errorsList);
    setErrors((e) => (e = errorsToDisplay));
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
    !validator.isStrongPassword(password) &&
      errors.push("Please enter a strong password");
    return errors;
  };

  useEffect(() => {
    // console.log(email);
  }, [email]);
  return (
    <div className="form-container">
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="text"
            placeholder="Enter email"
          />
          <Form.Text className="text-muted">
            {/* We'll never share your email with anyone else. */}
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            onChange={(e) => {
              setPassword((password) => (password = e.target.value));
            }}
            type="password"
            placeholder="Password"
          />
        </Form.Group>
        {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group> */}
        <Button onClick={handleSubmit} variant="primary">
          Submit
        </Button>
        {errors}
      </Form>
    </div>
  );
};

export default Login;
