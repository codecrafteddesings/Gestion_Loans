import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DefaultedLoans = () => {
  const [defaultedLoans, setDefaultedLoans] = useState([]);

  useEffect(() => {
    const fetchDefaultedLoans = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/loans/defaulted');
        setDefaultedLoans(response.data);
      } catch (error) {
        console.error('Error fetching defaulted loans:', error);
      }
    };

    fetchDefaultedLoans();
  }, []);

  return (
    <div>
      <h2>Préstamos en Mora</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Monto</th>
            <th>Tasa de Interés</th>
            <th>Plazo</th>
            <th>Frecuencia</th>
            <th>Estado</th>
            <th>Fecha de Vencimiento</th>
          </tr>
        </thead>
        <tbody>
          {defaultedLoans.map((loan) => (
            <tr key={loan._id}>
              <td>{loan.clientId ? loan.clientId.name : 'Cliente no encontrado'}</td>
              <td>{loan.amount}</td>
              <td>{loan.interestRate}</td>
              <td>{loan.term}</td>
              <td>{loan.frequency}</td>
              <td>{loan.status}</td>
              <td>{new Date(loan.dueDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DefaultedLoans;
