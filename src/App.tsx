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
import { DirtyProvider } from "./components/DirtyProvider";
import { MembersProvider } from "./components/MembersProvider";

const App = () => {
  return (
    <Router>
      <MembersProvider>
        <DirtyProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/donuts" />} />
            <Route path="/donuts" element={<DonutPage />} />
            <Route path="/members" element={<MemberPage />} />
            <Route path="/groups/:donutId" element={<GroupPage />} />
          </Routes>
        </DirtyProvider>
      </MembersProvider>
    </Router>
  );
};

export default App;
