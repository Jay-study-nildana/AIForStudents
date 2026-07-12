import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

vi.mock('../src/services/api', () => ({
  getCategories: vi.fn().mockResolvedValue({
    success: true,
    data: [
      { id: 'cat-1', name: 'Work' },
      { id: 'cat-2', name: 'Personal' },
    ],
  }),
  createTask: vi.fn(),
  updateTask: vi.fn(),
}));

import TaskForm from '../src/components/tasks/TaskForm';
import { getCategories } from '../src/services/api';

describe('TaskForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the new task form with all fields', async () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(<TaskForm onSubmit={onSubmit} onCancel={onCancel} />);

    expect(screen.getByText('New Task')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter task title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter task description (optional)')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Todo')).toBeInTheDocument();
    expect(screen.getByText('Create Task')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Work')).toBeInTheDocument();
      expect(screen.getByText('Personal')).toBeInTheDocument();
    });
  });

  it('shows validation error when title is empty', async () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(<TaskForm onSubmit={onSubmit} onCancel={onCancel} />);

    fireEvent.click(screen.getByText('Create Task'));

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with form data when creating', async () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(<TaskForm onSubmit={onSubmit} onCancel={onCancel} />);

    fireEvent.change(screen.getByPlaceholderText('Enter task title'), {
      target: { value: 'Test Task' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter task description (optional)'), {
      target: { value: 'Test description' },
    });

    await waitFor(() => {
      expect(screen.getByText('Work')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Create Task'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Task',
          description: 'Test description',
        })
      );
    });
  });

  it('renders in edit mode with pre-filled data', () => {
    const existingTask = {
      id: 'task-1',
      title: 'Existing Task',
      description: 'Existing description',
      status: 'in_progress',
      category_id: 'cat-1',
    };

    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(<TaskForm task={existingTask} onSubmit={onSubmit} onCancel={onCancel} />);

    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Update Task')).toBeInTheDocument();
  });

  it('calls onCancel when Cancel button is clicked', () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(<TaskForm onSubmit={onSubmit} onCancel={onCancel} />);

    fireEvent.click(screen.getByText('Cancel'));

    expect(onCancel).toHaveBeenCalledOnce();
  });
});
