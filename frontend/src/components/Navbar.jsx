import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaPlaceOfWorship, FaUser, FaSignOutAlt, FaSignInAlt, FaCalendarCheck, FaUserCog } from 'react-icons/fa';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm py-3" style={{ backgroundColor: '#FF9933' }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center fw-bold fs-4" to="/">
          <FaPlaceOfWorship className="me-2 fs-3 text-white" />
          <span>DarshanEase</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active fw-medium" to="/">
                Temples
              </Link>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto align-items-center">
            {user ? (
              <>
                {/* Admin/Organizer Specific Links */}
                {(user.role === 'ADMIN' || user.role === 'ORGANIZER') && (
                  <li className="nav-item me-3">
                    <Link className="btn btn-gold text-white d-flex align-items-center py-2 px-3 btn-sm" to="/admin">
                      <FaUserCog className="me-2" /> Admin Panel
                    </Link>
                  </li>
                )}

                <li className="nav-item me-3">
                  <Link className="nav-link d-flex align-items-center text-white fw-medium" to="/bookings">
                    <FaCalendarCheck className="me-2" /> My Bookings
                  </Link>
                </li>

                <li className="nav-item me-3">
                  <Link className="nav-link d-flex align-items-center text-white fw-medium" to="/profile">
                    <FaUser className="me-2" /> {user.name}
                  </Link>
                </li>

                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-outline-light d-flex align-items-center px-3 py-2 btn-sm fw-medium border-2">
                    <FaSignOutAlt className="me-2" /> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item me-2">
                  <Link className="nav-link d-flex align-items-center text-white fw-medium" to="/login">
                    <FaSignInAlt className="me-2" /> Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-light d-flex align-items-center px-4 py-2 fw-semibold text-warning" to="/register" style={{ color: '#FF9933' }}>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
