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
import { DonutsProvider } from "./components/DonutsProvider";
import { JoinedProvider } from "./components/JoinedProvider";
import { ForestProvider } from "./components/ForestsProvider";
import { Layout, theme } from "antd";

const { Header, Content, Footer } = Layout;

const App = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Router>
      <DonutsProvider>
        <MembersProvider>
          <JoinedProvider>
            <ForestProvider>
              <DirtyProvider>
                <Layout>
                  <Header
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Navbar />
                  </Header>
                  <Content style={{ padding: "0 48px" }}>
                    <div style={{ margin: "16px 0" }} />
                    <div
                      style={{
                        background: colorBgContainer,
                        minHeight: 280,
                        padding: 24,
                        borderRadius: borderRadiusLG,
                      }}
                    >
                      <Routes>
                        <Route path="/" element={<Navigate to="/donuts" />} />
                        <Route path="/donuts" element={<DonutPage />} />
                        <Route path="/members" element={<MemberPage />} />
                        <Route
                          path="/groups/:donutId"
                          element={<GroupPage />}
                        />
                      </Routes>
                    </div>
                  </Content>
                  <Footer style={{ textAlign: "center" }}>
                    Matchacado ©{new Date().getFullYear()} Created by Kate
                    Trevor & Alicia Gullon
                  </Footer>
                </Layout>
              </DirtyProvider>
            </ForestProvider>
          </JoinedProvider>
        </MembersProvider>
      </DonutsProvider>
    </Router>
  );
};

export default App;
