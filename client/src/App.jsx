
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // 1. IMPORT THE NEW PAGE
import TicketsListPage from './pages/TicketsListPage';
import NewTicketPage from './pages/NewTicketPage';
import TicketDetailPage from './pages/TicketDetailPage';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} /> {/* 2. ADD THE NEW ROUTE */}
          <Route element={<ProtectedRoute />}>
            <Route path="/tickets" element={<TicketsListPage />} />
            <Route path="/tickets/new" element={<NewTicketPage />} />
            <Route path="/tickets/:id" element={<TicketDetailPage />} />
            <Route path="/" element={<TicketsListPage />} />
          </Route>
        </Routes>
      </main>
    </>
  );
}

export default App;