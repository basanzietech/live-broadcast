import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Broadcaster from './Broadcaster';
import Viewer from './Viewer';

function NavLinks() {
  const location = useLocation();
  return (
    <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
      {(location.pathname !== '/view') && (
        <Link to="/broadcast" style={{ textDecoration: 'none', color: '#fff', background: '#43a047', padding: '8px 16px', borderRadius: 4 }}>Broadcaster</Link>
      )}
      <Link to="/view" style={{ textDecoration: 'none', color: '#fff', background: '#1976d2', padding: '8px 16px', borderRadius: 4 }}>Viewer</Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div style={{ maxWidth: 500, margin: '40px auto', padding: 20, border: '1px solid #ddd', borderRadius: 8, background: '#fafafa', position: 'relative' }}>
        <h2>Live Broadcast System</h2>
        <NavLinks />
        <Routes>
          <Route path="/broadcast" element={<Broadcaster />} />
          <Route path="/view" element={<Viewer />} />
          <Route path="*" element={<div>Chagua mode: Broadcaster au Viewer</div>} />
        </Routes>
      </div>
      <a href="https://wa.me/255657779003" className="whatsapp-float" target="_blank" rel="noopener noreferrer">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M16.7 14.6c-.3-.2-1.7-.8-2-1-.3-.1-.5-.2-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.2-.4-2.2-1.3-.8-.7-1.3-1.6-1.5-1.9-.2-.3 0-.4.1-.6.1-.1.2-.3.3-.4.1-.1.1-.2.2-.4.1-.1.1-.3 0-.5-.1-.2-.7-1.7-.9-2.3-.2-.6-.4-.5-.7-.5h-.6c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.1 0 1.2.9 2.3 1 2.5.1.2 1.7 2.7 4.2 3.6.6.2 1.1.3 1.5.3.6 0 1.1-.2 1.5-.5.4-.3 1-1.1 1.1-1.5.1-.4.1-.6 0-.7z"/><circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2" fill="#25d366"/></svg>
        WhatsApp
      </a>
    </Router>
  );
}

export default App;
