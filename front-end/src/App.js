import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FirstOne from "./components/FirstOne";
import Second from "./components/Second";
import AddStone from "./components/AddStone";
import EditStone from "./components/EditStone";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FirstOne />} />
        <Route path="/second/:id" element={<Second />} />
        <Route path="/add-stone" element={<AddStone />} />
        <Route path="/edit-stone/:id" element={<EditStone />} />
      </Routes>
    </Router>
  );
}

export default App;
