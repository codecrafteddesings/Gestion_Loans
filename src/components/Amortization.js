import React, { useState } from "react";

const Amortization = () => {
  const [form, setForm] = useState({
    amount: "",
    interestRate: "",
    term: "",
    frequency: "daily",
  });
  const [schedule, setSchedule] = useState([]);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { amount, interestRate, term, frequency } = form;
    const principal = parseFloat(amount);
    const annualRate = parseFloat(interestRate) / 100;
    let n, rate;

    switch (frequency) {
      case "daily":
        n = term;
        rate = annualRate / 365;
        break;
      case "weekly":
        n = term * 4;
        rate = annualRate / 52;
        break;
      case "biweekly":
        n = term * 2;
        rate = annualRate / 26;
        break;
      case "monthly":
        n = term;
        rate = annualRate / 12;
        break;
      default:
        n = term;
        rate = annualRate / 365;
    }

    const payment = (principal * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);

    const newSchedule = [];
    let balance = principal;

    for (let i = 1; i <= n; i++) {
      const interest = balance * rate;
      const principalPayment = payment - interest;
      balance -= principalPayment;

      newSchedule.push({
        paymentNumber: i,
        payment: payment.toFixed(2),
        principal: principalPayment.toFixed(2),
        interest: interest.toFixed(2),
        balance: balance.toFixed(2),
      });
    }
    setSchedule(newSchedule);
    setMessage(`El monto total a pagar es: ${payment.toFixed(2)}`);
  };

  return (
    <div className="container mt-5">
      <div className="jumbotron text-center">
        <h1 className="display-4">Cálculo de Amortización</h1>
        <p className="lead">
          Complete el formulario para calcular la amortización del préstamo
        </p>
      </div>
      <form onSubmit={handleSubmit}>
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
          Calcular Amortización
        </button>
      </form>
      {message && <div className="alert alert-info mt-3">{message}</div>}
      {schedule.length > 0 && (
        <div className="mt-5">
          <h2>Tabla de Amortización</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th># Pago</th>
                <th>Pago</th>
                <th>Principal</th>
                <th>Interés</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((payment, index) => (
                <tr key={index}>
                  <td>{payment.paymentNumber}</td>
                  <td>{payment.payment}</td>
                  <td>{payment.principal}</td>
                  <td>{payment.interest}</td>
                  <td>{payment.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Amortization;