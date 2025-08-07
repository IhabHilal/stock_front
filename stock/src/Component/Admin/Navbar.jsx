import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  DocumentTextIcon, 
  ShoppingCartIcon, 
  UserCircleIcon, 
  ArrowLeftOnRectangleIcon,
  XMarkIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: ChartBarIcon, path: '/dash-admin' },
    { name: 'Utilisateurs', icon: UserGroupIcon, path: '/utilisateurs' },
    { name: 'Articles', icon: DocumentTextIcon, path: '/articles' },
    { name: 'DemandeAchats', icon: ShoppingCartIcon, path: '/demandes-achat' },
    { name: 'Profile', icon: UserCircleIcon, path: '/prof-admin' },
  ];

  const handleLogout = () => {
    // Logique de déconnexion
    console.log('Déconnexion effectuée');
    navigate('/auth');
  };

  return (
    <>
      {/* Bouton mobile */}
      <button 
        className="fixed top-4 left-4 z-50 p-2 bg-indigo-600 rounded-lg text-white lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <div className={`fixed inset-0 z-40 bg-gray-900 bg-opacity-75 transition-opacity lg:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="fixed inset-0 flex">
          <div 
            className={`relative w-80 max-w-sm bg-white transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          >
            <div className="flex items-center justify-between p-5 border-b">
              <div className="flex items-center">
                <div className="bg-indigo-600 text-white p-2 rounded-lg">
                  <ChartBarIcon className="h-6 w-6" />
                </div>
                <h2 className="ml-3 text-l font-bold text-gray-800">Admin</h2>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <nav className="p-4">
              {menuItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center px-4 py-3 mb-2 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-indigo-100 text-indigo-700 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </NavLink>
              ))}
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 mt-10 text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
                LogOut
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Sidebar Desktop */}
      <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <div className="bg-indigo-600 text-white p-2 rounded-lg">
              <ChartBarIcon className="h-6 w-6" />
            </div>
            <h1 className="ml-3 text-xl font-bold text-gray-800">Panel</h1>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center px-4 py-3 mb-2 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-indigo-100 text-indigo-700 font-medium shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 mt-10 text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
            LogOut
          </button>
        </nav>
      </div>
    </>
  );
};

export default Navbar;