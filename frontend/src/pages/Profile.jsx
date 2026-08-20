import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaUserEdit, FaLock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

function Profile() {
  const { user, updateProfile } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize fields with current user state
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhoneNumber(user.phoneNumber || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    // Client-side validations
    if (password && password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const updatedData = {
        name,
        email,
        phoneNumber,
      };

      if (password) {
        updatedData.password = password;
      }

      await updateProfile(updatedData);
      setSuccess('Profile updated successfully!');
      
      // Clear password inputs
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update profile info');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5 py-3">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow rounded-4 border-0 bg-white">
            <div className="card-body p-5">
              
              <div className="text-center mb-5">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle p-3 mb-3"
                  style={{ backgroundColor: '#FFF8E7', width: '70px', height: '70px' }}
                >
                  <FaUserEdit className="fs-3" style={{ color: '#FF9933' }} />
                </div>
                <h3 className="fw-bold text-dark">Profile Settings</h3>
                <p className="text-muted">Manage your contact details and account passwords</p>
              </div>

              {success && (
                <div className="alert alert-success d-flex align-items-center rounded-3 border-0 py-3 mb-4 shadow-sm" role="alert">
                  <FaCheckCircle className="fs-4 me-3 text-success" />
                  <div>{success}</div>
                </div>
              )}

              {error && (
                <div className="alert alert-danger d-flex align-items-center rounded-3 border-0 py-3 mb-4 shadow-sm" role="alert">
                  <FaExclamationCircle className="fs-4 me-3 text-danger" />
                  <div>{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  {/* Left Column: Basic Information */}
                  <div className="col-md-6">
                    <h5 className="fw-bold text-dark mb-3 border-bottom pb-2">Basic Info</h5>

                    <div className="mb-3">
                      <label className="form-label small fw-medium text-muted">Full Name</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-medium text-muted">Email Address</label>
                      <input
                        type="email"
                        className="form-control rounded-3"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-medium text-muted">Phone Number</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-medium text-muted">Account Access Role</label>
                      <input
                        type="text"
                        className="form-control rounded-3 bg-light text-muted"
                        value={user?.role || 'USER'}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>

                  {/* Right Column: Security (Password Reset) */}
                  <div className="col-md-6">
                    <h5 className="fw-bold text-dark mb-3 border-bottom pb-2 d-flex align-items-center">
                      <FaLock className="me-2 text-muted" /> Security & Passwords
                    </h5>

                    <div className="mb-3">
                      <label className="form-label small fw-medium text-muted">New Password</label>
                      <input
                        type="password"
                        className="form-control rounded-3"
                        placeholder="Leave blank to keep current"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-medium text-muted">Confirm New Password</label>
                      <input
                        type="password"
                        className="form-control rounded-3"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 border-top pt-4 text-end">
                  <button
                    type="submit"
                    className="btn btn-saffron btn-lg px-5 shadow-sm rounded-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
