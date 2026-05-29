/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RootLayout } from "./components/layout/RootLayout";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { LandingPage } from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { BuilderPage } from "./pages/BuilderPage";
import { TemplatesPage } from "./pages/TemplatesPage";
import { ResumePreviewPage } from "./pages/ResumePreviewPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { SettingsPage } from "./pages/SettingsPage";
import AuthPage from "./pages/AuthPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<RootLayout />}>
            <Route index element={<LandingPage />} />
          </Route>

          <Route path="/auth" element={<AuthPage />} />

          {/* Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/builder" element={<BuilderPage />} />
              <Route path="/builder/:id" element={<BuilderPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Standalone Preview Route */}
            <Route path="/preview/:id" element={<ResumePreviewPage />} />
          </Route>

          {/* 404 Catch all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
