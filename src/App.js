import React from 'react';
import './index.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext'; // именованные импорты
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PetsPage from './pages/PetsPage';
import PetRecordsPage from './pages/PetRecordsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import VetDashboardPage from './pages/VetDashboardPage';
import ChatContactsPage from './pages/ChatContactsPage';
import ChatPage from './pages/ChatPage';
import VaccinationPage from './pages/VaccinationPage';
import CreateCampaignPage from './pages/CreateCampaignPage';
import ArticlesPage from './pages/ArticlesPage';
import CreateArticlePage from './pages/CreateArticlePage';
import PharmacyPage from './pages/PharmacyPage';

function PrivateRoute({ children }) {
  const { token } = React.useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>

            }
          />
          <Route
            path="/pets"
            element={
              <PrivateRoute>
                <PetsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/pets/:id/records"
            element={
              <PrivateRoute>
                <PetRecordsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <PrivateRoute>
                <AppointmentsPage />
              </PrivateRoute>
            }
          />
          <Route path="/chat/:userId" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/vaccinations"
            element={
              <PrivateRoute>
                <VaccinationPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/vaccination"
            element={
              <PrivateRoute>
                <CreateCampaignPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/articles"
            element={
              <PrivateRoute>
                <ArticlesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/pharmacy"
            element={
              <PrivateRoute>
                <PharmacyPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/articles/create"
            element={<PrivateRoute><CreateArticlePage /></PrivateRoute>}
          />
          <Route path="/vet" element={<VetDashboardPage />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
