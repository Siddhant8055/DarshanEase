import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaUserPlus } from 'react-icons/fa';

function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('USER'); // Defaults to USER, but can select ADMIN for local testing
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      await register(name, email, password, phoneNumber, role);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5 py-3">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <div className="card shadow rounded-4 border-0">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle p-3 mb-3"
                  style={{ backgroundColor: '#FFF8E7', width: '70px', height: '70px' }}
                >
                  <FaUserPlus className="fs-3" style={{ color: '#FF9933' }} />
                </div>
                <h3 className="fw-bold text-dark">Create Account</h3>
                <p className="text-muted">Register to search and book darshan slots across holy temples</p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-medium small text-muted">Full Name</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-medium small text-muted">Email Address</label>
                    <input
                      type="email"
                      className="form-control rounded-3"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-medium small text-muted">Phone Number</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      placeholder="Enter phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-medium small text-muted">Password</label>
                    <input
                      type="password"
                      className="form-control rounded-3"
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-medium small text-muted">Account Role</label>
                  <select
                    className="form-select rounded-3"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="USER">User (Devotee)</option>
                    <option value="ADMIN">Admin (Temple Manager)</option>
                    <option value="ORGANIZER">Organizer (Temple Associate)</option>
                  </select>
                  <div className="form-text text-muted small">
                    For learning and testing purposes, you can register directly as an Administrator or Organizer.
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-saffron btn-lg w-100 py-3 mb-3 shadow-sm"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  ) : (
                    'Register'
                  )}
                </button>

                <div className="text-center mt-2">
                  <span className="text-muted small">Already have an account? </span>
                  <Link to="/login" className="fw-semibold text-decoration-none small" style={{ color: '#FF9933' }}>
                    Login Here
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
