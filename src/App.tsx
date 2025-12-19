import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppWrapper } from "./modules/app/components/AppWrapper";
import { Layout } from "./modules/app/components/Layout";
import { LoginPage } from "./features/authentification/ui/pages/LoginPage";
import { RegisterPage } from "./features/authentification/ui/pages/RegisterPage";
import { UserProfilePage } from "./features/user-profile/ui/pages/UserProfilePage";

function App() {
  return (
    <AppWrapper>
      <BrowserRouter>
        <Routes>
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

         
          <Route
            path="/profile"
            element={
              <Layout>
                <UserProfilePage />
              </Layout>
            }
          />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AppWrapper>
  );
}

export default App;
