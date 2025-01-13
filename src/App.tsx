import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MemberPage } from "./pages/MemberPage/MemberPage";
import { Navbar } from "./components/Navbar";
import { GroupPage } from "./pages/GroupPage/GroupPage";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/groups" element={<GroupPage />} />
        <Route path="/members" element={<MemberPage />} />
      </Routes>
    </Router>
  );
};

export default App;
