import React, { useState } from 'react';

interface SearchResult {
  id: number;
  name: string;
  launchDate: string;
  landingDate: string;
  launchSite: string;
  landingSite: string;
  crewMembers: string[];
}

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://jjxhzny-m2.wsr.ru/api-kosmos/search?q=${encodeURIComponent(searchTerm)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to search');
      
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Ошибка при выполнении поиска');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Поиск миссий и пилотов</h1>

          <div className="flex gap-4 mb-8">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Введите поисковый запрос..."
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Поиск...' : 'Найти'}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{result.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">
                      Дата запуска: {new Date(result.launchDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">Место запуска: {result.launchSite}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">
                      Дата посадки: {new Date(result.landingDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">Место посадки: {result.landingSite}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="font-semibold text-gray-700">Экипаж:</h3>
                  <ul className="list-disc list-inside">
                    {result.crewMembers.map((member, index) => (
                      <li key={index} className="text-gray-600">{member}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
            {results.length === 0 && searchTerm && !isLoading && (
              <p className="text-gray-600 text-center py-4">Ничего не найдено</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;