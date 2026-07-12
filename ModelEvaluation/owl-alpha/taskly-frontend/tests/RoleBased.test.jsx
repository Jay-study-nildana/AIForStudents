import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../src/context/AuthContext';
import Dashboard from '../src/pages/Dashboard';

// Mock the API module
vi.mock('../src/services/api', () => ({
  getTasks: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
  getCategories: vi.fn(),
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
  getUsers: vi.fn(),
  deleteUser: vi.fn(),
  login: vi.fn(),
  register: vi.fn(),
}));

import { getTasks } from '../src/services/api';

const mockTasks = {
  data: [
    {
      id: '1',
      title: 'Own Task',
      description: 'My task',
      status: 'todo',
      user_id: 'user-1',
      category_id: null,
      created_at: '2026-06-25T00:00:00.000Z',
      updated_at: '2026-06-25T00:00:00.000Z',
      owner: { id: 'user-1', name: 'Current User' },
      category: null,
    },
    {
      id: '2',
      title: 'Others Task',
      description: 'Not my task',
      status: 'in_progress',
      user_id: 'user-2',
      category_id: null,
      created_at: '2026-06-25T00:00:00.000Z',
      updated_at: '2026-06-25T00:00:00.000Z',
      owner: { id: 'user-2', name: 'Other User' },
      category: null,
    },
  ],
};

const renderDashboard = (userRole = 'user') => {
  const user = { id: 'user-1', name: 'Test User', email: 'test@test.com', role: userRole };
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <AuthProvider value={{ user, token: 'fake-token', isAuthenticated: true, userRole, login: vi.fn(), register: vi.fn(), logout: vi.fn(), loading: false }}>
        <Dashboard />
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('Role-Based Rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getTasks.mockResolvedValue(mockTasks);
  });

  it('should show all tasks for admin', async () => {
    renderDashboard('admin');
    await waitFor(() => {
      expect(screen.getByText('Own Task')).toBeDefined();
      expect(screen.getByText('Others Task')).toBeDefined();
    });
  });

  it('should show all tasks for manager', async () => {
    renderDashboard('manager');
    await waitFor(() => {
      expect(screen.getByText('Own Task')).toBeDefined();
      expect(screen.getByText('Others Task')).toBeDefined();
    });
  });

  it('should show New Task button for all authenticated users', async () => {
    renderDashboard('user');
    await waitFor(() => {
      expect(screen.getByText('+ New Task')).toBeDefined();
    });
  });

  it('should show error message on API failure', async () => {
    getTasks.mockRejectedValue(new Error('API Error'));
    renderDashboard('user');
    await waitFor(() => {
      expect(screen.getByText('Failed to load tasks')).toBeDefined();
    });
  });
});
