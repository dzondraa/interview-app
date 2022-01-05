import { Form, Button, Alert } from "react-bootstrap";
import useLogin from "../../hooks/useLogin";

import "./Login.css";

const Login = () => {
  var { errors, handleSubmit, setEmail, setPassword } = useLogin();

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
              setPassword((p) => (p = e.target.value));
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
