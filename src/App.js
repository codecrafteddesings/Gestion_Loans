import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import LoanRequest from './components/LoanRequest';
import Payments from './components/Payments';
import AmortizationCalculator from './components/Amortization';
import DefaultedLoans from './components/DefaultedLoans';
import LateLoans from './components/LateLoans';
import Loans from './components/Loans';
import Users from './components/Users';
import OverdueLoans from './components/OverdueLoans';
import UserManagement from './components/UserManagement';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">Aplicación de Préstamos</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Registro de Cliente</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/loan-request">Solicitud de Préstamo</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/payments">Pagos</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/amortization-calculator">Cálculo de Amortización</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/defaulted-loans">Préstamos en Mora</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/late-loans">Préstamos en Atraso</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/loans">Préstamos</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/users">Usuarios</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/overdue-loans">Préstamos Atrasados</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/user-management">Gestión de Usuarios</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/loan-request" element={<LoanRequest />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/amortization-calculator" element={<AmortizationCalculator />} />
            <Route path="/defaulted-loans" element={<DefaultedLoans />} />
            <Route path="/late-loans" element={<LateLoans />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/users" element={<Users />} />
            <Route path="/overdue-loans" element={<OverdueLoans />} />
            <Route path="/user-management" element={<UserManagement />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
