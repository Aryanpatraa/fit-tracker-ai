import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, Apple, LineChart, User, LogOut, Home, Menu } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { logout, user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Home size={20} /> },
    { name: 'Workouts', path: '/workouts', icon: <Activity size={20} /> },
    { name: 'Meals', path: '/meals', icon: <Apple size={20} /> },
    { name: 'Progress', path: '/progress', icon: <LineChart size={20} /> },
    { name: 'Profile', path: '/profile', icon: <User size={20} /> },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden glass fixed top-0 w-full z-50 flex items-center justify-between p-4 border-b border-gray-700">
        <div className="font-bold text-xl text-primary font-outfit">FitTracker AI</div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white">
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <nav className={`fixed top-0 left-0 h-full w-64 glass z-40 transform transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="hidden md:block font-bold text-2xl mb-10 text-primary font-outfit">FitTracker AI</div>
          
          <div className="flex-1 space-y-2">
            {navItems.map((item) => (
              <NavLink 
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => 
                  `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-gray-400 hover:text-white hover:bg-surface-light'
                  }`
                }
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </div>

          <div className="mt-auto border-t border-gray-700 pt-6">
            <div className="flex items-center space-x-3 mb-6 px-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-gray-400">Pro Member</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="flex items-center w-full space-x-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
