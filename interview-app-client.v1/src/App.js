import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Login from "./components/Login/Login";
import Questions from "./components/Questions/Questions";
import useToken from "./hooks/useToken";

function App(props) {
  const tokenService = useToken();

  if (!tokenService.getToken()) {
    console.log(tokenService.getToken());
    return <Login setToken={tokenService.setToken} />;
  }

  return (
    <>
      <div className="container-fluid">
        <Router>
          <Routes>
            <Route path="/welcome" element={<Login />} />
          </Routes>
        </Router>
        <Router>
          <Routes>
            <Route
              path="/login"
              setToken={tokenService.setToken}
              element={<Login />}
            />
            <Route
              path="/questions"
              element={<Questions />}
            />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
