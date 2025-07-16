// src/App.test.js
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders HCIS system', () => {
  render(<App />);
  const element = screen.getByText(/HCIS SYSTEM ACTIVATED/i);
  expect(element).toBeInTheDocument();
});