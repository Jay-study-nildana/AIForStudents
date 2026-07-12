function AdminTabs({ activeTab, setActiveTab }) {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex space-x-8">
        <button
          onClick={() => setActiveTab('users')}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'users' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'categories' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'
          }`}
        >
          Categories
        </button>
      </nav>
    </div>
  );
}

export default AdminTabs;
