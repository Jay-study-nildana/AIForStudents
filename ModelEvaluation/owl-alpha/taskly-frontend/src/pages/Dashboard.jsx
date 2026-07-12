import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';
import { canEditTask, canDeleteTask, canChangeStatus } from '../utils/helpers';
import TaskCard from '../components/tasks/TaskCard';
import TaskForm from '../components/tasks/TaskForm';
import TaskFilters from '../components/tasks/TaskFilters';
import Pagination from '../components/common/Pagination';
import SearchBar from '../components/common/SearchBar';

function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category_id = categoryFilter;
      const data = await getTasks(params);
      setTasks(data.data);
      setCurrentPage(1);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, categoryFilter]);

  // Client-side search
  const filteredTasks = tasks.filter((task) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return task.title.toLowerCase().includes(q) || (task.description && task.description.toLowerCase().includes(q));
  });

  // Client-side pagination
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const paginatedTasks = filteredTasks.slice((currentPage - 1) * tasksPerPage, currentPage * tasksPerPage);

  const handleCreate = async (data) => {
    try {
      await createTask(data);
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      setError('Failed to create task');
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateTask(editingTask.id, data);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateTask(id, { status });
      fetchTasks();
    } catch (err) {
      setError('Failed to update status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          + New Task
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-4">
          {error}
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchBar value={search} onChange={setSearch} />
        <TaskFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
        />
      </div>

      {/* Loading */}
      {loading && <div className="text-center py-8 text-gray-500">Loading tasks...</div>}

      {/* Task List */}
      {!loading && paginatedTasks.length === 0 && (
        <div className="text-center py-8 text-gray-500">No tasks found</div>
      )}

      <div className="space-y-4">
        {paginatedTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            user={user}
            canEdit={canEditTask(user, task)}
            canDelete={canDeleteTask(user, task)}
            canChangeStatus={canChangeStatus(user)}
            onEdit={() => setEditingTask(task)}
            onDelete={() => handleDelete(task.id)}
            onStatusChange={(status) => handleStatusChange(task.id, status)}
            onRefresh={fetchTasks}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}

      {/* Create/Edit Form Modal */}
      {(showForm || editingTask) && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdate : handleCreate}
          onCancel={() => { setShowForm(false); setEditingTask(null); }}
        />
      )}
    </div>
  );
}

export default Dashboard;
