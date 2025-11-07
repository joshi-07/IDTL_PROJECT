import { useState, useEffect } from 'react';
import NoticeCard from './NoticeCard';

const NoticeList = ({ notices, isAdmin = false, onEdit, onDelete }) => {
  const [filteredNotices, setFilteredNotices] = useState(notices);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    let filtered = notices;

    if (searchTerm) {
      filtered = filtered.filter(notice =>
        notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (departmentFilter) {
      filtered = filtered.filter(notice => notice.department === departmentFilter);
    }

    if (typeFilter) {
      filtered = filtered.filter(notice => notice.type === typeFilter);
    }

    setFilteredNotices(filtered);
  }, [notices, searchTerm, departmentFilter, typeFilter]);

  const departments = [...new Set(notices.map(notice => notice.department))];
  const types = [...new Set(notices.map(notice => notice.type))];

  return (
    <div>
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search notices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <button
            onClick={() => {
              setSearchTerm('');
              setDepartmentFilter('');
              setTypeFilter('');
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredNotices.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No notices found matching your criteria.</p>
          </div>
        ) : (
          filteredNotices.map(notice => (
            <NoticeCard
              key={notice._id}
              notice={notice}
              isAdmin={isAdmin}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NoticeList;
