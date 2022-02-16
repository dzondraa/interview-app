import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import Areas from "./pages/Areas/Areas";
import ReviewedCVs from "./pages/ReviewedCVs/ReviewedCVs";
import useToken from "./hooks/useToken";
import CandidatesPage from "./pages/Candidates/CandidatesPage";
import InterviewPage from "./pages/Interview/InterviewPage";
import LiveInterview from "./pages/LiveInterview/LiveInterview";
import RequireAuth from "./hooks/requireAuth";

function App(props) {
  const tokenService = useToken();
  const user = tokenService.getLoggedInUser();

  if (!tokenService.getToken()) {
    return <LoginPage setToken={tokenService.setToken} />;
  }

  return (
    <>
      <div className="container-fluid">
        <Router>
          <Routes>
            <Route
              exact
              path="/"
              element={
                <RequireAuth>
                  <InterviewPage />
                </RequireAuth>
              }
            />
            <Route
              path="/login"
              setToken={tokenService.setToken}
              element={<LoginPage />}
            />
            <Route
              path="/reviewed"
              element={
                <RequireAuth>
                  <ReviewedCVs />
                </RequireAuth>
              }
            />
            <Route
              path="/areas"
              element={
                <RequireAuth>
                  <Areas />
                </RequireAuth>
              }
            />
            <Route
              path="/candidates"
              element={
                <RequireAuth>
                  <CandidatesPage />
                </RequireAuth>
              }
            />
            <Route
              path="/interviews"
              element={
                <RequireAuth>
                  <InterviewPage />
                </RequireAuth>
              }
            />
            <Route
              path="/live"
              element={
                <RequireAuth>
                  <LiveInterview />
                </RequireAuth>
              }
            />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
