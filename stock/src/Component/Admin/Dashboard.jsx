"use client"

import { useState, useEffect } from "react"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import Navbar from "./Navbar"
import { useNavigate } from "react-router-dom"

// Service pour les appels API
const ApiService = {
  async getUsersCount() {
    const response = await fetch("http://localhost:8082/api/utilisateurs/count")
    return await response.json()
  },

  async getDemandsCount() {
    const response = await fetch("http://localhost:8082/api/demandes/count")
    return await response.json()
  },

  async getArticlesCount() {
    const response = await fetch("http://localhost:8082/api/articles/count")
    return await response.json()
  },

  // Nouvelles méthodes pour récupérer les données réelles
  async getDemandsData() {
    const response = await fetch("http://localhost:8082/api/demandes")
    return await response.json()
  },

  async getArticlesData() {
    const response = await fetch("http://localhost:8082/api/articles")
    return await response.json()
  },

  async getUsersData() {
    const response = await fetch("http://localhost:8082/api/utilisateurs")
    return await response.json()
  },
}

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    demands: 0,
    articles: 0,
  })

  // Nouveaux états pour les données réelles
  const [demandsValidationData, setDemandsValidationData] = useState([])
  const [articlesStockData, setArticlesStockData] = useState([])
  const [articlesCategoryData, setArticlesCategoryData] = useState([])
  const [usersRoleData, setUsersRoleData] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Fonction pour traiter les données des demandes par validation
  const processDemandsValidationData = (demands) => {
    const validationCounts = { V: 0, NV: 0, "PAS ENCORE": 0 }

    demands.forEach((demand) => {
      if (demand.validation === "V") validationCounts.V++
      else if (demand.validation === "NV") validationCounts.NV++
      else validationCounts["PAS ENCORE"]++
    })

    return [
      { name: "V", value: validationCounts.V, color: "#10B981" },
      { name: "NV ", value: validationCounts.NV, color: "#EF4444" },
      { name: "En Attente", value: validationCounts["PAS ENCORE"], color: "#F59E0B" },
    ]
  }

  // Fonction pour traiter les données des articles par catégorie
  const processArticlesCategoryData = (articles) => {
    const categoryCount = {}

    articles.forEach((article) => {
      const category = article.categorie || "Non définie"
      categoryCount[category] = (categoryCount[category] || 0) + 1
    })

    return Object.entries(categoryCount).map(([name, value]) => ({
      name,
      value,
    }))
  }

  // Fonction pour traiter les données de stock des articles
  const processArticlesStockData = (articles) => {
    const stockLevels = { "Stock Faible": 0, "Stock Moyen": 0, "Stock Bon": 0 }

    articles.forEach((article) => {
      const stock = article.stock || 0
      if (stock <= 5) stockLevels["Stock Faible"]++
      else if (stock <= 20) stockLevels["Stock Moyen"]++
      else stockLevels["Stock Bon"]++
    })

    return [
      { name: "Faible", value: stockLevels["Stock Faible"], color: "#EF4444" },
      { name: "Moyen", value: stockLevels["Stock Moyen"], color: "#F59E0B" },
      { name: "Bon", value: stockLevels["Stock Bon"], color: "#10B981" },
    ]
  }

  // Fonction pour traiter les données des utilisateurs par rôle
  const processUsersRoleData = (users) => {
    const roleCount = {}

    users.forEach((user) => {
      const role = user.role || "Non défini"
      roleCount[role] = (roleCount[role] || 0) + 1
    })

    return Object.entries(roleCount).map(([name, value]) => ({
      name,
      value,
    }))
  }

  // Récupérer toutes les données réelles
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Récupérer les compteurs
        const [usersCount, demandsCount, articlesCount] = await Promise.all([
          ApiService.getUsersCount(),
          ApiService.getDemandsCount(),
          ApiService.getArticlesCount(),
        ])

        // Récupérer les données détaillées
        const [demandsData, articlesData, usersData] = await Promise.all([
          ApiService.getDemandsData(),
          ApiService.getArticlesData(),
          ApiService.getUsersData(),
        ])

        setStats({
          users: usersCount,
          demands: demandsCount,
          articles: articlesCount,
        })

        // Traiter les données pour les graphiques
        setDemandsValidationData(processDemandsValidationData(demandsData))
        setArticlesCategoryData(processArticlesCategoryData(articlesData))
        setArticlesStockData(processArticlesStockData(articlesData))
        setUsersRoleData(processUsersRoleData(usersData))

        setLoading(false)
      } catch (err) {
        setError("Erreur lors du chargement des données. Veuillez réessayer.")
        setLoading(false)
        console.error(err)
      }
    }

    fetchData()

    // Actualiser les données toutes les 5 minutes
    const interval = setInterval(fetchData, 300000)
    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num
  }

  // Composant personnalisé pour les tooltips
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-800 font-medium">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="flex min-h-screen">
      {/* Barre de navigation latérale fixe */}
      <div className="fixed left-0 top-0 bottom-0 z-20">
        <Navbar />
      </div>

      {/* Contenu principal avec marge pour la navbar */}
      <div className="flex-1 flex flex-col ml-0 lg:ml-72">
        {/* Contenu du dashboard */}
        <div className="min-h-screen p-4 md:p-6 ">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Tableau de bord Admin </h1>
              <p className="text-gray-600 mt-1 md:mt-2">Vue d'ensemble du système de gestion de stock</p>
            </div>

            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
              {/* Carte Utilisateurs */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 md:p-6 border-l-4 border-blue-500">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 md:p-3 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 md:h-8 w-6 md:w-8 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base md:text-lg font-medium text-gray-500">Utilisateurs</h3>
                    {loading ? (
                      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
                    ) : (
                      <p className="text-2xl md:text-3xl font-bold text-gray-800">{formatNumber(stats.users)}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Carte Demandes d'achat */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 md:p-6 border-l-4 border-green-500">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 md:p-3 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 md:h-8 w-6 md:w-8 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base md:text-lg font-medium text-gray-500">Demandes d'achat</h3>
                    {loading ? (
                      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
                    ) : (
                      <p className="text-2xl md:text-3xl font-bold text-gray-800">{formatNumber(stats.demands)}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Carte Articles */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 md:p-6 border-l-4 border-purple-500">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-2 md:p-3 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 md:h-8 w-6 md:w-8 text-purple-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base md:text-lg font-medium text-gray-500">Articles</h3>
                    {loading ? (
                      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
                    ) : (
                      <p className="text-2xl md:text-3xl font-bold text-gray-800">{formatNumber(stats.articles)}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">{error}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Graphique 1: Validation des demandes */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg md:text-xl font-bold text-gray-800">État des Demandes</h2>
                  <div className="text-sm text-gray-500">Total: {stats.demands}</div>
                </div>
                <div className="h-64 md:h-72">
                  {loading ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-gray-500">Chargement des données...</div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={demandsValidationData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent, value }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          fontSize={12}
                          fontWeight="bold"
                        >
                          {demandsValidationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          formatter={(value, entry) => `${value}: ${entry.payload.value}`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Graphique 2: Répartition des articles par catégorie */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg md:text-xl font-bold text-gray-800">Articles par Catégorie</h2>
                  <div className="text-sm text-gray-500">Total: {stats.articles}</div>
                </div>
                <div className="h-64 md:h-72">
                  {loading ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-gray-500">Chargement des données...</div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={articlesCategoryData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          dataKey="name"
                          stroke="#666"
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          fontSize={11}
                          interval={0}
                        />
                        <YAxis stroke="#666" />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Graphique 3: État du stock */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg md:text-xl font-bold text-gray-800">État du Stock</h2>
                  <div className="text-sm text-gray-500">Articles: {stats.articles}</div>
                </div>
                <div className="h-64 md:h-72">
                  {loading ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-gray-500">Chargement des données...</div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={articlesStockData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent, value }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={80}
                          innerRadius={40}
                          fill="#8884d8"
                          dataKey="value"
                          fontSize={12}
                          fontWeight="bold"
                        >
                          {articlesStockData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
                {!loading && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                      {articlesStockData.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></div>
                          <span className="text-gray-600">
                            {item.name}:{" "}
                            <span className="font-medium" style={{ color: item.color }}>
                              {item.value}
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Graphique 4: Répartition des utilisateurs par rôle */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg md:text-xl font-bold text-gray-800">Utilisateurs par Rôle</h2>
                  <div className="text-sm text-gray-500">Total: {stats.users}</div>
                </div>
                <div className="h-64 md:h-72">
                  {loading ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-gray-500">Chargement des données...</div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={usersRoleData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          dataKey="name"
                          stroke="#666"
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          fontSize={11}
                          interval={0}
                        />
                        <YAxis stroke="#666" />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Section de statistiques supplémentaires */}
            <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 md:p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Résumé des Validations</h3>
                <div className="space-y-3">
                  {loading
                    ? Array(3)
                        .fill(0)
                        .map((_, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                          </div>
                        ))
                    : demandsValidationData.map((item, index) => (
                        <div key={index} className="flex justify-between items-center pb-2 border-b">
                          <span className="text-gray-600">{item.name}:</span>
                          <span className="text-sm font-medium" style={{ color: item.color }}>
                            {item.value}
                          </span>
                        </div>
                      ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 md:p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">État du Stock</h3>
                <div className="space-y-3">
                  {loading
                    ? Array(3)
                        .fill(0)
                        .map((_, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                          </div>
                        ))
                    : articlesStockData.map((item, index) => (
                        <div key={index} className="flex justify-between items-center pb-2 border-b">
                          <span className="text-gray-600">{item.name}:</span>
                          <span className="text-sm font-medium" style={{ color: item.color }}>
                            {item.value}
                          </span>
                        </div>
                      ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 md:p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Activité récente</h3>
                <div className="space-y-3">
                  {loading ? (
                    Array(4)
                      .fill(0)
                      .map((_, i) => (
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
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-gray-800">Données mises à jour</p>
                          <p className="text-xs text-gray-500">Maintenant</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-gray-800">Statistiques calculées</p>
                          <p className="text-xs text-gray-500">Il y a 1 minute</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-purple-100 p-2 rounded-full mr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-purple-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-gray-800">Graphiques générés</p>
                          <p className="text-xs text-gray-500">Il y a 2 minutes</p>
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
  )
}

export default Dashboard
