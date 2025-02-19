import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Gagarin: React.FC = () => {
  const [gagarinInfo, setGagarinInfo] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGagarinInfo = async () => {
      try {
        const response = await fetch('http://jjxhzny-m2.wsr.ru/api-kosmos/gagarin', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch Gagarin information');
        }

        const data = await response.json();
        setGagarinInfo(data.info);
      } catch (err) {
        setError('Ошибка при загрузке информации о Гагарине');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGagarinInfo();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Ошибка!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Юрий Гагарин</h1>
          <div className="prose max-w-none">
            <p className="text-gray-600 leading-relaxed">{gagarinInfo}</p>
          </div>
          <button
            onClick={() => navigate('/missions')}
            className="mt-8 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            К списку миссий
          </button>
        </div>
      </div>
    </div>
  );
};

export default Gagarin;