import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editLoan, setEditLoan] = useState(null);
  const [loanForm, setLoanForm] = useState({ clientId: '', amount: '', interestRate: '', term: '', frequency: '', status: '', dueDate: '' });

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/loans');
      setLoans(response.data);
    } catch (error) {
      console.error('Error fetching loans:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/api/loans/search?query=${searchQuery}`);
      setLoans(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleEditLoan = (loan) => {
    setEditLoan(loan._id);
    setLoanForm({
      clientId: loan.clientId ? loan.clientId.name : '',
      amount: loan.amount,
      interestRate: loan.interestRate,
      term: loan.term,
      frequency: loan.frequency,
      status: loan.status,
      dueDate: new Date(loan.dueDate).toISOString().split('T')[0],
    });
  };

  const handleUpdateLoan = async () => {
    try {
      await axios.put(`http://localhost:5000/api/loans/update/${editLoan}`, loanForm);
      setEditLoan(null);
      setLoanForm({ clientId: '', amount: '', interestRate: '', term: '', frequency: '', status: '', dueDate: '' });
      fetchLoans();
    } catch (error) {
      console.error('Error updating loan:', error);
    }
  };

  const handleDeleteLoan = async (loanId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este préstamo?')) {
      try {
        await axios.delete(`http://localhost:5000/api/loans/delete/${loanId}`);
        fetchLoans();
      } catch (error) {
        console.error('Error deleting loan:', error);
      }
    }
  };

  return (
    <div>
      <h2>Préstamos</h2>
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
      <button className="btn btn-info mb-2" onClick={fetchLoans}>Cargar Préstamos</button>
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
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan._id}>
              <td>{loan.clientId ? loan.clientId.name : 'Cliente no encontrado'}</td>
              <td>{loan.amount}</td>
              <td>{loan.interestRate}</td>
              <td>{loan.term}</td>
              <td>{loan.frequency}</td>
              <td>{loan.status}</td>
              <td>{new Date(loan.dueDate).toLocaleDateString()}</td>
              <td>
                <button className="btn btn-warning mr-2" onClick={() => handleEditLoan(loan)}>Editar</button>
                <button className="btn btn-danger" onClick={() => handleDeleteLoan(loan._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editLoan && (
        <div className="mt-5">
          <h2>Editar Préstamo</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdateLoan(); }}>
            <div className="form-group">
              <label>ID del Cliente</label>
              <input
                type="text"
                className="form-control"
                value={loanForm.clientId}
                onChange={(e) => setLoanForm({ ...loanForm, clientId: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Monto</label>
              <input
                type="number"
                className="form-control"
                value={loanForm.amount}
                onChange={(e) => setLoanForm({ ...loanForm, amount: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Tasa de Interés</label>
              <input
                type="number"
                className="form-control"
                value={loanForm.interestRate}
                onChange={(e) => setLoanForm({ ...loanForm, interestRate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Plazo</label>
              <input
                type="number"
                className="form-control"
                value={loanForm.term}
                onChange={(e) => setLoanForm({ ...loanForm, term: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Frecuencia</label>
              <input
                type="text"
                className="form-control"
                value={loanForm.frequency}
                onChange={(e) => setLoanForm({ ...loanForm, frequency: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Estado</label>
              <input
                type="text"
                className="form-control"
                value={loanForm.status}
                onChange={(e) => setLoanForm({ ...loanForm, status: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Fecha de Vencimiento</label>
              <input
                type="date"
                className="form-control"
                value={loanForm.dueDate}
                onChange={(e) => setLoanForm({ ...loanForm, dueDate: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-success">Actualizar</button>
            <button type="button" className="btn btn-secondary ml-2" onClick={() => setEditLoan(null)}>Cancelar</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Loans;