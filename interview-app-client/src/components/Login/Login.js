import { Form, Button } from "react-bootstrap";
import useLogin from "../../hooks/useLogin";
import GoogleLogin from "react-google-login";

import "./Login.css";

const Login = () => {
  const { errors, handleSubmit, setEmail, setPassword, handleGoogleLogin } = useLogin();

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
            className="form-control-user"
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
          <b>Log in</b>
        </Button>
        <GoogleLogin
          clientId={"872082864185-goq6342defqjv0u6ipt84g3ejll8gg4q.apps.googleusercontent.com"}
          buttonText="Log in with Google"
          onSuccess={handleGoogleLogin}
          onFailure={handleGoogleLogin}
          cookiePolicy={"single_host_origin"}
        />
      </Form>
      {errors}
    </div>
  );
};

export default Login;
