import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Residents from "./pages/Residents";

function App() {

  return (

    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route
    path="/dashboard"
    element={<Dashboard/>}
/>

    <Route
    path="/residents"
    element={<Residents/>}
/>
    </Routes>

  );

}


export default App;
