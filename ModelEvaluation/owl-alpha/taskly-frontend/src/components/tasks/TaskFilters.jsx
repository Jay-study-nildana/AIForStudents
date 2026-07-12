function TaskFilters({ statusFilter, setStatusFilter, categoryFilter, setCategoryFilter }) {
  return (
    <div className="flex gap-2">
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
      >
        <option value="">All Status</option>
        <option value="todo">Todo</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </div>
  );
}

export default TaskFilters;
