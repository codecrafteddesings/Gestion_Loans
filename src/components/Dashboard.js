import axios from "axios";
import React, { useState, useEffect } from "react";
import LoanSearch from "./LoanSearch";

const Dashboard = () => {
  const [summary, setSummary] = useState({});
  const [recentPayments, setRecentPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [editClient, setEditClient] = useState(null);
  const [clientForm, setClientForm] = useState({ name: '', email: '', phone: '', idNumber: '', address: '' });
  const [loans, setLoans] = useState([]);
  const [editLoan, setEditLoan] = useState(null);
  const [loanForm, setLoanForm] = useState({ clientId: '', amount: '', interestRate: '', term: '', frequency: '', status: '', dueDate: '' });

  const [paymentForm, setPaymentForm] = useState({ clientId: '', amount: '', date: '' });
  const [payments, setPayments] = useState([]);
  const [showPayments, setShowPayments] = useState(false); // Estado inicial cambiado a false

  const fetchSummary = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/reports/summary");
      setSummary(response.data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };

  const fetchRecentPayments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/reports/recent-payments");
      setRecentPayments(response.data);
    } catch (error) {
      console.error("Error fetching recent payments:", error);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/payments");
      setPayments(response.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchRecentPayments();
    fetchPayments();

    const intervalId = setInterval(() => {
      fetchRecentPayments();
    }, 30000); // Actualiza cada 30 segundos

    return () => clearInterval(intervalId);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/api/clientes/search?query=${searchQuery}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleEdit = (client) => {
    setEditClient(client._id);
    setClientForm({ name: client.name, email: client.email, phone: client.phone, idNumber: client.idNumber, address: client.address });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/clientes/update/${editClient}`, clientForm);
      setEditClient(null);
      setClientForm({ name: '', email: '', phone: '', idNumber: '', address: '' });
      handleSearch({ preventDefault: () => { } });
    } catch (error) {
      console.error("Error updating client:", error);
    }
  };

  const handleDelete = async (clientId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      try {
        await axios.delete(`http://localhost:5000/api/clientes/delete/${clientId}`);
        handleSearch({ preventDefault: () => { } });
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
  };

  const fetchLoans = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/loans");
      setLoans(response.data);
    } catch (error) {
      console.error("Error fetching loans:", error);
    }
  };

  const handleEditLoan = (loan) => {
    setEditLoan(loan._id);
    setLoanForm({
      clientId: loan.clientId ? loan.clientId._id : '',
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
      console.error("Error updating loan:", error);
    }
  };

  const handleDeleteLoan = async (loanId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este préstamo?")) {
      try {
        await axios.delete(`http://localhost:5000/api/loans/delete/${loanId}`);
        fetchLoans();
      } catch (error) {
        console.error("Error deleting loan:", error);
      }
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/payments", paymentForm);
      setPaymentForm({ clientId: '', amount: '', date: '' });
      fetchRecentPayments();
    } catch (error) {
      console.error("Error adding payment:", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="jumbotron text-center">
        <h1 className="display-4">Dashboard</h1>
        <p className="lead">Resumen de Préstamos y Pagos</p>
      </div>
      <div className="row">
        <div className="col-md-4">
          <div className="card text-white bg-primary mb-3">
            <div className="card-header">Clientes totales</div>
            <div className="card-body">
              <h5 className="card-title">{summary.totalClientes || 0}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-success mb-3">
            <div className="card-header">Total de Préstamos</div>
            <div className="card-body">
              <h5 className="card-title">{summary.totalPrestamos || 0}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-danger mb-3">
            <div className="card-header">Préstamos en Mora y Atraso</div>
            <div className="card-body">
              <h5 className="card-title">{summary.totalMora || 0} en mora, {summary.totalAtraso || 0} en atraso</h5>
            </div>
          </div>
        </div>
      </div>

      <h2>Pagos Realizados</h2>
      <button className="btn btn-secondary mb-3" onClick={() => setShowPayments(!showPayments)}>
        {showPayments ? "Ocultar Pagos" : "Mostrar Pagos"}
      </button>
      {showPayments && (
        <div className="accordion" id="paymentsAccordion">
          {payments.map((payment, index) => (
            <div className="card" key={payment._id}>
              <div className="card-header" id={`heading${index}`}>
                <h2 className="mb-0">
                  <button
                    className="btn btn-link btn-block text-left"
                    type="button"
                    data-toggle="collapse"
                    data-target={`#collapse${index}`}
                    aria-expanded="true"
                    aria-controls={`collapse${index}`}
                  >
                    {payment.clientId ? payment.clientId.name : "Cliente no encontrado"} - {payment.amount} - {new Date(payment.date).toLocaleDateString()}
                  </button>
                </h2>
              </div>
              <div
                id={`collapse${index}`}
                className="collapse"
                aria-labelledby={`heading${index}`}
                data-parent="#paymentsAccordion"
              >
                <div className="card-body">
                  Detalles del Pago:
                  <ul>
                    <li>Cliente: {payment.clientId ? payment.clientId.name : "Cliente no encontrado"}</li>
                    <li>Monto: {payment.amount}</li>
                    <li>Fecha: {new Date(payment.date).toLocaleDateString()}</li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2>Buscar Cliente</h2>
      <form onSubmit={handleSearch}>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre o cédula"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Buscar</button>
      </form>
      <h2>Resultados de la Búsqueda</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo Electrónico</th>
            <th>Teléfono</th>
            <th>Cédula</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((cliente) => (
            <tr key={cliente._id}>
              <td>{cliente.name}</td>
              <td>{cliente.email}</td>
              <td>{cliente.phone}</td>
              <td>{cliente.idNumber}</td>
              <td>{cliente.address}</td>
              <td>
                <button className="btn btn-warning mr-2" onClick={() => handleEdit(cliente)}>Editar</button>
                <button className="btn btn-danger" onClick={() => handleDelete(cliente._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editClient && (
        <div className="mt-5">
          <h2>Editar Cliente</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                className="form-control"
                value={clientForm.name}
                onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Correo Electrónico</label>
              <input
                type="email"
                className="form-control"
                value={clientForm.email}
                onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="text"
                className="form-control"
                value={clientForm.phone}
                onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Cédula</label>
              <input
                type="text"
                className="form-control"
                value={clientForm.idNumber}
                onChange={(e) => setClientForm({ ...clientForm, idNumber: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Dirección</label>
              <input
                type="text"
                className="form-control"
                value={clientForm.address}
                onChange={(e) => setClientForm({ ...clientForm, address: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-success">Actualizar</button>
            <button type="button" className="btn btn-secondary ml-2" onClick={() => setEditClient(null)}>Cancelar</button>
          </form>
        </div>
      )}

      <h2>Préstamos</h2>
      <LoanSearch />
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
              <td>{loan.clientId ? loan.clientId.name : "Cliente no encontrado"}</td>
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
                onChange={(e) => setLoanForm({ ...loanForm, interestRate: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Plazo</label>
              <input
                type="number"
                className="form-control"
                value={loanForm.term}
                onChange={(e) => setLoanForm({ ...loanForm, term: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Frecuencia</label>
              <input
                type="text"
                className="form-control"
                value={loanForm.frequency}
                onChange={(e) => setLoanForm({ ...loanForm, frequency: e.target.value })} />
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

export default Dashboard;
