import { useState, useEffect } from 'react';
import { getUsers, updateTask } from '../../services/api';

function TaskCard({ task, user, canEdit, canDelete, canChangeStatus, onEdit, onDelete, onStatusChange, onRefresh }) {
  const [status, setStatus] = useState(task.status);
  const [showTransfer, setShowTransfer] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [transferring, setTransferring] = useState(false);
  const [transferError, setTransferError] = useState('');

  const isAdmin = user && user.role === 'admin';

  useEffect(() => {
    if (showTransfer && users.length === 0) {
      const loadUsers = async () => {
        try {
          const data = await getUsers();
          setUsers(data.data);
        } catch (err) {
          setTransferError('Failed to load users');
        }
      };
      loadUsers();
    }
  }, [showTransfer, users.length]);

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    onStatusChange(newStatus);
  };

  const handleTransfer = async () => {
    if (!selectedUserId) {
      setTransferError('Please select a user');
      return;
    }
    setTransferring(true);
    setTransferError('');
    try {
      await updateTask(task.id, { user_id: selectedUserId });
      setShowTransfer(false);
      setSelectedUserId('');
      if (onRefresh) onRefresh();
    } catch (err) {
      setTransferError('Transfer failed');
    } finally {
      setTransferring(false);
    }
  };

  const statusColors = {
    todo: 'bg-gray-100 text-gray-700',
    in_progress: 'bg-yellow-100 text-yellow-700',
    done: 'bg-green-100 text-green-700',
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-500 mt-1">{task.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[task.status] || statusColors.todo}`}>
              {task.status === 'in_progress' ? 'In Progress' : (task.status.charAt(0).toUpperCase() + task.status.slice(1))}
            </span>
            {task.category && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                {task.category.name}
              </span>
            )}
            {task.owner && (
              <span className="text-xs text-gray-400">
                by {task.owner.name}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {canChangeStatus && (
            <select
              value={status}
              onChange={handleStatusChange}
              className="text-xs px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          )}
          {canEdit && (
            <button
              onClick={onEdit}
              className="text-xs px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md font-medium"
            >
              Edit
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => { setShowTransfer(!showTransfer); setTransferError(''); }}
              className="text-xs px-3 py-1 text-orange-600 hover:bg-orange-50 rounded-md font-medium"
            >
              Transfer
            </button>
          )}
          {canDelete && (
            <button
              onClick={onDelete}
              className="text-xs px-3 py-1 text-red-600 hover:bg-red-50 rounded-md font-medium"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Transfer panel */}
      {showTransfer && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="flex-1 text-xs px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select new owner...</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role}) {u.id === task.user_id ? '(current)' : ''}
                </option>
              ))}
            </select>
            <button
              onClick={handleTransfer}
              disabled={transferring}
              className="text-xs px-3 py-1 text-white bg-orange-600 hover:bg-orange-700 rounded-md font-medium disabled:opacity-50"
            >
              {transferring ? 'Transferring...' : 'Confirm'}
            </button>
            <button
              onClick={() => { setShowTransfer(false); setSelectedUserId(''); setTransferError(''); }}
              className="text-xs px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-md font-medium"
            >
              Cancel
            </button>
          </div>
          {transferError && (
            <p className="text-xs text-red-600 mt-1">{transferError}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default TaskCard;
