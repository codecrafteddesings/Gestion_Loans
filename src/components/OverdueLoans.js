import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OverdueLoans = () => {
  const [overdueLoans, setOverdueLoans] = useState([]);

  useEffect(() => {
    const fetchOverdueLoans = async () => {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/loans/overdue`);
      setOverdueLoans(response.data);
    };

    fetchOverdueLoans();
  }, []);

  return (
    <div className="container mt-5">
      <h1>Préstamos en Mora</h1>
      <ul className="list-group">
        {overdueLoans.map((loan) => (
          <li key={loan.id} className="list-group-item">
            {loan.details}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OverdueLoans;
