import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import Questions from "./pages/Questions/Questions";
import ReviewedCVs from "./pages/ReviewedCVs/ReviewedCVs";
import useToken from "./hooks/useToken";

function App(props) {
  const tokenService = useToken();

  if (!tokenService.getToken()) {
    console.log(tokenService.getToken());
    return <LoginPage setToken={tokenService.setToken} />;
  }

  return (
    <>
      <div className="container-fluid">
        <Router>
          <Routes>
            <Route path="/welcome" element={<LoginPage />} />
          </Routes>
        </Router>
        <Router>
          <Routes>
            <Route
              path="/login"
              setToken={tokenService.setToken}
              element={<LoginPage />}
            />
            <Route
              path="/questions"
              element={<Questions />}
            />
            <Route
              path="/reviewed"
              element={<ReviewedCVs />}
            />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
