import Home from "./pages/Home";
import Gif from "./pages/Gif";
import Sticker from "./pages/Sticker";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gif/:id" element={<Gif />} />
        <Route path="/sticker/:id" element={<Sticker />} />
      </Routes>
    </div>
  );
}

export default App;
