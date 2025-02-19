import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Gagarin from './components/pages/Gagarin';
import Missions from './components/pages/Missions';
import SpaceFlights from './components/pages/SpaceFlights';
import Search from './components/pages/Search';
import MoonOrder from './components/pages/MoonOrder';
import EditMission from './components/pages/EditMission';
import CreateMission from './components/pages/CreateMission';
import CreateFlight from './components/pages/CreateFlight';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-xl font-bold">Космос</div>
            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <Menu size={24} />
              </button>
            </div>
            <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block`}>
              <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0">
                {!isAuthenticated ? (
                  <>
                    <Link to="/login" className="hover:text-blue-200">Вход</Link>
                    <Link to="/register" className="hover:text-blue-200">Регистрация</Link>
                  </>
                ) : (
                  <>
                    <Link to="/gagarin" className="hover:text-blue-200">Гагарин</Link>
                    <Link to="/moon-order" className="hover:text-blue-200">Заказ на Луне</Link>
                    <Link to="/missions" className="hover:text-blue-200">Миссии</Link>
                    <Link to="/flights" className="hover:text-blue-200">Космические рейсы</Link>
                    <Link to="/search" className="hover:text-blue-200">Поиск</Link>
                    <button onClick={handleLogout} className="hover:text-blue-200">Выход</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/gagarin" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/gagarin" />} />
            <Route path="/gagarin" element={isAuthenticated ? <Gagarin /> : <Navigate to="/login" />} />
            <Route path="/missions" element={isAuthenticated ? <Missions /> : <Navigate to="/login" />} />
            <Route path="/missions/edit/:id" element={isAuthenticated ? <EditMission /> : <Navigate to="/login" />} />
            <Route path="/missions/create" element={isAuthenticated ? <CreateMission /> : <Navigate to="/login" />} />
            <Route path="/flights" element={isAuthenticated ? <SpaceFlights /> : <Navigate to="/login" />} />
            <Route path="/flights/create" element={isAuthenticated ? <CreateFlight /> : <Navigate to="/login" />} />
            <Route path="/search" element={isAuthenticated ? <Search /> : <Navigate to="/login" />} />
            <Route path="/moon-order" element={isAuthenticated ? <MoonOrder /> : <Navigate to="/login" />} />
            <Route path="/" element={<Navigate to={isAuthenticated ? "/gagarin" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;