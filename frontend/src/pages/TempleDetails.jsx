import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { FaPlaceOfWorship, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaPlus, FaTrash, FaCheckCircle, FaUserFriends, FaExclamationTriangle, FaDonate, FaCoins } from 'react-icons/fa';

function TempleDetails() {
  const { id: templeId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [temple, setTemple] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Booking Form State
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [devotees, setDevotees] = useState([{ name: '', age: '', gender: 'Male' }]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Donation Form State
  const [donationAmount, setDonationAmount] = useState('500');
  const [donationPurpose, setDonationPurpose] = useState('General Donation');
  const [donationPaymentMethod, setDonationPaymentMethod] = useState('UPI');
  const [donationLoading, setDonationLoading] = useState(false);
  const [donationError, setDonationError] = useState('');
  const [donationSuccess, setDonationSuccess] = useState('');

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    setDonationError('');
    setDonationSuccess('');

    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role === 'ADMIN' || user.role === 'ORGANIZER') {
      setDonationError('Administrators/Organizers are not permitted to make donations.');
      return;
    }

    const amt = Number(donationAmount);
    if (isNaN(amt) || amt <= 0) {
      setDonationError('Please enter a valid donation amount.');
      return;
    }

    setDonationLoading(true);
    try {
      await api.post('/api/donations', {
        temple: templeId,
        amount: amt,
        purpose: donationPurpose,
        paymentMethod: donationPaymentMethod,
      });
      setDonationSuccess(`Thank you for your generous contribution of ₹${amt}! Your donation has been recorded.`);
      // Reset amount, keep defaults
      setDonationAmount('500');
    } catch (err) {
      console.error(err);
      setDonationError(err.response?.data?.message || 'Donation failed. Please try again.');
    } finally {
      setDonationLoading(false);
    }
  };

  // Fetch temple details and active slots
  useEffect(() => {
    const getTempleData = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/api/temples/${templeId}`);
        setTemple(data.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Error loading temple details');
      } finally {
        setLoading(false);
      }
    };

    const getSlotData = async () => {
      setSlotsLoading(true);
      try {
        const { data } = await api.get(`/api/slots/temple/${templeId}`);
        setSlots(data.data);
      } catch (err) {
        console.error('Error fetching slots:', err);
      } finally {
        setSlotsLoading(false);
      }
    };

    getTempleData();
    getSlotData();
  }, [templeId]);

  const selectedSlot = slots.find((s) => s._id === selectedSlotId);

  // Form handlers
  const handleAddDevotee = () => {
    setDevotees([...devotees, { name: '', age: '', gender: 'Male' }]);
  };

  const handleRemoveDevotee = (index) => {
    const updated = devotees.filter((_, i) => i !== index);
    setDevotees(updated);
  };

  const handleDevoteeChange = (index, field, value) => {
    const updated = [...devotees];
    updated[index][field] = value;
    setDevotees(updated);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');

    if (!user) {
      navigate('/login');
      return;
    }

    if (!selectedSlotId) {
      setBookingError('Please choose a darshan slot');
      return;
    }

    // Input Validation
    for (let i = 0; i < devotees.length; i++) {
      if (!devotees[i].name.trim() || !devotees[i].age) {
        setBookingError(`Please fill name and age for devotee #${i + 1}`);
        return;
      }
    }

    if (devotees.length > selectedSlot.availableSpots) {
      setBookingError(
        `Cannot book for ${devotees.length} devotees. Only ${selectedSlot.availableSpots} spots remaining.`
      );
      return;
    }

    setBookingLoading(true);
    try {
      await api.post('/api/bookings', {
        temple: templeId,
        slot: selectedSlotId,
        devotees: devotees.map(d => ({
          name: d.name.trim(),
          age: Number(d.age),
          gender: d.gender
        })),
      });

      // Redirect to user's bookings with query param to trigger visual alert
      navigate('/bookings?success=true');
    } catch (err) {
      console.error(err);
      setBookingError(err.response?.data?.message || 'Failed to book slot. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container text-center my-5 py-5">
        <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Retrieving temple details...</p>
      </div>
    );
  }

  if (error || !temple) {
    return (
      <div className="container my-5 text-center">
        <div className="alert alert-danger py-4 shadow-sm">{error || 'Temple details could not be loaded.'}</div>
        <Link to="/" className="btn btn-saffron mt-3">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="container my-5 pb-5">
      {/* Breadcrumb / Back button */}
      <div className="mb-4">
        <Link to="/" className="text-decoration-none text-muted fw-semibold small">
          &larr; Back to Temples
        </Link>
      </div>

      <div className="row g-5">
        {/* Left Column: Temple Info */}
        <div className="col-lg-6">
          <div className="card border-0 rounded-4 overflow-hidden shadow-sm bg-white mb-4">
            <div style={{ height: '320px', backgroundColor: '#FFF8E7', position: 'relative', overflow: 'hidden' }}>
              {temple.imageUrl ? (
                <img
                  src={temple.imageUrl}
                  alt={temple.name}
                  loading="lazy"
                  className="w-100 h-100 object-fit-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1545128485-c400e7702796?w=1000&auto=format&fit=crop&q=80';
                  }}
                />
              ) : (
                <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                  <FaPlaceOfWorship className="fs-1 text-warning opacity-50" />
                </div>
              )}
            </div>
            <div className="card-body p-4">
              <span className="badge bg-cream border border-warning text-warning px-3 py-2 mb-3">
                {temple.deity}
              </span>
              <h2 className="fw-bold text-dark mb-3">{temple.name}</h2>

              <div className="d-flex align-items-center text-muted mb-2 small">
                <FaMapMarkerAlt className="me-2 text-danger fs-5" />
                <span>{temple.location}</span>
              </div>
              <div className="d-flex align-items-center text-muted mb-4 small">
                <FaClock className="me-2 text-success fs-5" />
                <span>Operating Timings: {temple.timings}</span>
              </div>

              <h5 className="fw-bold text-dark mt-4 mb-2">History & Significance</h5>
              <p className="text-muted lh-base" style={{ textAlign: 'justify' }}>
                {temple.description}
              </p>
            </div>
          </div>

          {/* Temple Donation Card */}
          <div className="card border-0 rounded-4 shadow-sm bg-white p-4 mt-4">
            <h4 className="fw-bold text-dark mb-3 d-flex align-items-center">
              <FaDonate className="me-2" style={{ color: '#FF9933' }} /> Temple Donation Gateway
            </h4>
            <p className="text-muted small mb-4">
              Your donations support the daily rituals, annadanam (free food kitchen), and temple upkeep. Contributions are highly appreciated.
            </p>

            {donationSuccess && (
              <div className="alert alert-success shadow-sm rounded-3 small border-0 py-3">{donationSuccess}</div>
            )}

            {donationError && (
              <div className="alert alert-danger shadow-sm rounded-3 small border-0 py-3">{donationError}</div>
            )}

            <form onSubmit={handleDonationSubmit}>
              {/* Preset Amounts */}
              <div className="mb-3">
                <label className="form-label fw-bold text-dark small">Select Amount</label>
                <div className="d-flex gap-2 flex-wrap mb-2">
                  {['100', '500', '1000', '2500'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      className={`btn btn-sm px-3 py-2 rounded-3 border ${
                        donationAmount === preset
                          ? 'btn-saffron text-white border-warning'
                          : 'btn-outline-secondary'
                      }`}
                      style={{
                        backgroundColor: donationAmount === preset ? '#FF9933' : '',
                        borderColor: donationAmount === preset ? '#FF9933' : '',
                        color: donationAmount === preset ? '#fff' : '',
                      }}
                      onClick={() => setDonationAmount(preset)}
                    >
                      ₹{preset}
                    </button>
                  ))}
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-light">₹</span>
                  <input
                    type="number"
                    className="form-control rounded-end-3"
                    placeholder="Enter custom amount"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    min="1"
                    required
                  />
                </div>
              </div>

              {/* Purpose & Payment Method */}
              <div className="row g-3 mb-4">
                <div className="col-sm-6">
                  <label className="form-label fw-bold text-dark small">Donation Purpose</label>
                  <select
                    className="form-select rounded-3"
                    value={donationPurpose}
                    onChange={(e) => setDonationPurpose(e.target.value)}
                  >
                    <option value="General Donation">General Donation</option>
                    <option value="Annadanam">Annadanam (Food Offering)</option>
                    <option value="Special Pooja">Special Pooja</option>
                    <option value="Temple Renovation">Temple Renovation</option>
                  </select>
                </div>

                <div className="col-sm-6">
                  <label className="form-label fw-bold text-dark small">Payment Method</label>
                  <select
                    className="form-select rounded-3"
                    value={donationPaymentMethod}
                    onChange={(e) => setDonationPaymentMethod(e.target.value)}
                  >
                    <option value="UPI">UPI / GPay / PhonePe</option>
                    <option value="Card">Credit / Debit Card</option>
                    <option value="Net Banking">Net Banking</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              {user ? (
                user.role === 'ADMIN' || user.role === 'ORGANIZER' ? (
                  <div className="alert alert-warning text-center rounded-3 p-3 border-0 small mb-0">
                    Staff accounts are not permitted to make donations.
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-saffron w-100 py-3 shadow-sm d-flex align-items-center justify-content-center fw-bold"
                    style={{ backgroundColor: '#FF9933', color: '#fff' }}
                    disabled={donationLoading}
                  >
                    {donationLoading ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    ) : (
                      <>
                        <FaCoins className="me-2" /> Make Donation of ₹{donationAmount || '0'}
                      </>
                    )}
                  </button>
                )
              ) : (
                <Link to="/login" className="btn btn-gold text-white w-100 py-3 shadow-sm text-center" style={{ backgroundColor: '#FFCC33' }}>
                  Login to Donate
                </Link>
              )}
            </form>
          </div>
        </div>

        {/* Right Column: Slot Picker & Booking Form */}
        <div className="col-lg-6">
          <div className="card border-0 rounded-4 shadow-sm bg-white p-4">
            <h4 className="fw-bold text-dark mb-4 d-flex align-items-center">
              <FaCalendarAlt className="me-2 text-warning" /> Book Darshan Slot
            </h4>

            {bookingError && (
              <div className="alert alert-danger shadow-sm rounded-3">{bookingError}</div>
            )}

            <form onSubmit={handleBookingSubmit}>
              {/* Step 1: Choose Slot */}
              <div className="mb-4">
                <label className="form-label fw-bold text-dark mb-3">1. Select Date & Time Slot</label>
                {slotsLoading ? (
                  <div className="py-3 text-center">
                    <div className="spinner-border spinner-border-sm text-warning" role="status"></div>
                    <span className="ms-2 text-muted small">Checking slots...</span>
                  </div>
                ) : slots.length === 0 ? (
                  <div className="alert alert-warning text-center small rounded-3 py-3">
                    Currently, no booking slots are scheduled for this temple. Check back later or contact admin.
                  </div>
                ) : (
                  <div className="row g-3">
                    {slots.map((slot) => {
                      const isFull = slot.availableSpots <= 0;
                      const isSelected = selectedSlotId === slot._id;
                      const slotDateStr = new Date(slot.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      });

                      return (
                        <div key={slot._id} className="col-sm-6">
                          <div
                            className={`card p-3 h-100 rounded-3 border-2 text-start position-relative cursor-pointer transition-all ${
                              isFull
                                ? 'bg-light border-light text-muted opacity-60'
                                : isSelected
                                ? 'border-warning bg-light-orange'
                                : 'border-light bg-white hover-orange'
                            }`}
                            onClick={() => !isFull && setSelectedSlotId(slot._id)}
                            style={{
                              cursor: isFull ? 'not-allowed' : 'pointer',
                              backgroundColor: isSelected ? '#FFF8E7' : '',
                            }}
                          >
                            <span className="small text-muted fw-bold d-block mb-1">{slotDateStr}</span>
                            <span className="fw-bold text-dark d-block mb-2">{slot.timeSlot}</span>
                            
                            <div className="d-flex align-items-center mt-2 justify-content-between">
                              {isFull ? (
                                <span className="badge bg-danger rounded-pill px-2 py-1 small">House Full</span>
                              ) : (
                                <span className="badge bg-success rounded-pill px-2 py-1 small">
                                  {slot.availableSpots} spots left
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Step 2: Devotee Details */}
              <div className="mb-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <label className="form-label fw-bold text-dark mb-0">2. Devotees Information</label>
                  <button
                    type="button"
                    className="btn btn-outline-warning btn-sm d-flex align-items-center px-3"
                    onClick={handleAddDevotee}
                    disabled={!selectedSlotId || (user && user.role === 'ADMIN')}
                  >
                    <FaPlus className="me-1 small" /> Add Devotee
                  </button>
                </div>

                {!selectedSlotId ? (
                  <div className="alert bg-light border text-muted small text-center rounded-3 py-3">
                    <FaExclamationTriangle className="me-2 text-warning" />
                    Please choose a darshan slot first to configure devotees.
                  </div>
                ) : (
                  <div>
                    {devotees.map((devotee, index) => (
                      <div key={index} className="card p-3 border-light rounded-3 bg-light mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fw-semibold text-dark small">Devotee #{index + 1}</span>
                          {devotees.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-link text-danger p-0 text-decoration-none"
                              onClick={() => handleRemoveDevotee(index)}
                            >
                              <FaTrash className="small" /> Remove
                            </button>
                          )}
                        </div>

                        <div className="row g-2">
                          <div className="col-md-6 col-sm-12">
                            <input
                              type="text"
                              className="form-control form-control-sm rounded-2"
                              placeholder="Name as in ID Card"
                              value={devotee.name}
                              onChange={(e) => handleDevoteeChange(index, 'name', e.target.value)}
                              required
                            />
                          </div>

                          <div className="col-md-3 col-6">
                            <input
                              type="number"
                              className="form-control form-control-sm rounded-2"
                              placeholder="Age"
                              value={devotee.age}
                              onChange={(e) => handleDevoteeChange(index, 'age', e.target.value)}
                              min="0"
                              max="120"
                              required
                            />
                          </div>

                          <div className="col-md-3 col-6">
                            <select
                              className="form-select form-select-sm rounded-2"
                              value={devotee.gender}
                              onChange={(e) => handleDevoteeChange(index, 'gender', e.target.value)}
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light border border-light">
                      <span className="small text-muted d-flex align-items-center">
                        <FaUserFriends className="me-2 text-warning fs-5" /> Total Bookings requested:
                      </span>
                      <span className="fw-bold text-dark">{devotees.length} Devotee(s)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              {user ? (
                user.role === 'ADMIN' ? (
                  <div className="alert alert-warning text-center rounded-3 shadow-sm p-3 border-0 small mb-0">
                    <FaExclamationTriangle className="me-2 text-warning fs-5" />
                    <strong>Admin Restriction:</strong> Administrators are not permitted to book slots. Please use a Devotee account.
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-saffron btn-lg w-100 py-3 shadow-sm d-flex align-items-center justify-content-center"
                    disabled={bookingLoading || !selectedSlotId || devotees.length === 0}
                  >
                    {bookingLoading ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    ) : (
                      <>
                        <FaCheckCircle className="me-2" /> Book Darshan Ticket
                      </>
                    )}
                  </button>
                )
              ) : (
                <Link to="/login" className="btn btn-gold btn-lg w-100 py-3 shadow-sm text-center text-white">
                  Login to Book Darshan
                </Link>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TempleDetails;
