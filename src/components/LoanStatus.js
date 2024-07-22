// src/components/LoanStatus.js
import React from 'react';

const LoanStatus = ({ loan }) => {
  const calculateRemainingAmount = (loan) => {
    const paidAmount = loan.payments.reduce((sum, payment) => sum + payment.amount, 0);
    return loan.amount - paidAmount;
  };

  const isLate = (loan) => {
    const dueDate = new Date(loan.dueDate);
    const today = new Date();
    return dueDate < today && loan.status !== 'Paid';
  };

  const remainingAmount = calculateRemainingAmount(loan);
  const late = isLate(loan);

  return (
    <div className={`card ${late ? 'bg-warning' : 'bg-success'} text-white mb-3`}>
      <div className="card-header">Estado del Préstamo</div>
      <div className="card-body">
        <h5 className="card-title">{loan.clientName}</h5>
        <p className="card-text">Monto Total: {loan.amount}</p>
        <p className="card-text">Monto Restante: {remainingAmount}</p>
        <p className="card-text">Estado: {loan.status}</p>
        {late && <p className="card-text text-danger">¡En Mora!</p>}
      </div>
    </div>
  );
};

export default LoanStatus;
