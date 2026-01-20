import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoanProvider } from "./contexts/LoanContext";
import LandingPage from "./pages/LandingPage"; // 1. Phải có dòng này
import LoanForm from "./pages/LoanForm";
import AdminDashboard from "./pages/AdminDashboard";

const App = () => {
  return (
    <LoanProvider>
      <Router>
        <Routes>
          {/* 2. Dòng này quyết định trang chủ là Landing Page */}
          <Route path="/" element={<LandingPage />} />

          <Route path="/apply" element={<LoanForm />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </LoanProvider>
  );
};

export default App;
