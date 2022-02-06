import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import Questions from "./pages/Questions/Questions";
import Areas from "./pages/Areas/Areas";
import ReviewedCVs from "./pages/ReviewedCVs/ReviewedCVs";
import useToken from "./hooks/useToken";
import CandidatesPage from "./pages/Candidates/CandidatesPage";

function App(props) {
  const tokenService = useToken();

  if (!tokenService.getToken()) {
    return <LoginPage setToken={tokenService.setToken} />;
  }

  return (
    <>
      <div className="container-fluid">
        <Router>
          <Routes>
            <Route exact path="/" element={<Questions />} />
            <Route
              path="/login"
              setToken={tokenService.setToken}
              element={<LoginPage />}
            />
            <Route path="/questions" element={<Questions />} />
            <Route path="/reviewed" element={<ReviewedCVs />} />
            <Route path="/areas" element={<Areas />} />
            <Route path="/candidates" element={<CandidatesPage />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
