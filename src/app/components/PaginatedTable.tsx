import React, { useState, useEffect } from 'react';
import { FiDownload } from 'react-icons/fi';

const PaginatedTable: React.FC = () => {
  const [data, setData] = useState<{ id: number; name: string; value: number }[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: '',
    minValue: '',
    maxValue: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const query = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          ...filters,
        }).toString();

        const response = await fetch(`/api/data?${query}`);
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page, limit, filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    setPage(1);
  };

  const exportToCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      data.map((item) => `${item.id},${item.name},${item.value}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Filtered Data</h2>
        <button
          onClick={exportToCSV}
          className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-600"
        >
          <FiDownload size={18} /> Export to CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm mb-2">Category:</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="border px-2 py-1 w-full"
          >
            <option value="">All</option>
            <option value="users">Users</option>
            <option value="posts">Posts</option>
            <option value="comments">Comments</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-2">Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="border px-2 py-1 w-full"
          />
        </div>
        <div>
          <label className="block text-sm mb-2">End Date:</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="border px-2 py-1 w-full"
          />
        </div>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Value</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                <td className="border border-gray-300 px-4 py-2">{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PaginatedTable;
