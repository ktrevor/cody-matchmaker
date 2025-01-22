import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MemberPage } from "./pages/MemberPage/MemberPage";
import { Navbar } from "./components/Navbar";
import { DonutPage } from "./pages/DonutPage/DonutPage";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/donuts" element={<DonutPage />} />
        <Route path="/members" element={<MemberPage />} />
      </Routes>
    </Router>
  );
};

export default App;
