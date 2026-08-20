import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { FaPlaceOfWorship, FaCalendarPlus, FaListAlt, FaTrash, FaEdit, FaPlus, FaTimes, FaUserShield, FaExclamationTriangle, FaCheck, FaDonate, FaCoins } from 'react-icons/fa';

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Tab State: 'temples', 'slots', 'bookings', 'donations'
  const [activeTab, setActiveTab] = useState('temples');

  // Shared Data States
  const [temples, setTemples] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loadingTemples, setLoadingTemples] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [loadingDonations, setLoadingDonations] = useState(false);

  // --- 1. Temple Form States ---
  const [templeForm, setTempleForm] = useState({
    id: '', // Empty in Add mode, populated in Edit mode
    name: '',
    deity: '',
    location: '',
    description: '',
    timings: '',
    imageUrl: '',
  });
  const [isEditingTemple, setIsEditingTemple] = useState(false);
  const [templeError, setTempleError] = useState('');
  const [templeSuccess, setTempleSuccess] = useState('');

  // --- 2. Slot Form & Data States ---
  const [slots, setSlots] = useState([]);
  const [selectedTempleForSlots, setSelectedTempleForSlots] = useState('');
  const [slotForm, setSlotForm] = useState({
    date: '',
    timeSlot: '',
    maxCapacity: '',
  });
  const [slotError, setSlotError] = useState('');
  const [slotSuccess, setSlotSuccess] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Load Temples and Bookings
  const fetchTemples = async () => {
    setLoadingTemples(true);
    try {
      const { data } = await api.get('/api/temples');
      setTemples(data.data);
      if (data.data.length > 0 && !selectedTempleForSlots) {
        setSelectedTempleForSlots(data.data[0]._id);
      }
    } catch (err) {
      console.error('Error fetching temples', err);
    } finally {
      setLoadingTemples(false);
    }
  };

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const { data } = await api.get('/api/bookings');
      setBookings(data.data);
    } catch (err) {
      console.error('Error fetching bookings', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleConfirmBooking = async (bookingId) => {
    try {
      const { data } = await api.put(`/api/bookings/${bookingId}/confirm`);
      if (data.success) {
        alert('Booking has been confirmed successfully!');
        fetchBookings();
      }
    } catch (err) {
      console.error('Error confirming booking', err);
      alert(err.response?.data?.message || 'Error occurred while confirming booking.');
    }
  };

  const handleRejectBooking = async (bookingId) => {
    try {
      const { data } = await api.put(`/api/bookings/${bookingId}/reject`);
      if (data.success) {
        alert('Booking has been rejected successfully and spots restored.');
        fetchBookings();
      }
    } catch (err) {
      console.error('Error rejecting booking', err);
      alert(err.response?.data?.message || 'Error occurred while rejecting booking.');
    }
  };

  const handleClearBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to clear/delete this booking record from the ledger?')) {
      try {
        const { data } = await api.delete(`/api/bookings/${bookingId}`);
        if (data.success) {
          alert('Booking request has been cleared successfully.');
          fetchBookings();
        }
      } catch (err) {
        console.error('Error clearing booking', err);
        alert(err.response?.data?.message || 'Error occurred while clearing booking.');
      }
    }
  };

  useEffect(() => {
    if (user && (user.role === 'ADMIN' || user.role === 'ORGANIZER')) {
      fetchTemples();
      fetchBookings();
    }
  }, [user]);

  // Fetch Slots when selected temple changes
  const fetchSlotsForTemple = async (templeId) => {
    if (!templeId) return;
    setLoadingSlots(true);
    try {
      const { data } = await api.get(`/api/slots/temple/${templeId}`);
      setSlots(data.data);
    } catch (err) {
      console.error('Error fetching slots', err);
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    if (selectedTempleForSlots) {
      fetchSlotsForTemple(selectedTempleForSlots);
    }
  }, [selectedTempleForSlots]);

  const fetchDonations = async () => {
    setLoadingDonations(true);
    try {
      const { data } = await api.get('/api/donations');
      setDonations(data.data);
    } catch (err) {
      console.error('Error fetching donations', err);
    } finally {
      setLoadingDonations(false);
    }
  };

  const handleDeleteDonation = async (donationId) => {
    if (window.confirm('Are you sure you want to delete/clear this donation record from the system ledger?')) {
      try {
        await api.delete(`/api/donations/${donationId}`);
        alert('Donation record deleted successfully.');
        fetchDonations();
      } catch (err) {
        console.error('Error deleting donation', err);
        alert(err.response?.data?.message || 'Failed to delete donation.');
      }
    }
  };

  const handleUpdateDonationStatus = async (donationId, newStatus) => {
    try {
      await api.put(`/api/donations/${donationId}`, { status: newStatus });
      alert('Donation status updated successfully!');
      fetchDonations();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update donation status.');
    }
  };

  useEffect(() => {
    if (activeTab === 'donations' && user && (user.role === 'ADMIN' || user.role === 'ORGANIZER')) {
      fetchDonations();
    }
  }, [activeTab, user]);

  // Handle access guard
  if (!user || (user.role !== 'ADMIN' && user.role !== 'ORGANIZER')) {
    return (
      <div className="container my-5 text-center py-5 card rounded-card border-0 shadow bg-white">
        <FaUserShield className="text-danger display-1 mb-4" />
        <h2 className="fw-bold text-dark">Access Denied</h2>
        <p className="text-muted">You do not have the administrator or organizer privileges required to access the Admin Panel.</p>
        <button onClick={() => navigate('/')} className="btn btn-saffron mt-3 px-5 py-3 fs-6" style={{ backgroundColor: '#FF9933', color: '#fff' }}>
          Return to Home
        </button>
      </div>
    );
  }

  // --- TEMPLE OPERATIONS ---
  const handleTempleFormSubmit = async (e) => {
    e.preventDefault();
    setTempleError('');
    setTempleSuccess('');

    try {
      if (isEditingTemple) {
        // Update Temple
        const { data } = await api.put(`/api/temples/${templeForm.id}`, templeForm);
        setTempleSuccess('Temple updated successfully!');
        setTemples(prev => prev.map(t => t._id === templeForm.id ? data.data : t));
        handleClearTempleForm();
      } else {
        // Create Temple
        const { data } = await api.post('/api/temples', templeForm);
        setTempleSuccess('Temple registered successfully!');
        setTemples(prev => [...prev, data.data]);
        handleClearTempleForm();
      }
    } catch (err) {
      console.error(err);
      setTempleError(err.response?.data?.message || 'Operation failed. Check input.');
    }
  };

  const handleEditTempleClick = (temple) => {
    setTempleForm({
      id: temple._id,
      name: temple.name,
      deity: temple.deity,
      location: temple.location,
      description: temple.description,
      timings: temple.timings,
      imageUrl: temple.imageUrl || '',
    });
    setIsEditingTemple(true);
    setTempleError('');
    setTempleSuccess('');
  };

  const handleDeleteTempleClick = async (templeId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this temple? This does not cascade delete bookings/slots automatically.'
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/api/temples/${templeId}`);
      setTemples(prev => prev.filter(t => t._id !== templeId));
      alert('Temple removed successfully.');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Deletion failed.');
    }
  };

  const handleClearTempleForm = () => {
    setTempleForm({
      id: '',
      name: '',
      deity: '',
      location: '',
      description: '',
      timings: '',
      imageUrl: '',
    });
    setIsEditingTemple(false);
  };

  // --- SLOT OPERATIONS ---
  const handleSlotFormSubmit = async (e) => {
    e.preventDefault();
    setSlotError('');
    setSlotSuccess('');

    if (!selectedTempleForSlots) {
      setSlotError('Please select a temple first.');
      return;
    }

    try {
      await api.post('/api/slots', {
        temple: selectedTempleForSlots,
        date: slotForm.date,
        timeSlot: slotForm.timeSlot,
        maxCapacity: Number(slotForm.maxCapacity),
      });

      setSlotSuccess('Darshan slot created successfully!');
      setSlotForm({ date: '', timeSlot: '', maxCapacity: '' });
      fetchSlotsForTemple(selectedTempleForSlots); // Reload list
    } catch (err) {
      console.error(err);
      setSlotError(err.response?.data?.message || 'Failed to create slot.');
    }
  };

  const handleDeleteSlotClick = async (slotId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this slot?');
    if (!confirmDelete) return;

    try {
      await api.delete(`/api/slots/${slotId}`);
      setSlots(prev => prev.filter(s => s._id !== slotId));
      alert('Slot deleted successfully.');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete slot.');
    }
  };

  return (
    <div className="container my-5 pb-5">
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
        <h2 className="fw-bold text-dark mb-0">Staff Control Panel</h2>
        <span className="badge bg-danger px-3 py-2 rounded-pill fs-7 text-uppercase tracking-wider">
          <FaUserShield className="me-1" /> {user.role === 'ADMIN' ? 'Administrator' : 'Temple Organizer'}
        </span>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs nav-fill mb-4 border-0 bg-light p-1 rounded-3 shadow-sm" style={{ borderBottom: 'none' }}>
        <li className="nav-item">
          <button
            className={`nav-link border-0 py-3 fw-bold rounded-3 d-flex align-items-center justify-content-center w-100 ${
              activeTab === 'temples' ? 'bg-warning text-white' : 'text-secondary bg-transparent'
            }`}
            onClick={() => setActiveTab('temples')}
            style={{
              backgroundColor: activeTab === 'temples' ? '#FF9933' : 'transparent',
              color: activeTab === 'temples' ? '#fff' : '',
            }}
          >
            <FaPlaceOfWorship className="me-2" /> Manage Temples
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link border-0 py-3 fw-bold rounded-3 d-flex align-items-center justify-content-center w-100 ${
              activeTab === 'slots' ? 'bg-warning text-white' : 'text-secondary bg-transparent'
            }`}
            onClick={() => setActiveTab('slots')}
            style={{
              backgroundColor: activeTab === 'slots' ? '#FF9933' : 'transparent',
              color: activeTab === 'slots' ? '#fff' : '',
            }}
          >
            <FaCalendarPlus className="me-2" /> Manage Slots
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link border-0 py-3 fw-bold rounded-3 d-flex align-items-center justify-content-center w-100 ${
              activeTab === 'bookings' ? 'bg-warning text-white' : 'text-secondary bg-transparent'
            }`}
            onClick={() => setActiveTab('bookings')}
            style={{
              backgroundColor: activeTab === 'bookings' ? '#FF9933' : 'transparent',
              color: activeTab === 'bookings' ? '#fff' : '',
            }}
          >
            <FaListAlt className="me-2" /> View Bookings
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link border-0 py-3 fw-bold rounded-3 d-flex align-items-center justify-content-center w-100 ${
              activeTab === 'donations' ? 'bg-warning text-white' : 'text-secondary bg-transparent'
            }`}
            onClick={() => setActiveTab('donations')}
            style={{
              backgroundColor: activeTab === 'donations' ? '#FF9933' : 'transparent',
              color: activeTab === 'donations' ? '#fff' : '',
            }}
          >
            <FaDonate className="me-2" /> View Donations
          </button>
        </li>
      </ul>

      {/* TAB CONTENT 1: MANAGE TEMPLES */}
      {activeTab === 'temples' && (
        <div className="row g-4 animate-fade">
          {/* Temple Form */}
          <div className="col-md-5">
            <div className="card border-0 shadow-sm p-4 bg-white rounded-3">
              <h5 className="fw-bold text-dark mb-4 border-bottom pb-2">
                {isEditingTemple ? 'Edit Temple details' : 'Add New Temple'}
              </h5>

              {templeError && <div className="alert alert-danger small">{templeError}</div>}
              {templeSuccess && <div className="alert alert-success small">{templeSuccess}</div>}

              <form onSubmit={handleTempleFormSubmit}>
                <div className="mb-3">
                  <label className="form-label small text-muted">Temple Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={templeForm.name}
                    onChange={(e) => setTempleForm({ ...templeForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small text-muted">Deity Worshipped *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Shiva, Krishna, Durga"
                    value={templeForm.deity}
                    onChange={(e) => setTempleForm({ ...templeForm, deity: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small text-muted">Location / Address *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={templeForm.location}
                    onChange={(e) => setTempleForm({ ...templeForm, location: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small text-muted">Operating Timings *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 06:00 AM - 09:00 PM"
                    value={templeForm.timings}
                    onChange={(e) => setTempleForm({ ...templeForm, timings: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small text-muted">Image URL (Optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={templeForm.imageUrl}
                    onChange={(e) => setTempleForm({ ...templeForm, imageUrl: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small text-muted">History & Description *</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={templeForm.description}
                    onChange={(e) => setTempleForm({ ...templeForm, description: e.target.value })}
                    required
                  ></textarea>
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-saffron w-100 py-2">
                    {isEditingTemple ? 'Update Temple' : 'Register Temple'}
                  </button>
                  {isEditingTemple && (
                    <button type="button" className="btn btn-secondary px-3" onClick={handleClearTempleForm}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Temples List */}
          <div className="col-md-7">
            <div className="card border-0 shadow-sm p-4 bg-white rounded-3">
              <h5 className="fw-bold text-dark mb-4 border-bottom pb-2">Registered Temples</h5>

              {loadingTemples ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-warning" role="status"></div>
                </div>
              ) : temples.length === 0 ? (
                <p className="text-muted text-center py-5">No temples registered yet.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Photo</th>
                        <th>Name</th>
                        <th>Deity</th>
                        <th>Location</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {temples.map((t) => (
                        <tr key={t._id}>
                          <td>
                            {t.imageUrl ? (
                              <div className="temple-thumb">
                                <img src={t.imageUrl} alt={t.name} className="" onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1545128485-c400e7702796?w=800&auto=format&fit=crop&q=80'; }} />
                              </div>
                            ) : (
                              <div className="temple-thumb d-flex align-items-center justify-content-center bg-cream text-warning">
                                <FaPlaceOfWorship />
                              </div>
                            )}
                          </td>
                          <td className="fw-semibold text-dark">{t.name}</td>
                          <td><span className="badge bg-cream text-warning border border-warning">{t.deity}</span></td>
                          <td className="small text-muted">{t.location}</td>
                          <td className="text-end">
                            <button
                              onClick={() => handleEditTempleClick(t)}
                              className="btn btn-link text-warning p-0 me-3 text-decoration-none"
                            >
                              <FaEdit /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTempleClick(t._id)}
                              className="btn btn-link text-danger p-0 text-decoration-none"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: MANAGE SLOTS */}
      {activeTab === 'slots' && (
        <div className="row g-4 animate-fade">
          {/* Slot Scheduler Form */}
          <div className="col-md-5">
            <div className="card border-0 shadow-sm p-4 bg-white rounded-3">
              <h5 className="fw-bold text-dark mb-4 border-bottom pb-2">Schedule Darshan Slot</h5>

              {slotError && <div className="alert alert-danger small">{slotError}</div>}
              {slotSuccess && <div className="alert alert-success small">{slotSuccess}</div>}

              <form onSubmit={handleSlotFormSubmit}>
                <div className="mb-3">
                  <label className="form-label small text-muted">Select Temple *</label>
                  <select
                    className="form-select"
                    value={selectedTempleForSlots}
                    onChange={(e) => setSelectedTempleForSlots(e.target.value)}
                    required
                  >
                    {temples.map(t => (
                      <option key={t._id} value={t._id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label small text-muted">Darshan Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={slotForm.date}
                    onChange={(e) => setSlotForm({ ...slotForm, date: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small text-muted">Time Slot Timing (e.g. 08:00 AM - 10:00 AM) *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={slotForm.timeSlot}
                    onChange={(e) => setSlotForm({ ...slotForm, timeSlot: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small text-muted">Devotee Max Capacity *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={slotForm.maxCapacity}
                    onChange={(e) => setSlotForm({ ...slotForm, maxCapacity: e.target.value })}
                    min="1"
                    required
                  />
                </div>

                <button type="submit" className="btn btn-saffron w-100 py-2">
                  <FaPlus className="me-1" /> Add Slot
                </button>
              </form>
            </div>
          </div>

          {/* Slots List for Selected Temple */}
          <div className="col-md-7">
            <div className="card border-0 shadow-sm p-4 bg-white rounded-3">
              <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-2">
                <h5 className="fw-bold text-dark mb-0">Scheduled Slots</h5>
                <select
                  className="form-select form-select-sm w-auto"
                  value={selectedTempleForSlots}
                  onChange={(e) => setSelectedTempleForSlots(e.target.value)}
                >
                  {temples.map(t => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {loadingSlots ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-warning" role="status"></div>
                </div>
              ) : slots.length === 0 ? (
                <p className="text-muted text-center py-5">No slots scheduled for this temple yet.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Time Slot</th>
                        <th>Capacity</th>
                        <th>Available Spots</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {slots.map((s) => {
                        const dateStr = new Date(s.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        });
                        return (
                          <tr key={s._id}>
                            <td className="fw-semibold text-dark">{dateStr}</td>
                            <td>{s.timeSlot}</td>
                            <td>{s.maxCapacity}</td>
                            <td>
                              <span className={`badge ${s.availableSpots > 0 ? 'bg-success' : 'bg-danger'}`}>
                                {s.availableSpots} / {s.maxCapacity}
                              </span>
                            </td>
                            <td className="text-end">
                              <button
                                onClick={() => handleDeleteSlotClick(s._id)}
                                className="btn btn-link text-danger p-0 text-decoration-none"
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: VIEW ALL BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="card border-0 shadow-sm p-4 bg-white rounded-3 animate-fade">
          <h5 className="fw-bold text-dark mb-4 border-bottom pb-2">Global Booking Ledger</h5>

          {loadingBookings ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status"></div>
            </div>
          ) : bookings.length === 0 ? (
            <p className="text-muted text-center py-5">No bookings placed on the system yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle table-striped table-hover">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Temple</th>
                    <th>Date / Time Slot</th>
                    <th>Devotees Count</th>
                    <th>Devotee Names</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => {
                    const dateStr = new Date(b.slot?.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });
                    return (
                      <tr key={b._id}>
                        <td>
                          <div className="fw-semibold text-dark">{b.user?.name || 'Deleted User'}</div>
                          <div className="small text-muted">{b.user?.email}</div>
                          <div className="small text-muted">{b.user?.phoneNumber}</div>
                        </td>
                        <td className="fw-semibold text-dark">{b.temple?.name || 'Deleted Temple'}</td>
                        <td>
                          <div>{dateStr}</div>
                          <div className="small text-warning fw-medium">{b.slot?.timeSlot}</div>
                        </td>
                        <td className="text-center fw-bold">{b.numberOfDevotees}</td>
                        <td>
                          <div className="small text-muted">
                            {b.devotees?.map(d => `${d.name} (${d.age})`).join(', ')}
                          </div>
                        </td>
                        <td>
                          {b.status === 'PENDING' ? (
                            <span className="badge bg-warning text-dark rounded-pill px-3 py-2 small">Pending Review</span>
                          ) : b.status === 'CONFIRMED' ? (
                            <span className="badge bg-success rounded-pill px-3 py-2 small">Confirmed</span>
                          ) : b.status === 'REJECTED' ? (
                            <span className="badge bg-danger rounded-pill px-3 py-2 small">Rejected</span>
                          ) : (
                            <span className="badge bg-secondary rounded-pill px-3 py-2 small">Cancelled</span>
                          )}
                        </td>
                        <td className="text-end">
                          {b.status === 'PENDING' && (
                            <div className="d-flex justify-content-end gap-2">
                              <button
                                onClick={() => handleConfirmBooking(b._id)}
                                className="btn btn-success btn-sm px-3 rounded-pill d-flex align-items-center gap-1 shadow-sm"
                                title="Confirm Booking"
                              >
                                <FaCheck className="small" /> Confirm
                              </button>
                              <button
                                onClick={() => handleRejectBooking(b._id)}
                                className="btn btn-danger btn-sm px-3 rounded-pill d-flex align-items-center gap-1 shadow-sm"
                                title="Reject Booking"
                              >
                                <FaTimes className="small" /> Reject
                              </button>
                            </div>
                          )}
                          {(b.status === 'CANCELLED' || b.status === 'REJECTED') && (
                            <div className="d-flex justify-content-end">
                              <button
                                onClick={() => handleClearBooking(b._id)}
                                className="btn btn-outline-danger btn-sm px-3 rounded-pill d-flex align-items-center gap-1"
                                title="Clear Booking Request"
                              >
                                <FaTrash className="small" /> Clear
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 4: VIEW ALL DONATIONS */}
      {activeTab === 'donations' && (
        <div className="card border-0 shadow-sm p-4 bg-white rounded-3 animate-fade">
          <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-2">
            <h5 className="fw-bold text-dark mb-0">Global Donation Ledger</h5>
            {donations.length > 0 && (
              <span className="badge bg-success rounded-pill px-3 py-2 fs-6">
                Total Collection: ₹{donations.reduce((sum, d) => sum + (d.status === 'Completed' ? d.amount : 0), 0)}
              </span>
            )}
          </div>

          {loadingDonations ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status"></div>
            </div>
          ) : donations.length === 0 ? (
            <p className="text-muted text-center py-5">No donations placed on the system yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle table-striped table-hover">
                <thead>
                  <tr>
                    <th>Devotee / Contributor</th>
                    <th>Temple Name</th>
                    <th>Purpose / Date</th>
                    <th>Payment Method</th>
                    <th>Transaction ID</th>
                    <th className="text-center">Amount</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d) => {
                    const dateStr = new Date(d.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });
                    return (
                      <tr key={d._id}>
                        <td>
                          <div className="fw-semibold text-dark">{d.user?.name || 'Deleted User'}</div>
                          <div className="small text-muted">{d.user?.email}</div>
                          <div className="small text-muted">{d.user?.phoneNumber}</div>
                        </td>
                        <td className="fw-semibold text-dark">{d.temple?.name || 'Deleted Temple'}</td>
                        <td>
                          <div className="fw-medium text-dark">{d.purpose}</div>
                          <div className="small text-muted">{dateStr}</div>
                        </td>
                        <td className="small text-muted">{d.paymentMethod}</td>
                        <td className="small font-monospace text-muted">{d.transactionId}</td>
                        <td className="text-center fw-bold text-success fs-5">₹{d.amount}</td>
                        <td>
                          <select
                            className={`form-select form-select-sm rounded-pill px-3 py-1 font-medium ${
                              d.status === 'Completed'
                                ? 'bg-success-subtle text-success border-success'
                                : d.status === 'Pending'
                                ? 'bg-warning-subtle text-warning border-warning'
                                : 'bg-danger-subtle text-danger border-danger'
                            }`}
                            value={d.status}
                            onChange={(e) => handleUpdateDonationStatus(d._id, e.target.value)}
                            style={{ width: '130px', fontSize: '0.85rem' }}
                          >
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                            <option value="Failed">Failed</option>
                          </select>
                        </td>
                        <td className="text-end">
                          <button
                            onClick={() => handleDeleteDonation(d._id)}
                            className="btn btn-outline-danger btn-sm px-3 rounded-pill d-flex align-items-center gap-1 ms-auto"
                            title="Delete record"
                          >
                            <FaTrash className="small" /> Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
