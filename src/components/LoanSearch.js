import React, { useState } from 'react';

const LoanSearch = ({ setLoans }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/loans/search?query=${searchQuery}`);
      const data = await response.json();
      setLoans(data);
    } catch (error) {
      console.error('Error fetching loans:', error);
    }
  };

  return (
    <div>
      <h2>Buscar Préstamo</h2>
      <form onSubmit={handleSearch}>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por cliente o estado"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Buscar</button>
      </form>
    </div>
  );
};

export default LoanSearch;