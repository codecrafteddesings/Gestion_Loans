import { render, screen } from '@testing-library/react';
import App from '../App'; // Ajusta la ruta según la ubicación de App.js

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
