import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FaSearch, FaMapMarkerAlt, FaPlaceOfWorship, FaClock } from 'react-icons/fa';

function Home() {
  const [temples, setTemples] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch temples from backend
  const fetchTemples = async (keyword = '') => {
    setLoading(true);
    setError('');
    try {
      const url = keyword ? `/api/temples?keyword=${encodeURIComponent(keyword)}` : '/api/temples';
      const { data } = await api.get(url);
      setTemples(data.data);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve temples. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemples();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTemples(searchKeyword);
  };

  return (
    <div>
      {/* Hero Header Section */}
      <div
        className="text-white text-center py-5 mb-5 shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #FF9933 0%, #D4AF37 100%)',
          borderBottomLeftRadius: '24px',
          borderBottomRightRadius: '24px',
        }}
      >
        <div className="container py-3">
          <h1 className="display-4 fw-bold mb-2">Effortless Temple Darshan Booking</h1>
          <p className="lead opacity-90 mb-4">
            Search temples and book convenient darshan slots to experience peace and devotion without waiting in long queues.
          </p>

          {/* Search Form */}
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <form onSubmit={handleSearchSubmit} className="d-flex shadow-sm rounded-pill overflow-hidden bg-white p-1">
                <input
                  type="text"
                  className="form-control border-0 px-4 rounded-pill"
                  placeholder="Search temple by name..."
                  style={{ boxShadow: 'none' }}
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <button type="submit" className="btn btn-saffron px-4 rounded-pill d-flex align-items-center">
                  <FaSearch className="me-2" /> Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container pb-5">
        <h2 className="fw-bold mb-4 text-dark d-flex align-items-center">
          <FaPlaceOfWorship className="me-3 text-warning" /> Holy Temples
        </h2>

        {loading ? (
          <div className="text-center my-5 py-5">
            <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Retrieving temples...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center shadow-sm rounded-3">{error}</div>
        ) : temples.length === 0 ? (
          <div className="text-center my-5 py-5 card rounded-card p-5 bg-white">
            <h4 className="text-muted">No temples found</h4>
            <p className="text-muted small">Try adjusting your search criteria or register a temple as Admin.</p>
            {searchKeyword && (
              <button onClick={() => { setSearchKeyword(''); fetchTemples(); }} className="btn btn-saffron mt-3 px-4 py-2 d-inline-block mx-auto">
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {temples.map((temple) => (
              <div key={temple._id} className="col">
                <div className="card h-100 rounded-card overflow-hidden shadow-sm hover-card border-0">
                  {/* Temple Image */}
                  <div style={{ height: '220px', backgroundColor: '#FFF8E7', position: 'relative', overflow: 'hidden' }}>
                    {temple.imageUrl ? (
                      <img
                        src={temple.imageUrl}
                        alt={temple.name}
                        loading="lazy"
                        className="w-100 h-100 object-fit-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1545128485-c400e7702796?w=800&auto=format&fit=crop&q=80';
                        }}
                      />
                    ) : (
                      <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                        <FaPlaceOfWorship className="fs-1 mb-2 text-warning opacity-70" />
                        <span className="small text-uppercase tracking-wider fw-bold">{temple.name}</span>
                      </div>
                    )}
                    <span
                      className="badge px-3 py-2 position-absolute top-0 end-0 m-3 fs-7"
                      style={{ backgroundColor: 'rgba(212, 175, 55, 0.95)', border: '1px solid #ffffff' }}
                    >
                      {temple.deity}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="card-body p-4 d-flex flex-column">
                    <h5 className="card-title fw-bold text-dark mb-2">{temple.name}</h5>

                    <p className="card-text text-muted small mb-3 flex-grow-1">
                      {temple.description.length > 120
                        ? `${temple.description.substring(0, 120)}...`
                        : temple.description}
                    </p>

                    <div className="border-top pt-3 mt-auto">
                      <div className="d-flex align-items-center text-muted small mb-2">
                        <FaMapMarkerAlt className="me-2 text-danger" />
                        <span className="text-truncate">{temple.location}</span>
                      </div>
                      <div className="d-flex align-items-center text-muted small mb-3">
                        <FaClock className="me-2 text-success" />
                        <span>{temple.timings}</span>
                      </div>

                      <Link to={`/temple/${temple._id}`} className="btn btn-saffron w-100 py-2 mt-2">
                        Book Darshan
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
