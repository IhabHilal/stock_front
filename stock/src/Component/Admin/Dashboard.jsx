import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
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
import { NavLink, useNavigate } from 'react-router-dom';


// Service pour les appels API
const ApiService = {
  // Récupérer le nombre d'utilisateurs
  async getUsersCount() {
    const response = await fetch("http://localhost:8082/api/utilisateurs/count");
    return await response.json();
  },

  // Récupérer le nombre de demandes
  async getDemandsCount() {
    const response = await fetch("http://localhost:8082/api/demandes/count");
    return await response.json();
  },

  // Récupérer le nombre d'articles
  async getArticlesCount() {
    const response = await fetch("http://localhost:8082/api/articles/count");
    return await response.json();
  },

  // Récupérer les données mensuelles 
  async getMonthlyData() {
    // Dans une application réelle, vous auriez un endpoint comme /api/statistics/monthly
    const response = await fetch("http://localhost:8082/api/demandes"); // Utilisé comme exemple
    const allData = await response.json();
    
    // Simulation de transformation des données en données mensuelles
    return [
      { month: "Jan", sales: 420, purchases: 250, demands: allData.length > 0 ? allData.length * 1.2 : 120 },
      { month: "Fév", sales: 320, purchases: 149, demands: allData.length > 0 ? allData.length * 1.5 : 150 },
      { month: "Mar", sales: 210, purchases: 990, demands: allData.length > 0 ? allData.length * 1.8 : 180 },
      { month: "Avr", sales: 298, purchases: 410, demands: allData.length > 0 ? allData.length * 1.3 : 130 },
      { month: "Mai", sales: 199, purchases: 490, demands: allData.length > 0 ? allData.length * 1.1 : 110 },
      { month: "Juin", sales: 320, purchases: 380, demands: allData.length > 0 ? allData.length * 1.4 : 140 },
      { month: "Juil", sales: 410, purchases: 320, demands: allData.length > 0 ? allData.length * 1.6 : 160 },
      { month: "Août", sales: 380, purchases: 410, demands: allData.length > 0 ? allData.length * 1.3 : 130 },
      { month: "Sep", sales: 490, purchases: 280, demands: allData.length > 0 ? allData.length * 1.7 : 170 },
      { month: "Oct", sales: 520, purchases: 510, demands: allData.length > 0 ? allData.length * 1.9 : 190 },
      { month: "Nov", sales: 450, purchases: 390, demands: allData.length > 0 ? allData.length * 1.5 : 150 },
      { month: "Déc", sales: 610, purchases: 480, demands: allData.length > 0 ? allData.length * 2.0 : 200 },
    ];
  },

  // Récupérer les données de stock (simulé pour l'exemple)
  async getStockData() {
    // Dans une application réelle, vous auriez un endpoint comme /api/stocks/distribution
    const response = await fetch("http://localhost:8082/api/articles");
    const articles = await response.json();
    
    // Simulation de données de stock basées sur les articles
    if (articles.length > 0) {
      return [
        { name: "Électronique", value: articles.length * 25 },
        { name: "Mobilier", value: articles.length * 15 },
        { name: "Fournitures", value: articles.length * 40 },
        { name: "Matériel", value: articles.length * 20 },
      ];
    }
    
    // Valeurs par défaut si aucun article
    return [
      { name: "Électronique", value: 400 },
      { name: "Mobilier", value: 300 },
      { name: "Fournitures", value: 300 },
      { name: "Matériel", value: 200 },
    ];
  }
};

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

      {/* Sidebar mobile */}
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

      {/* Sidebar Desktop - Fixe et ne défile pas */}
      {/* <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <div className="bg-indigo-600 text-white p-2 rounded-lg">
              <ChartBarIcon className="h-6 w-6" />
            </div>
            <h1 className="ml-3 text-xl font-bold text-gray-800">Panel</h1>
            
          </div>
        </div> */}


        <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center">
              <img 
                src="src\Component\images\exprom.jpeg" 
                alt="Logo" 
                className="h-10 w-auto object-contain" 
              />
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

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    demands: 0,
    articles: 0
  });
  
  const [monthlyData, setMonthlyData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Récupérer les données via les API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les comptes en parallèle
        const [usersCount, demandsCount, articlesCount] = await Promise.all([
          ApiService.getUsersCount(),
          ApiService.getDemandsCount(),
          ApiService.getArticlesCount()
        ]);
        
        // Récupérer les données mensuelles et de stock
        const [monthly, stock] = await Promise.all([
          ApiService.getMonthlyData(),
          ApiService.getStockData()
        ]);
        
        setStats({
          users: usersCount,
          demands: demandsCount,
          articles: articlesCount
        });
        
        setMonthlyData(monthly);
        setStockData(stock);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des données. Veuillez réessayer.");
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
    
    // Rafraîchir les données toutes les 5 minutes
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

  // Fonction pour formater les grands nombres
  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num;
  };

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
    <div className="flex min-h-screen">
      {/* Barre de navigation latérale fixe */}
      <div className="fixed left-0 top-0 bottom-0 z-20">
        <Navbar />
      </div>

      {/* Contenu principal avec marge pour la navbar */}
      <div className="flex-1 flex flex-col ml-0 lg:ml-72">
        {/* Bouton mobile */}
        <button 
          className="lg:hidden mb-4 p-2 bg-indigo-600 rounded-lg text-white"
          onClick={() => setSidebarOpen(true)}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>

        {/* Sidebar mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-gray-900 bg-opacity-75 lg:hidden">
            <div className="fixed inset-0 flex">
              <div className="relative w-80 max-w-sm bg-white transform transition-transform duration-300 ease-in-out">
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
        )}

        {/* Contenu du dashboard */}
        <div className="bg-gray-50 min-h-screen p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 md:mb-10">
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">Tableau de bord</h1>
              <p className="text-sm md:text-base text-gray-600 mt-2">
                Vue d'ensemble du système de gestion de stock
              </p>
            </div>

            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
              {/* Carte Utilisateurs */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 md:p-8 min-h-[120px] md:min-h-[140px] border-l-4 border-blue-500">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 md:p-4 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 md:h-10 w-8 md:w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm md:text-base font-medium text-gray-500">Utilisateurs</h3>
                    {loading ? (
                      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
                    ) : (
                      <p className="text-3xl md:text-4xl font-bold text-gray-800">{formatNumber(stats.users)}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Carte Demandes d'achat */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 md:p-8 min-h-[120px] md:min-h-[140px] border-l-4 border-green-500">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 md:p-4 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 md:h-10 w-8 md:w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm md:text-base font-medium text-gray-500">Demandes d'achat</h3>
                    {loading ? (
                      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
                    ) : (
                      <p className="text-3xl md:text-4xl font-bold text-gray-800">{formatNumber(stats.demands)}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Carte Articles */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 md:p-8 min-h-[120px] md:min-h-[140px] border-l-4 border-purple-500">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 md:p-4 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 md:h-10 w-8 md:w-10 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm md:text-base font-medium text-gray-500">Articles</h3>
                    {loading ? (
                      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
                    ) : (
                      <p className="text-3xl md:text-4xl font-bold text-gray-800">{formatNumber(stats.articles)}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                {error}
              </div>
            )}

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {/* Graphique en courbes - Évolution des ventes */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-0">Évolution des ventes</h2>
                  <div className="flex space-x-1 md:space-x-2">
                    <button className="px-2 md:px-3 py-1 text-xs md:text-sm bg-blue-100 text-blue-700 rounded-lg">Mois</button>
                    <button className="px-2 md:px-3 py-1 text-xs md:text-sm bg-gray-100 text-gray-700 rounded-lg">Trimestre</button>
                    <button className="px-2 md:px-3 py-1 text-xs md:text-sm bg-gray-100 text-gray-700 rounded-lg">Année</button>
                  </div>
                </div>
                <div className="h-72 md:h-80">
                  {loading ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-gray-500">Chargement des données...</div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" stroke="#666" tick={{ fontSize: 12, fill: '#4b5563' }} />
                        <YAxis stroke="#666" tick={{ fontSize: 12, fill: '#4b5563' }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: 12, color: '#4b5563' }} />
                        <Line 
                          type="monotone" 
                          dataKey="sales" 
                          name="Ventes"
                          stroke="#8884d8" 
                          strokeWidth={3}
                          dot={{ r: 6, strokeWidth: 2, stroke: '#8884d8', fill: 'white' }}
                          activeDot={{ r: 8, stroke: '#8884d8', strokeWidth: 2, fill: 'white' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Graphique en aires - Achats mensuels */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-0">Achats mensuels</h2>
                  <div className="flex space-x-1 md:space-x-2">
                    <button className="px-2 md:px-3 py-1 text-xs md:text-sm bg-green-100 text-green-700 rounded-lg">Mois</button>
                    <button className="px-2 md:px-3 py-1 text-xs md:text-sm bg-gray-100 text-gray-700 rounded-lg">Trimestre</button>
                    <button className="px-2 md:px-3 py-1 text-xs md:text-sm bg-gray-100 text-gray-700 rounded-lg">Année</button>
                  </div>
                </div>
                <div className="h-72 md:h-80">
                  {loading ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-gray-500">Chargement des données...</div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyData}>
                        <defs>
                          <linearGradient id="colorPurchases" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" stroke="#666" tick={{ fontSize: 12, fill: '#4b5563' }} />
                        <YAxis stroke="#666" tick={{ fontSize: 12, fill: '#4b5563' }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="purchases"
                          name="Achats"
                          stroke="#82ca9d"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorPurchases)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Graphique en secteurs - Répartition du stock */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-0">Répartition du stock</h2>
                  <button className="px-2 md:px-3 py-1 text-xs md:text-sm bg-purple-100 text-purple-700 rounded-lg w-fit">Détails</button>
                </div>
                <div className="h-72 md:h-80">
                  {loading ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-gray-500">Chargement des données...</div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stockData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={70}
                          innerRadius={40}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {stockData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Legend 
                          layout="vertical" 
                          verticalAlign="middle" 
                          align="right"
                          wrapperStyle={{ fontSize: 12, color: '#4b5563' }}
                          formatter={(value, entry, index) => (
                            <span className="text-xs text-gray-600">{value}</span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Graphique en barres - Comparaison ventes/achats */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-0">Comparaison ventes/achats</h2>
                  <div className="flex space-x-1 md:space-x-2">
                    <button className="px-2 md:px-3 py-1 text-xs md:text-sm bg-indigo-100 text-indigo-700 rounded-lg">Mois</button>
                    <button className="px-2 md:px-3 py-1 text-xs md:text-sm bg-gray-100 text-gray-700 rounded-lg">Trimestre</button>
                    <button className="px-2 md:px-3 py-1 text-xs md:text-sm bg-gray-100 text-gray-700 rounded-lg">Année</button>
                  </div>
                </div>
                <div className="h-72 md:h-80">
                  {loading ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-gray-500">Chargement des données...</div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" stroke="#666" tick={{ fontSize: 12, fill: '#4b5563' }} />
                        <YAxis stroke="#666" tick={{ fontSize: 12, fill: '#4b5563' }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: 12, color: '#4b5563' }} />
                        <Bar dataKey="sales" name="Ventes" fill="#8884d8" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="purchases" name="Achats" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Section de statistiques supplémentaires */}
            <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 md:p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Dernières demandes</h3>
                <div className="space-y-3">
                  {loading ? (
                    Array(3).fill(0).map((_, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      </div>
                    ))
                  ) : stats.demands > 0 ? (
                    <>
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-gray-600">Demande #DA-001</span>
                        <span className="text-sm font-medium text-green-600">Approuvé</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-gray-600">Demande #DA-002</span>
                        <span className="text-sm font-medium text-yellow-600">En attente</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-gray-600">Demande #DA-003</span>
                        <span className="text-sm font-medium text-red-600">Rejeté</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500 text-center py-4">Aucune demande récente</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 md:p-6 md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Activité récente</h3>
                <div className="space-y-3">
                  {loading ? (
                    Array(4).fill(0).map((_, i) => (
                      <div key={i} className="flex items-center">
                        <div className="h-10 w-10 bg-gray-200 rounded-full mr-3 animate-pulse"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-1 animate-pulse"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-gray-800">Nouvel article ajouté</p>
                          <p className="text-xs text-gray-500">Il y a 2 heures</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-gray-800">Demande d'achat approuvée</p>
                          <p className="text-xs text-gray-500">Aujourd'hui, 09:45</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-purple-100 p-2 rounded-full mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-gray-800">Nouvel utilisateur enregistré</p>
                          <p className="text-xs text-gray-500">Hier, 16:30</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;