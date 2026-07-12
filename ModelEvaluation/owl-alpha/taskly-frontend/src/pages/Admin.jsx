import { useState, useEffect } from 'react';
import { getUsers, deleteUser, getCategories, createCategory, updateCategory, deleteCategory } from '../services/api';

function Admin() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersData, categoriesData] = await Promise.all([getUsers(), getCategories()]);
      setUsers(usersData.data);
      setCategories(categoriesData.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await deleteUser(id);
      fetchData();
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await createCategory({ name: newCategoryName });
      setNewCategoryName('');
      fetchData();
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Failed to create category';
      setError(message);
    }
  };

  const handleUpdateCategory = async (data) => {
    try {
      await updateCategory(editingCategory.id, data);
      setEditingCategory(null);
      fetchData();
    } catch (err) {
      setError('Failed to update category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await deleteCategory(id);
      fetchData();
    } catch (err) {
      setError('Failed to delete category');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Panel</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-4">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'categories'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Categories
          </button>
        </nav>
      </div>

      {/* Loading */}
      {loading && <div className="text-center py-8 text-gray-500">Loading...</div>}

      {/* Users Tab */}
      {!loading && activeTab === 'users' && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{u.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{u.role}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{u.created_at}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      disabled={u.role === 'admin'}
                      className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Categories Tab */}
      {!loading && activeTab === 'categories' && (
        <div>
          {/* Create form */}
          <form onSubmit={handleCreateCategory} className="flex gap-2 mb-4">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="New category name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Add
            </button>
          </form>

          {/* Category list */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {categories.map((category) => (
                <li key={category.id} className="px-6 py-4 flex items-center justify-between">
                  {editingCategory?.id === category.id ? (
                    <form
                      onSubmit={(e) => { e.preventDefault(); handleUpdateCategory({ name: e.target.name.value }); }}
                      className="flex gap-2 flex-1"
                    >
                      <input
                        name="name"
                        defaultValue={category.name}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                      <button type="submit" className="text-blue-600 text-sm font-medium">Save</button>
                      <button type="button" onClick={() => setEditingCategory(null)} className="text-gray-500 text-sm font-medium">Cancel</button>
                    </form>
                  ) : (
                    <>
                      <span className="text-sm font-medium text-gray-900">{category.name}</span>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => setEditingCategory(category)} className="text-blue-600 text-sm font-medium">Edit</button>
                        <button onClick={() => handleDeleteCategory(category.id)} className="text-red-600 text-sm font-medium">Delete</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
