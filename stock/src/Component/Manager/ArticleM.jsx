"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight, Search, Package, ShoppingCart } from "lucide-react"
import {
  ChartBarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ShoppingCartIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  XMarkIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline"
import { NavLink } from "react-router-dom"
// import Navbar from "./Navbar"

// Composant Navbar
const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  const menuItems = [
    { name: "Articles", icon: DocumentTextIcon, path: "/articlesM" },
    { name: "DemandeAchats", icon: ShoppingCartIcon, path: "/demandes-achatM" },
    { name: "Profile", icon: UserCircleIcon, path: "/prof-admin" },
  ]

  const handleLogout = () => {
    // Logique de déconnexion - vider le localStorage
    localStorage.removeItem("currentUser")
    console.log("Déconnexion effectuée")
    navigate("/auth")
  }

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
      <div
        className={`fixed inset-0 z-40 bg-gray-900 bg-opacity-75 transition-opacity lg:hidden ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <div className="fixed inset-0 flex">
          <div
            className={`relative w-80 max-w-sm bg-white transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="flex items-center justify-between p-5 border-b">
              <div className="flex items-center">
                <div className="bg-indigo-600 text-white p-2 rounded-lg">
                  <ChartBarIcon className="h-6 w-6" />
                </div>
                <h2 className="ml-3 text-l font-bold text-gray-800">Admin</h2>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-gray-700">
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
                      isActive ? "bg-indigo-100 text-indigo-700 font-medium" : "text-gray-700 hover:bg-gray-100"
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
                  isActive ? "bg-indigo-100 text-indigo-700 font-medium shadow-sm" : "text-gray-700 hover:bg-gray-100"
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
  )
}

