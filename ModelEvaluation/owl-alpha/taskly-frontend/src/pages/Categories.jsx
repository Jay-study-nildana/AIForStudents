import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api';
import CategoryForm from '../components/categories/CategoryForm';

function Categories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const canManage = user?.role === 'manager' || user?.role === 'admin';

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data.data);
    } catch (err) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (data) => {
    try {
      await createCategory(data);
      setShowForm(false);
      fetchCategories();
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Failed to create category';
      setError(message);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateCategory(editingCategory.id, data);
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Failed to update category';
      setError(message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await deleteCategory(id);
      fetchCategories();
    } catch (err) {
      setError('Failed to delete category');
    }
  };

  if (!canManage) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-8 text-gray-500">Access denied. Manager or Admin role required.</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          + New Category
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-4">
          {error}
        </div>
      )}

      {loading && <div className="text-center py-8 text-gray-500">Loading categories...</div>}

      {!loading && categories.length === 0 && (
        <div className="text-center py-8 text-gray-500">No categories found</div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {categories.map((category) => (
            <li key={category.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-900">{category.name}</p>
                <p className="text-xs text-gray-500">{category.created_at}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingCategory(category)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {(showForm || editingCategory) && (
        <CategoryForm
          category={editingCategory}
          onSubmit={editingCategory ? handleUpdate : handleCreate}
          onCancel={() => { setShowForm(false); setEditingCategory(null); }}
        />
      )}
    </div>
  );
}

export default Categories;
