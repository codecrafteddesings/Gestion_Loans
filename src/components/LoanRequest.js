import axios from "axios";
import React, { useState, useEffect } from "react";

const LoanRequest = () => {
  const [form, setForm] = useState({
    clientId: "",
    amount: "",
    interestRate: "",
    term: "",
    frequency: "daily",
  });
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/clientes`);
        setClientes(response.data);
        setFilteredClientes(response.data); // Initially, show all clients
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClientes();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      setFilteredClientes(
        clientes.filter((cliente) =>
          cliente.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      setFilteredClientes(clientes);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.post(
            `http://localhost:5000/api/loans/request`,
            form
        );
        setMessage("Préstamo solicitado con éxito.");
    } catch (error) {
        setMessage("Error al solicitar el préstamo.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="jumbotron text-center">
        <h1 className="display-4">Solicitud de Préstamo</h1>
        <p className="lead">
          Complete el formulario para solicitar un préstamo
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="search" className="form-label">
            Buscar Cliente
          </label>
          <input
            type="text"
            className="form-control"
            id="search"
            placeholder="Buscar por nombre o correo electrónico"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="clientId" className="form-label">
            Cliente
          </label>
          <select
            className="form-control"
            id="clientId"
            name="clientId"
            value={form.clientId}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un cliente</option>
            {filteredClientes.map((cliente) => (
              <option key={cliente._id} value={cliente._id}>
                {cliente.name} ({cliente.email})
              </option>
            ))}
          </select>
        </div>
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
        <div className="mb-3">
          <label htmlFor="interestRate" className="form-label">
            Tasa de Interés (%)
          </label>
          <input
            type="number"
            className="form-control"
            id="interestRate"
            name="interestRate"
            value={form.interestRate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="term" className="form-label">
            Término (días, Semanas, Quincenal, Meses)
          </label>
          <input
            type="number"
            className="form-control"
            id="term"
            name="term"
            value={form.term}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="frequency" className="form-label">
            Frecuencia
          </label>
          <select
            className="form-control"
            id="frequency"
            name="frequency"
            value={form.frequency}
            onChange={handleChange}
            required
          >
            <option value="daily">Diario</option>
            <option value="weekly">Semanal</option>
            <option value="biweekly">Quincenal</option>
            <option value="monthly">Mensual</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Solicitar Préstamo
        </button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default LoanRequest;