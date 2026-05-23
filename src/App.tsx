import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ParticleBackground } from "./components/ParticleBackground";
import { Layout } from "./components/Layout";
import { AuthPage } from "./pages/AuthPage";
import { DashboardPage } from "./pages/DashboardPage";
import { GroupsPage } from "./pages/GroupsPage";
import { LiveChatPage } from "./pages/LiveChatPage";
import { UsersPage } from "./pages/UsersPage";
import { AutomationPage } from "./pages/AutomationPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { LoadingScreen } from "./components/LoadingScreen";

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Layout />;
}

function PublicRoute() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return (
    <>
      <ParticleBackground />
      <Outlet />
    </>
  );
}

function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <ParticleBackground />
      <div className="relative z-10 text-center">
        <h1 className="text-8xl font-bold gradient-text neon-text-purple">404</h1>
        <p className="text-zinc-400 mt-4">Signal lost in the void</p>
        <a href="/dashboard" className="inline-block mt-6 text-purple-300 hover:text-white">
          ← Return to dashboard
        </a>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/live-chat" element={<LiveChatPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/automation" element={<AutomationPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
