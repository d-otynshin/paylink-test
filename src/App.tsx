import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { JSX } from 'react';
import { useAuth } from './hooks/useAuth.ts';
import DevicesPage from './pages/DevicesPage.tsx';
import LoginPage from './pages/LoginPage.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/devices" element={<ProtectedRoute><DevicesPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

function ProtectedRoute({ children }: { children: JSX.Element }) {
  // const { isAuthenticated } = useAuth();
  const isAuthenticated = true;
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default App
