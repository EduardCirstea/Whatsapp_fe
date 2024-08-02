import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
//Pages
import Home from "./pages/home";
import Register from "./pages/register";
import Login from "./pages/login";
//socket io
const socket = io(process.env.REACT_APP_API_ENDPOINT.split("/api/v1")[0]);

function App() {
  const { user } = useSelector((state) => ({ ...state }));
  const { token } = user;

  return (
    <div className="dark">
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={token ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            exact
            path="/login"
            element={!token ? <Login /> : <Navigate to="/" />}
          />
          <Route
            exact
            path="/register"
            element={!token ? <Register /> : <Navigate to="/" />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
