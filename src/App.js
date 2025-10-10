import Home from "./pages/Home";
import Gif from "./pages/Gif";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gif/:id" element={<Gif />} />
      </Routes>
    </div>
  );
}

export default App;