export default function ArticleM() {
  const navigate = useNavigate()
  const [articles, setArticles] = useState([])
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(8)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const res = await fetch("http://localhost:8082/api/articles")
      const data = await res.json()
      setArticles(data)
    } catch (error) {
      console.error("Erreur lors du chargement des articles:", error)
    }
  }

  const filteredArticles = articles.filter((a) => {
    const searchTerm = search.toLowerCase().trim()
    if (!searchTerm) return true
    return (
      a.reference?.toLowerCase().includes(searchTerm) ||
      a.nom?.toLowerCase().includes(searchTerm) ||
      a.description?.toLowerCase().includes(searchTerm) ||
      a.designation?.toLowerCase().includes(searchTerm) ||
      a.categorie?.toLowerCase().includes(searchTerm) ||
      a.unite?.toLowerCase().includes(searchTerm) ||
      a.etat?.toLowerCase().includes(searchTerm)
    )
  })

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentArticles = filteredArticles.slice(startIndex, endIndex)

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const getCategorieBadgeColor = (categorie) => {
    switch (categorie?.toLowerCase()) {
      case "electronique":
        return "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200/50 shadow-sm"
      case "alimentaire":
        return "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200/50 shadow-sm"
      case "textile":
        return "bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 border border-purple-200/50 shadow-sm"
      case "mobilier":
        return "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-200/50 shadow-sm"
      default:
        return "bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border border-gray-200/50 shadow-sm"
    }
  }

  const getEtatBadgeColor = (etat) => {
    switch (etat?.toLowerCase()) {
      case "bien":
        return "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200/50 shadow-sm"
      case "moyenne":
        return "bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700 border border-yellow-200/50 shadow-sm"
      case "faible":
        return "bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border border-red-200/50 shadow-sm"
      default:
        return "bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border border-gray-200/50 shadow-sm"
    }
  }

  const getStockStatus = (stock) => {
    if (stock <= 5) return { color: "text-red-600", bg: "bg-red-100", label: "Stock faible" }
    if (stock <= 20) return { color: "text-yellow-600", bg: "bg-yellow-100", label: "Stock moyen" }
    return { color: "text-green-600", bg: "bg-green-100", label: "Stock bon" }
  }

  return (
    <div className="flex min-h-screen">
      {/* Barre de navigation latérale fixe */}
      <div className="fixed left-0 top-0 bottom-0 z-20">
        <Navbar />
      </div>

      {/* Contenu principal avec marge pour la navbar */}
      <div className="flex-1 flex flex-col ml-0 lg:ml-72">
        {/* Bouton mobile */}
        <button className="lg:hidden mb-4 p-2 bg-indigo-600 rounded-lg text-white" onClick={() => setSidebarOpen(true)}>
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
                  <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-gray-700">
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <nav className="p-4">
                  {[
                    { name: "Articles", icon: DocumentTextIcon, path: "/articlesM" },
                    { name: "DemandeAchats", icon: ShoppingCartIcon, path: "/demandes-achat" },
                    { name: "Profile", icon: UserCircleIcon, path: "/prof-admin" },
                  ].map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 mb-2 rounded-lg transition-all ${
                          isActive ? "bg-indigo-100 text-indigo-700 font-medium" : "text-gray-700 hover:bg-gray-100"
                        }`
                      }
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </NavLink>
                  ))}

                  <button
                    onClick={() => {
                      localStorage.removeItem("currentUser")
                      console.log("Déconnexion effectuée")
                      navigate("/auth")
                    }}
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

        {/* Contenu de la page ArticleE */}
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-100">
          {/* Header Section - Sans bouton Ajouter */}
          <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-3 rounded-2xl shadow-lg">
                    <Package className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      Consultation des Articles
                    </h1>
                    <p className="text-slate-600 mt-1">Consulter et rechercher les articles du stock</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div className="bg-white/60 backdrop-blur-sm border-b border-gray-200/50 px-4 sm:px-6 lg:px-8 py-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1 max-w-md w-full">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Rechercher par référence, nom, catégorie..."
                      className="w-full pl-12 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-300/50 rounded-2xl text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none focus:bg-white/90 transition-all duration-200 shadow-sm hover:shadow-md"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value)
                        setCurrentPage(1)
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="bg-white/70 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200/50 shadow-sm">
                    <span className="text-gray-600">Total: </span>
                    <span className="font-bold text-orange-600">{filteredArticles.length}</span>
                    <span className="text-gray-600"> article(s)</span>
                  </div>
                  <div className="bg-white/70 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200/50 shadow-sm">
                    <span className="text-gray-600">Page </span>
                    <span className="font-bold text-orange-600">{currentPage}</span>
                    <span className="text-gray-600"> sur </span>
                    <span className="font-bold text-orange-600">{totalPages || 1}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table Section - Sans colonne Actions */}
          <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
                {/* Table Header */}
                <div className="bg-gradient-to-r from-orange-600 to-amber-700 px-6 py-4">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                    <ShoppingCart className="w-6 h-6" />
                    Liste des articles
                  </h2>
                  <p className="text-orange-100 mt-1">{filteredArticles.length} article(s) dans le stock</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-orange-50 border-b border-gray-200/50">
                      <tr>
                        {["Article", "Prix & Stock", "Catégorie", "État"].map((th, i) => (
                          <th
                            key={i}
                            className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                          >
                            {th}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100/50">
                      {currentArticles.map((article) => {
                        const stockStatus = getStockStatus(article.stock)
                        return (
                          <tr
                            key={article.id}
                            className="hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-amber-50/50 transition-all duration-200 group h-16"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="relative">
                                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-lg">
                                      {article.nom?.charAt(0)?.toUpperCase() || "A"}
                                    </span>
                                  </div>
                                  <div
                                    className={`absolute -bottom-1 -right-1 w-4 h-4 ${stockStatus.bg} rounded-full border-2 border-white shadow-sm`}
                                  ></div>
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-900 text-lg">{article.nom}</div>
                                  <div className="text-sm text-gray-500">Réf: {article.reference}</div>
                                  <div className="text-xs text-gray-400 truncate max-w-xs">
                                    {article.description || "Aucune description"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-1">
                                <div className="text-lg font-bold text-gray-900">
                                  {article.prix_unitaire?.toFixed(2)} €
                                </div>
                                <div className={`text-sm font-medium ${stockStatus.color}`}>
                                  Stock: {article.stock} {article.unite || "unités"}
                                </div>
                                <div
                                  className={`text-xs px-2 py-1 rounded-full ${stockStatus.bg} ${stockStatus.color} inline-block`}
                                >
                                  {stockStatus.label}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wide ${getCategorieBadgeColor(
                                  article.categorie,
                                )}`}
                              >
                                {article.categorie}
                              </span>
                              {article.designation && (
                                <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                                  {article.designation}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wide ${getEtatBadgeColor(
                                  article.etat,
                                )}`}
                              >
                                {article.etat || "Non défini"}
                              </span>
                            </td>
                          </tr>
                        )
                      })}

                      {/* Lignes vides pour maintenir une hauteur fixe */}
                      {currentArticles.length > 0 &&
                        currentArticles.length < itemsPerPage &&
                        Array.from({ length: itemsPerPage - currentArticles.length }).map((_, index) => (
                          <tr key={`empty-${index}`} className="h-16">
                            <td className="px-6 py-4" colSpan="4"></td>
                          </tr>
                        ))}

                      {filteredArticles.length === 0 && (
                        <tr>
                          <td colSpan="4" className="px-6 py-16 text-center">
                            <div className="flex flex-col items-center gap-6">
                              <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-3xl shadow-lg">
                                <Search className="w-16 h-16 text-gray-400" />
                              </div>
                              <div>
                                <p className="text-xl font-bold text-gray-900 mb-2">Aucun article trouvé</p>
                                <p className="text-gray-500">Essayez de modifier votre recherche</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Pagination Section */}
          {filteredArticles.length > 0 && (
            <div className="bg-white/60 backdrop-blur-sm border-t border-gray-200/50 px-4 sm:px-6 lg:px-8 py-4">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="bg-white/70 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200/50 shadow-sm text-sm text-gray-600">
                    Affichage <span className="font-bold text-orange-600">{startIndex + 1}</span> à{" "}
                    <span className="font-bold text-orange-600">{Math.min(endIndex, filteredArticles.length)}</span> sur{" "}
                    <span className="font-bold text-orange-600">{filteredArticles.length}</span> articles
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className="group bg-white/70 backdrop-blur-sm border border-gray-300/50 text-gray-700 hover:bg-white/90 hover:border-orange-300 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                      <span className="hidden sm:inline font-medium">Précédent</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let page
                        if (totalPages <= 5) {
                          page = i + 1
                        } else {
                          const start = Math.max(1, currentPage - 2)
                          const end = Math.min(totalPages, start + 4)
                          page = start + i
                          if (page > end) return null
                        }
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 ${
                              currentPage === page
                                ? "bg-gradient-to-r from-orange-600 to-amber-700 text-white shadow-lg"
                                : "bg-white/70 backdrop-blur-sm border border-gray-300/50 text-gray-700 hover:bg-white/90 hover:border-orange-300"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      })}
                    </div>

                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className="group bg-white/70 backdrop-blur-sm border border-gray-300/50 text-gray-700 hover:bg-white/90 hover:border-orange-300 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <span className="hidden sm:inline font-medium">Suivant</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
