import { Routes, Route } from "react-router-dom";

import "antd/dist/reset.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import "./assets/styles/adaptive.css";

import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/layout/PrivateRoute";
import Blank from "./pages/Blank";
import Playlists from "./pages/Playlists";
import Movies from "./pages/Movies";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<LoginPage />} />
        <Route exact path="/login" element={<LoginPage />} />
        <Route
          exact
          path="/dashboard"
          element={<PrivateRoute component={<Dashboard />} />}
        />
        <Route
          exact
          path="/playlists"
          element={<PrivateRoute component={<Playlists />} />}
        />
        <Route
          exact
          path="/movies"
          element={<PrivateRoute component={<Movies />} />}
        />
        <Route
          exact
          path="/categories"
          element={<PrivateRoute component={<Blank />} />}
        />
        <Route
          exact
          path="/products"
          element={<PrivateRoute component={<Blank />} />}
        />
        <Route
          exact
          path="/report-orders"
          element={<PrivateRoute component={<Blank />} />}
        />
        <Route
          exact
          path="/profile"
          element={<PrivateRoute component={<Blank />} />}
        />
        <Route
          exact
          path="/membership"
          element={<PrivateRoute component={<Blank />} />}
        />
      </Routes>
    </div>
  );
}

export default App;