import { useState, useEffect } from 'react';
import { getCategories } from '../../services/api';

function TaskForm({ task, onSubmit, onCancel }) {
  const [title, setTitle] = useState(task ? task.title : '');
  const [description, setDescription] = useState(task ? (task.description || '') : '');
  const [status, setStatus] = useState(task ? task.status : 'todo');
  const [categoryId, setCategoryId] = useState(task ? (task.category_id || '') : '');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.data);
      } catch (err) {
        setValidationError('Failed to load categories');
      }
    };
    loadCategories();
  }, []);

  const handleRandom = () => {
    const randomTitles = [
      'Fix login bug', 'Update documentation', 'Review PR #42', 'Write unit tests',
      'Refactor auth middleware', 'Deploy to staging', 'Investigate 500 error',
      'Add input validation', 'Optimize database query', 'Setup CI pipeline',
      'Design new endpoint', 'Update dependencies', 'Write API docs',
      'Fix CORS issue', 'Add error handling', 'Implement pagination',
      'Review security audit', 'Clean up dead code', 'Add logging',
    ];
    const randomDescs = [
      'This needs to be done before the release.',
      'Blocking other team members — high priority.',
      'Part of the sprint goals for this week.',
      'Customer reported this issue.',
      'Found during code review.',
      'Required for the next milestone.',
      '',
    ];
    const statuses = ['todo', 'in_progress', 'done'];
    const randomTitle = randomTitles[Math.floor(Math.random() * randomTitles.length)];
    const randomDesc = randomDescs[Math.floor(Math.random() * randomDescs.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomCategory = categories.length > 0 && Math.random() > 0.3
      ? categories[Math.floor(Math.random() * categories.length)].id
      : '';

    setTitle(randomTitle);
    setDescription(randomDesc);
    setStatus(randomStatus);
    setCategoryId(randomCategory);
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!title.trim()) {
      setValidationError('Title is required');
      return;
    }

    const data = { title: title.trim() };
    if (description.trim()) data.description = description.trim();
    if (status) data.status = status;
    if (categoryId) data.category_id = categoryId;

    setLoading(true);
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">{task ? 'Edit Task' : 'New Task'}</h2>

        {validationError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm mb-4">
            {validationError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task title"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task description (optional)"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            {!task && (
              <button
                type="button"
                onClick={handleRandom}
                className="mr-auto px-4 py-2 text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-md"
              >
                Random Task
              </button>
            )}
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
            >
              {loading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
