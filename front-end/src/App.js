import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FirstOne from "./components/FirstOne";
import Second from "./components/Second";
import AddStone from "./components/addStone";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FirstOne />} />
        <Route path="/second/:id" element={<Second />} />
        <Route path="/addStone" element={<AddStone />} />
      </Routes>
    </Router>
  );
}

export default App;
