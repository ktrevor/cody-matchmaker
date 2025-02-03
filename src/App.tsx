import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { MemberPage } from "./pages/MemberPage/MemberPage";
import { Navbar } from "./components/Navbar";
import { DonutPage } from "./pages/DonutPage/DonutPage";
import { GroupPage } from "./pages/GroupPage/GroupPage";
import { DirtyProvider } from "./components/DirtyContext";
import { DonutProvider } from "./components/DonutContext";

const App = () => {
  return (
    <Router>
      <DirtyProvider>
        <DonutProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/donuts" />} />
            <Route path="/donuts" element={<DonutPage />} />
            <Route path="/members" element={<MemberPage />} />
            <Route path="/groups" element={<GroupPage />} />
          </Routes>
        </DonutProvider>
      </DirtyProvider>
    </Router>
  );
};

export default App;
