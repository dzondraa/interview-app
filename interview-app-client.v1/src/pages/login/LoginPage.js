import "./Login.css";

import Login from "../../components/Login/Login";
import backgroundImage from "../../assets/images/interview.png" 

const LoginPage = () => {
  console.log(backgroundImage);
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-xl-10 col-lg-12 col-md-9">
          <div className="login-container-fox card o-hidden border-0 shadow-lg my-5">
            <div className="card-body p-0">
              <div className="row">
                <div className="col-lg-6 d-none d-lg-block bg-img" style={{
                  backgroundImage: `url('${backgroundImage}')`
                }}></div>
                <div className="col-lg-6 form-boiler">
                  <div className="p-5">
                    <div className="text-center">
                      <h1 className="h4 text-gray-900 mb-4">Welcome Back!</h1>
                    </div>

                    <Login />

                    <hr></hr>
                    <div className="text-center">
                      <a className="small" href="forgot-password.html">
                        Forgot Password?
                      </a>
                    </div>
                    <div className="text-center">
                      <a className="small" href="register.html">
                        Create an Account!
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
