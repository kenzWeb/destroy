import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Trash2, Edit } from 'lucide-react';

interface Mission {
  id: number;
  name: string;
  launchDate: string;
  landingDate: string;
  launchSite: string;
  launchLatitude: number;
  launchLongitude: number;
  landingSite: string;
  landingLatitude: number;
  landingLongitude: number;
  lunarModule: string;
  commandModule: string;
  crewMembers: string[];
}

const Missions: React.FC = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [openMissionId, setOpenMissionId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchMissions = async () => {
    try {
      const response = await fetch('http://jjxhzny-m2.wsr.ru/api-kosmos/missions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch missions');
      const data = await response.json();
      setMissions(data);
    } catch {
      setError('Ошибка при загрузке миссий');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту миссию?')) return;

    try {
      const response = await fetch(`http://jjxhzny-m2.wsr.ru/api-kosmos/missions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete mission');
      await fetchMissions();
    } catch {
      setError('Ошибка при удалении миссии');
    }
  };

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Миссии</h1>
        <button
          onClick={() => navigate('/missions/create')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Добавить миссию
        </button>
      </div>

      <div className="space-y-4">
        {missions.map((mission) => (
          <div key={mission.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div
              className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
              onClick={() => setOpenMissionId(openMissionId === mission.id ? null : mission.id)}
            >
              <h2 className="text-xl font-semibold text-gray-800">{mission.name}</h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/missions/edit/${mission.id}`);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(mission.id);
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={20} />
                </button>
                {openMissionId === mission.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>

            {openMissionId === mission.id && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Информация о запуске</h3>
                    <p>Дата запуска: {new Date(mission.launchDate).toLocaleDateString()}</p>
                    <p>Место запуска: {mission.launchSite}</p>
                    <p>Координаты: {mission.launchLatitude}, {mission.launchLongitude}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Информация о посадке</h3>
                    <p>Дата посадки: {new Date(mission.landingDate).toLocaleDateString()}</p>
                    <p>Место посадки: {mission.landingSite}</p>
                    <p>Координаты: {mission.landingLatitude}, {mission.landingLongitude}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Космический корабль</h3>
                  <p>Лунный модуль: {mission.lunarModule}</p>
                  <p>Управляющий модуль: {mission.commandModule}</p>
                  <div className="mt-2">
                    <h4 className="font-semibold text-gray-700">Участники миссии:</h4>
                    <ul className="list-disc list-inside">
                      {mission.crewMembers.map((member, index) => (
                        <li key={index}>{member}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Missions;