import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApartmentProvider } from './context/ApartmentContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ApartmentListPage from './pages/ApartmentListPage';
import ApartmentDetailPage from './pages/ApartmentDetailPage';
import ApartmentAdminPage from './pages/admin/ApartmentAdminPage';
import ApartmentEditPage from './pages/admin/ApartmentEditPage';
import './App.css';

function App() {
  return (
    <Router>
      <ApartmentProvider>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<ApartmentListPage />} />
              <Route path="/apartment/:id" element={<ApartmentDetailPage />} />
              
              {/* Admin routes */}
              <Route path="/admin/apartments" element={<ApartmentAdminPage />} />
              <Route path="/admin/apartments/new" element={<ApartmentEditPage />} />
              <Route path="/admin/apartments/:id" element={<ApartmentEditPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ApartmentProvider>
    </Router>
  );
}

export default App;
