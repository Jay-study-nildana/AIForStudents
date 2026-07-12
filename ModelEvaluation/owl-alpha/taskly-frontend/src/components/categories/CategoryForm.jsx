function CategoryForm({ category, onSubmit, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">{category ? 'Edit Category' : 'New Category'}</h2>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

export default CategoryForm;
