import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import { FaCalendarCheck, FaPlaceOfWorship, FaMapMarkerAlt, FaClock, FaUsers, FaUser, FaTimesCircle, FaCheckCircle, FaExclamationCircle, FaDonate, FaCoins, FaReceipt } from 'react-icons/fa';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  // Tab State: 'bookings' or 'donations'
  const [activeTab, setActiveTab] = useState('bookings');
  const [donations, setDonations] = useState([]);
  const [donationsLoading, setDonationsLoading] = useState(false);
  const [donationsError, setDonationsError] = useState('');

  const location = useLocation();

  // Fetch bookings list
  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/api/bookings/my-bookings');
      setBookings(data.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error loading booking records');
    } finally {
      setLoading(false);
    }
  };

  // Fetch donations list
  const fetchDonations = async () => {
    setDonationsLoading(true);
    setDonationsError('');
    try {
      const { data } = await api.get('/api/donations/my-donations');
      setDonations(data.data);
    } catch (err) {
      console.error(err);
      setDonationsError(err.response?.data?.message || 'Error loading donation records');
    } finally {
      setDonationsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();

    // Check if redirect query param exists (?success=true)
    const params = new URLSearchParams(location.search);
    if (params.get('success') === 'true') {
      setShowSuccessBanner(true);
      // Auto-hide banner after 5 seconds
      setTimeout(() => setShowSuccessBanner(false), 5000);
    }
  }, [location.search]);

  useEffect(() => {
    if (activeTab === 'donations') {
      fetchDonations();
    } else {
      fetchBookings();
    }
  }, [activeTab]);

  // Cancel booking handler
  const handleCancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm(
      'Are you sure you want to cancel this darshan booking? This will immediately release the slot spots.'
    );

    if (!confirmCancel) return;

    try {
      await api.put(`/api/bookings/${bookingId}/cancel`);
      
      // Update local state without full reload for instant UI response
      setBookings((prevBookings) =>
        prevBookings.map((b) =>
          b._id === bookingId ? { ...b, status: 'CANCELLED' } : b
        )
      );
      
      alert('Booking cancelled successfully.');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Cancellation failed. Please try again.');
    }
  };

  return (
    <div className="container my-5 pb-5">
      <h2 className="fw-bold text-dark mb-4 d-flex align-items-center">
        <FaCalendarCheck className="me-3 text-warning" /> My Spiritual Ledger
      </h2>

      {/* Navigation Tabs */}
      <div className="d-flex border-bottom border-light mb-4 gap-3">
        <button
          className={`btn pb-3 px-2 rounded-0 border-0 fw-bold fs-5 ${
            activeTab === 'bookings'
              ? 'text-warning border-bottom border-warning border-3'
              : 'text-muted'
          }`}
          style={{
            borderBottom: activeTab === 'bookings' ? '3px solid #FF9933' : 'none',
            color: activeTab === 'bookings' ? '#FF9933' : '#6c757d',
            boxShadow: 'none'
          }}
          onClick={() => setActiveTab('bookings')}
        >
          <FaCalendarCheck className="me-2" /> My Bookings
        </button>
        <button
          className={`btn pb-3 px-2 rounded-0 border-0 fw-bold fs-5 ${
            activeTab === 'donations'
              ? 'text-warning border-bottom border-warning border-3'
              : 'text-muted'
          }`}
          style={{
            borderBottom: activeTab === 'donations' ? '3px solid #FF9933' : 'none',
            color: activeTab === 'donations' ? '#FF9933' : '#6c757d',
            boxShadow: 'none'
          }}
          onClick={() => setActiveTab('donations')}
        >
          <FaDonate className="me-2" /> My Donations
        </button>
      </div>

      {activeTab === 'bookings' ? (
        <>
          {/* Booking Success Notification banner */}
          {showSuccessBanner && (
            <div className="alert alert-success alert-dismissible fade show shadow-sm rounded-3 border-0 py-3 mb-4" role="alert">
              <div className="d-flex align-items-center">
                <FaCheckCircle className="fs-4 me-3 text-success" />
                <div>
                  <h5 className="alert-heading fw-bold mb-0 text-success">Darshan Slot Booked Successfully!</h5>
                  <span className="small text-muted">Your booking has been registered. Please present your details at the temple entry.</span>
                </div>
              </div>
              <button type="button" className="btn-close" onClick={() => setShowSuccessBanner(false)} aria-label="Close"></button>
            </div>
          )}

          {loading ? (
            <div className="text-center my-5 py-5">
              <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Retrieving booking history...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center shadow-sm">{error}</div>
          ) : bookings.length === 0 ? (
            <div className="text-center my-5 py-5 card rounded-card p-5 bg-white">
              <FaExclamationCircle className="fs-1 text-warning mb-3 opacity-60" />
              <h4 className="text-muted">No bookings found</h4>
              <p className="text-muted small">You haven't booked any temple darshan slots yet.</p>
              <a href="/" className="btn btn-saffron mt-3 px-4 py-2" style={{ backgroundColor: '#FF9933', color: '#fff' }}>
                Browse Temples
              </a>
            </div>
          ) : (
            <div className="row g-4">
              {bookings.map((booking) => {
                const canCancel = booking.status === 'PENDING' || booking.status === 'CONFIRMED';
                const formattedDate = new Date(booking.slot.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                });

                return (
                  <div key={booking._id} className="col-12">
                    <div className="card rounded-card border-0 shadow-sm overflow-hidden bg-white">
                      <div className="card-body p-4">
                        <div className="row g-4 align-items-center">
                          
                          {/* Left: Temple info summary */}
                          <div className="col-md-4 border-end border-light">
                            <div className="d-flex align-items-start">
                              <FaPlaceOfWorship className="fs-3 text-warning me-3 mt-1" />
                              <div>
                                <h5 className="fw-bold text-dark mb-1">{booking.temple.name}</h5>
                                <span className="badge bg-light text-muted border mb-3">{booking.temple.deity}</span>
                                <div className="d-flex align-items-center text-muted small mb-1">
                                  <FaMapMarkerAlt className="me-2 text-danger" />
                                  <span>{booking.temple.location}</span>
                                </div>
                                <div className="d-flex align-items-center text-muted small">
                                  <FaClock className="me-2 text-success" />
                                  <span>{booking.temple.timings}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Middle: Slot & Devotees Summary */}
                          <div className="col-md-5">
                            <div className="mb-3">
                              <span className="small text-muted fw-bold uppercase-title">Darshan Date & Time</span>
                              <h6 className="fw-bold text-dark mt-1 mb-1">{formattedDate}</h6>
                              <span className="text-warning fw-semibold fs-6">{booking.slot.timeSlot}</span>
                            </div>

                            <div>
                              <span className="small text-muted fw-bold d-flex align-items-center mb-2">
                                <FaUsers className="me-2 text-warning fs-5" /> Devotees List ({booking.numberOfDevotees})
                              </span>
                              <div className="row g-2">
                                {booking.devotees.map((devotee, index) => (
                                  <div key={devotee._id || index} className="col-sm-6 col-12">
                                    <div className="p-2 rounded bg-light border border-light d-flex align-items-center small">
                                      <FaUser className="me-2 text-muted" />
                                      <span className="text-dark fw-medium">{devotee.name}</span>
                                      <span className="text-muted ms-2 small">({devotee.age} yrs, {devotee.gender})</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Right: Booking Status & Action */}
                          <div className="col-md-3 text-md-center border-start border-light d-flex flex-column align-items-stretch align-items-md-center justify-content-center h-100 py-2">
                            <div className="mb-3">
                              <span className="small text-muted d-block mb-1">Status</span>
                              {booking.status === 'PENDING' ? (
                                <span className="badge bg-warning text-dark px-4 py-2 rounded-pill fs-7 d-inline-flex align-items-center">
                                  <FaExclamationCircle className="me-1" /> Pending
                                </span>
                              ) : booking.status === 'CONFIRMED' ? (
                                <span className="badge bg-success px-4 py-2 rounded-pill fs-7 d-inline-flex align-items-center">
                                  <FaCheckCircle className="me-1" /> Confirmed
                                </span>
                              ) : booking.status === 'REJECTED' ? (
                                <span className="badge bg-danger px-4 py-2 rounded-pill fs-7 d-inline-flex align-items-center">
                                  <FaTimesCircle className="me-1" /> Rejected
                                </span>
                              ) : (
                                <span className="badge bg-secondary px-4 py-2 rounded-pill fs-7 d-inline-flex align-items-center">
                                  <FaTimesCircle className="me-1" /> Cancelled
                                </span>
                              )}
                            </div>

                            {canCancel && (
                              <button
                                onClick={() => handleCancelBooking(booking._id)}
                                className="btn btn-outline-danger btn-sm px-4 py-2 rounded-3 w-100"
                                style={{ maxWidth: '200px', margin: '0 auto' }}
                              >
                                Cancel Booking
                              </button>
                            )}
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <>
          {donationsLoading ? (
            <div className="text-center my-5 py-5">
              <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Retrieving donation history...</p>
            </div>
          ) : donationsError ? (
            <div className="alert alert-danger text-center shadow-sm">{donationsError}</div>
          ) : donations.length === 0 ? (
            <div className="text-center my-5 py-5 card rounded-card p-5 bg-white">
              <FaCoins className="fs-1 text-warning mb-3 opacity-60" />
              <h4 className="text-muted">No donations found</h4>
              <p className="text-muted small">You haven't made any donations yet.</p>
              <a href="/" className="btn btn-saffron mt-3 px-4 py-2" style={{ backgroundColor: '#FF9933', color: '#fff' }}>
                Support Temples
              </a>
            </div>
          ) : (
            <div className="row g-4">
              {donations.map((donation) => {
                const formattedDate = new Date(donation.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                });

                return (
                  <div key={donation._id} className="col-12">
                    <div className="card rounded-card border-0 shadow-sm overflow-hidden bg-white">
                      <div className="card-body p-4">
                        <div className="row g-4 align-items-center">
                          
                          {/* Left: Temple info summary */}
                          <div className="col-md-4 border-end border-light">
                            <div className="d-flex align-items-start">
                              <FaPlaceOfWorship className="fs-3 text-warning me-3 mt-1" />
                              <div>
                                <h5 className="fw-bold text-dark mb-1">{donation.temple?.name || 'Temple'}</h5>
                                <span className="badge bg-light text-muted border mb-3">{donation.temple?.deity}</span>
                                <div className="d-flex align-items-center text-muted small mb-1">
                                  <FaMapMarkerAlt className="me-2 text-danger" />
                                  <span>{donation.temple?.location}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Middle: Donation Details */}
                          <div className="col-md-5">
                            <div className="mb-3">
                              <span className="small text-muted fw-bold uppercase-title">Donation Purpose & Date</span>
                              <h6 className="fw-bold text-dark mt-1 mb-1">{donation.purpose}</h6>
                              <span className="text-muted small">{formattedDate}</span>
                            </div>

                            <div className="d-flex align-items-center gap-4">
                              <div>
                                <span className="small text-muted d-block">Payment Method</span>
                                <span className="fw-medium text-dark small">{donation.paymentMethod}</span>
                              </div>
                              <div>
                                <span className="small text-muted d-block">Transaction ID</span>
                                <span className="text-muted font-monospace small">{donation.transactionId}</span>
                              </div>
                            </div>
                          </div>

                          {/* Right: Donation Amount & Status */}
                          <div className="col-md-3 text-md-center border-start border-light d-flex flex-column align-items-stretch align-items-md-center justify-content-center h-100 py-2">
                            <div className="mb-2">
                              <span className="small text-muted d-block">Donated Amount</span>
                              <span className="fw-bold text-success fs-4">₹{donation.amount}</span>
                            </div>

                            <div>
                              <span className="badge bg-success px-4 py-2 rounded-pill fs-7 d-inline-flex align-items-center">
                                <FaCheckCircle className="me-1" /> {donation.status}
                              </span>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MyBookings;
