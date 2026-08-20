import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaSignInAlt } from 'react-icons/fa';

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/'); // Redirect to Home
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5 py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow rounded-4 border-0">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle p-3 mb-3"
                  style={{ backgroundColor: '#FFF8E7', width: '70px', height: '70px' }}
                >
                  <FaSignInAlt className="fs-3" style={{ color: '#FF9933' }} />
                </div>
                <h3 className="fw-bold text-dark">Welcome Back</h3>
                <p className="text-muted">Sign in to book your sacred darshan slot</p>
              </div>

              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-medium small text-muted">Email Address</label>
                  <input
                    type="email"
                    className="form-control form-control-lg rounded-3"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-medium small text-muted">Password</label>
                  <input
                    type="password"
                    className="form-control form-control-lg rounded-3"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-saffron btn-lg w-100 py-3 mb-3 shadow-sm"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  ) : (
                    'Login'
                  )}
                </button>

                <div className="text-center mt-3">
                  <span className="text-muted small">New to DarshanEase? </span>
                  <Link to="/register" className="fw-semibold text-decoration-none small" style={{ color: '#FF9933' }}>
                    Register Here
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

export default Login;
