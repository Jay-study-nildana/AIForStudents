import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../src/context/AuthContext';
import Login from '../src/pages/Login';

// Mock the API module
vi.mock('../src/services/api', () => ({
  login: vi.fn(),
  register: vi.fn(),
}));

import { login } from '../src/services/api';

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render login form', () => {
    renderLogin();
    expect(screen.getByText('Sign in to Taskly')).toBeDefined();
    expect(screen.getByLabelText('Email address')).toBeDefined();
    expect(screen.getByLabelText('Password')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeDefined();
  });

  it('should update form fields on input', () => {
    renderLogin();
    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('should call login API on form submit', async () => {
    login.mockResolvedValue({
      data: {
        user: { id: '1', name: 'Test', email: 'test@example.com', role: 'user' },
        token: 'fake-token',
      },
    });

    renderLogin();
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
    });
  });

  it('should show error message on login failure', async () => {
    login.mockRejectedValue({
      response: { data: { error: { message: 'Invalid email or password' } } },
    });

    renderLogin();
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'wrong@test.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeDefined();
    });
  });

  it('should show loading state during submit', async () => {
    let resolveLogin;
    login.mockImplementation(() => new Promise((resolve) => { resolveLogin = resolve; }));

    renderLogin();
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pass123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(screen.getByText('Signing in...')).toBeDefined();

    // Resolve the login
    resolveLogin({ data: { user: { id: '1', name: 'Test', email: 'test@example.com', role: 'user' }, token: 'fake-token' } });
  });
});
