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

const NavbarE = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    
    { name: 'Articles', icon: DocumentTextIcon, path: '/articlesM' },
    { name: 'DemandeAchats', icon: ShoppingCartIcon, path: '/demandes-achatM' },
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
        className="fixed top-4 left-4 z-50 p-2 bg-gradient-to-r from-gray-700 to-yellow-600 rounded-xl text-white lg:hidden shadow-lg hover:shadow-xl transition-all duration-200"
        onClick={() => setSidebarOpen(true)}
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      {/* Sidebar mobile */}
      <div className={`fixed inset-0 z-40 bg-gray-900 bg-opacity-75 transition-opacity lg:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="fixed inset-0 flex">
          <div 
            className={`relative w-80 max-w-sm bg-gradient-to-b from-white to-amber-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-amber-50">
              <div className="flex items-center">
                <div className="relative">
                  <img 
                    src="src/Component/images/exprom.jpeg" 
                    alt="EXPROM Logo" 
                    className="h-12 w-auto object-contain rounded-lg shadow-md"
                  />
                </div>
                <div className="ml-3">
                  <h2 className="text-lg font-bold bg-gradient-to-r from-gray-700 to-yellow-600 bg-clip-text text-transparent">EXPROM</h2>
                  <p className="text-xs text-gray-600 font-medium">Admin Panel</p>
                </div>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-all"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <nav className="p-6">
              {menuItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center px-4 py-3 mb-3 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-gradient-to-r from-gray-700 to-yellow-600 text-white font-semibold shadow-lg transform scale-105' 
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-amber-100 hover:shadow-md'
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </NavLink>
              ))}
              
              <div className="border-t border-gray-200 pt-6 mt-8">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:shadow-md font-medium"
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
                  Déconnexion
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Sidebar Desktop */}
      {/* Sidebar Desktop */}
<div className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0 bg-gradient-to-b from-white to-amber-50 border-r border-gray-200 shadow-xl">
  {/* Logo */}
  <div className="flex items-center justify-center p-8 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-amber-50">
  <img 
    src="src/Component/images/exprom.jpeg" 
    alt="EXPROM Logo" 
    className="h-16 w-auto object-contain rounded-xl shadow-lg"
  />
</div>


  {/* Contenu principal avec scroll */}
  <div className="flex-1 overflow-y-auto px-6 py-8">
    <div className="space-y-3">
      {menuItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) => 
            `flex items-center px-5 py-4 rounded-xl transition-all duration-200 font-medium ${
              isActive 
                ? 'bg-gradient-to-r from-gray-700 to-yellow-600 text-white shadow-lg transform scale-105' 
                : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-amber-100 hover:shadow-md hover:transform hover:scale-102'
            }`
          }
        >
          <div className={`p-2 rounded-lg mr-4 ${
            ({ isActive }) => isActive 
              ? 'bg-white bg-opacity-20' 
              : 'bg-gradient-to-br from-gray-100 to-amber-100'
          }`}>
            <item.icon className="h-5 w-5" />
          </div>
          <span className="text-sm">{item.name}</span>
        </NavLink>
      ))}
    </div>
  </div>

  {/* Bouton déconnexion fixé en bas */}
  <div className="p-6 border-t border-gray-200">
    <button
      onClick={handleLogout}
      className="w-full flex items-center px-5 py-4 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:shadow-md font-medium group"
    >
      <div className="p-2 rounded-lg mr-4 bg-red-100 group-hover:bg-red-200 transition-colors">
        <ArrowLeftOnRectangleIcon className="h-5 w-5" />
      </div>
      <span className="text-sm">Logout</span>
    </button>
  </div>
</div>

    </>
  );
};

export default NavbarE;