import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login page for unauthenticated users', () => {
  render(<App />);
  const loginButton = screen.getByRole('button', { name: /entrar/i });
  expect(loginButton).toBeInTheDocument();
});
