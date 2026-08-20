import React from 'react';
import { FaPlaceOfWorship } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer mt-auto py-4 text-center text-white" style={{ backgroundColor: '#2C3E50' }}>
      <div className="container">
        <div className="d-flex justify-content-center align-items-center mb-3">
          <FaPlaceOfWorship className="me-2 fs-4" style={{ color: '#FF9933' }} />
          <span className="fw-bold fs-5">DarshanEase</span>
        </div>
        <p className="mb-1 text-light-50 small">
          An intuitive, beginner-friendly online portal for effortless Temple Darshan Bookings.
        </p>
        <p className="mb-0 text-muted small">
          &copy; {new Date().getFullYear()} DarshanEase. All rights reserved. Built with devotion.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
