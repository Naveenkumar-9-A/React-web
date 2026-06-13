import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Global Layout Components
import Navbar from './components/Navbar'; 
import Footer from './components/Footer';

// Page Components
import Home from './pages/Home';
import About from './pages/About'; 
import Blogs from './pages/Blogs'; 
import BlogDetail from './pages/BlogDetail';
import Contact from './pages/Contact'; 
import Safety from './pages/Safety';
import Terms from './pages/Terms';
import PrivacyPolicy from './pages/PrivacyPolicy';
import UserAgreement from './pages/UserAgreement';
import CardDetails from './pages/CardDetails';
import TravelYourWay from './pages/TravelYourWay';

export default function App() {
  return (
    <Router>
      {/* Dynamic Global Header */}
      <Navbar />

      {/* Main App Page Routing Blueprint */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} /> 
        <Route path="/blogs" element={<Blogs />} /> 
        <Route path="/blogs/:slug" element={<BlogDetail />} />
        <Route path="/contact" element={<Contact />} /> 
        <Route path="/safety" element={<Safety />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/user-agreement" element={<UserAgreement />} />
<Route path="/treks/:id" element={<CardDetails key={window.location.pathname} />} />   
<Route path="/treks/:id/details" element={<CardDetails />} />
     <Route path="/travel-your-way" element={<TravelYourWay />} />
      </Routes>

      {/* Dynamic Global Footer */}
      <Footer />
    </Router>
  );
}