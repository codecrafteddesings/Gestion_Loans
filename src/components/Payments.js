import axios from "axios";
import React, { useState, useEffect } from "react";

const Payments = () => {
  const [form, setForm] = useState({
    loanId: "",
    clientId: "",  // Añadir clientId al estado del formulario
    amount: "",
  });
  const [loans, setLoans] = useState([]);
  const [message, setMessage] = useState("");
  const [payments, setPayments] = useState([]);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // Nuevo estado para el término de búsqueda

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/loans`);
        setLoans(response.data);
      } catch (error) {
        console.error("Error fetching loans:", error);
      }
    };

    fetchLoans();
  }, []);

  useEffect(() => {
    if (form.loanId) {
      const fetchPayments = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/payments/loan/${form.loanId}`);
          setPayments(response.data);
          const totalPaid = response.data.reduce((total, payment) => total + payment.amount, 0);
          const loan = loans.find(loan => loan._id === form.loanId);
          if (loan) {
            setRemainingAmount(loan.amount - totalPaid);
            setForm({ ...form, clientId: loan.clientId });  // Establecer clientId en el formulario
          }
        } catch (error) {
          console.error("Error fetching payments:", error);
        }
      };

      fetchPayments();
    }
  }, [form.loanId, loans]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/payments`, form);  // Enviar clientId en el formulario
      setMessage("Pago registrado con éxito.");
      setForm({ loanId: "", clientId: "", amount: "" });
      setPayments([]);
      setRemainingAmount(0);
    } catch (error) {
      setMessage("Error al registrar el pago.");
    }
  };

  const getClientName = (loan) => {
    if (loan && loan.clientId) {
      const { name, email } = loan.clientId;
      return `${name} (${email})`;
    }
    return "Cliente no encontrado";
  };

  const filteredLoans = loans.filter((loan) =>
    getClientName(loan).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <div className="jumbotron text-center">
        <h1 className="display-4">Registro de Pagos</h1>
        <p className="lead">Complete el formulario para registrar un pago</p>
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar préstamo por nombre de cliente o correo electrónico"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="loanId" className="form-label">
            Préstamo
          </label>
          <select
            className="form-control"
            id="loanId"
            name="loanId"
            value={form.loanId}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un préstamo</option>
            {filteredLoans.map((loan) => (
              <option key={loan._id} value={loan._id}>
                {getClientName(loan)} - Monto: {loan.amount}
              </option>
            ))}
          </select>
        </div>
        {form.loanId && (
          <div className="mb-3">
            <label>Cliente</label>
            <p>
              {getClientName(loans.find((loan) => loan._id === form.loanId))}
            </p>
          </div>
        )}
        <div className="mb-3">
          <label htmlFor="amount" className="form-label">
            Monto
          </label>
          <input
            type="number"
            className="form-control"
            id="amount"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Registrar Pago
        </button>
        {message && <p>{message}</p>}
      </form>
      <div className="mt-5">
        <h2>Pagos Realizados</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Monto</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td>{getClientName(loans.find((loan) => loan._id === payment.loanId))}</td>
                <td>{payment.amount}</td>
                <td>{new Date(payment.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3>Monto Restante: {remainingAmount}</h3>
      </div>
    </div>
  );
};

export default Payments;