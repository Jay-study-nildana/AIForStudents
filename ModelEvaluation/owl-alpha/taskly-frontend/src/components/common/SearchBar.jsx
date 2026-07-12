function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search tasks..."
      className="px-3 py-2 border border-gray-300 rounded-md text-sm flex-1 focus:outline-none focus:ring-blue-500"
    />
  );
}

export default SearchBar;
