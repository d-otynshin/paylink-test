import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import DevicesPage from './pages/DevicesPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import { ProtectedLayout } from './layouts/ProtectedLayout.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/devices" element={<DevicesPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
