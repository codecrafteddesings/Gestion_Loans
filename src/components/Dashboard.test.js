import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard'; // Ajusta la ruta según la ubicación de Dashboard.js

test('renders Dashboard component', () => {
  render(<Dashboard />);
  const element = screen.getByText(/Dashboard/i);
  expect(element).toBeInTheDocument();
});
