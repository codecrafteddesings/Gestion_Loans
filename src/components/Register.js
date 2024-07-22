import axios from "axios";
import React, { useState } from "react";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    idNumber: "",
    address: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/api
/clientes/register`,
        form
      );
      setMessage("Cliente registrado con éxito.");
    } catch (error) {
      setMessage("Error al registrar el cliente.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="jumbotron text-center">
        <h1 className="display-4">Registro de Cliente</h1>
        <p className="lead">
          Complete el formulario para registrar un nuevo cliente
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Nombre
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Correo Electrónico
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Teléfono
          </label>
          <input
            type="text"
            className="form-control"
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="idNumber" className="form-label">
            Cédula
          </label>
          <input
            type="text"
            className="form-control"
            id="idNumber"
            name="idNumber"
            value={form.idNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">
            Dirección
          </label>
          <input
            type="text"
            className="form-control"
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Registrar Cliente
        </button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default Register;
