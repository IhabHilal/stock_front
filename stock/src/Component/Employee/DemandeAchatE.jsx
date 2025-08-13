"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Pencil,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Search,
  ClipboardList,
  Package,
  Eye,
  X,
  Tag,
  Hash,
  ClipboardCheck,
  Info,
  FileText,
  MessageSquare,
  Calendar,
  CalendarCheck,
  User,
  UserCheck,
  Users,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"
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
import NavbarE from "./NavbarE"





const DetailItem = ({
  label,
  value,
  icon: Icon,
  isBadge = false,
  getStatutBadgeColor,
  isLongText = false,
  subValue,
  isValidation = false, // New prop for validation field
}) => (
  <div className="flex flex-col">
    <span className="text-xs font-semibold text-gray-500 uppercase mb-0.5 flex items-center gap-1">
      {Icon && <Icon className="w-4 h-4 text-gray-400" />} {label}
    </span>
    {isBadge ? (
      <span
        className={`inline-flex items-center px-3 py-1.5 rounded-2xl text-xs font-bold uppercase tracking-wide ${getStatutBadgeColor(
          value,
        )}`}
      >
        {value}
      </span>
    ) : isValidation ? (
      <span
        className={`inline-flex items-center px-3 py-1.5 rounded-2xl text-xs font-bold uppercase tracking-wide ${
          value === "V"
            ? "bg-green-50 text-green-700 border border-green-200/50 shadow-sm"
            : value === "NV"
              ? "bg-red-50 text-red-700 border border-red-200/50 shadow-sm"
              : "bg-gray-50 text-gray-700 border border-gray-200/50 shadow-sm"
        }`}
      >
        {value === "V" ? "Validée" : value === "NV" ? "Non Validée" : "Pas encore"}
      </span>
    ) : isLongText ? (
      <p className="text-gray-700 text-sm leading-relaxed">{value}</p>
    ) : (
      <span className="text-gray-800 text-sm font-medium">
        {value}
        {subValue && <span className="text-xs text-gray-500 ml-1">{subValue}</span>}
      </span>
    )}
  </div>
)

export default function DemandeAchatE() {
  const navigate = useNavigate()
  const [demandes, setDemandes] = useState([])
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(8)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [validationFilter, setValidationFilter] = useState("TOUS") // New state for validation filter
  // New state for details modal
  const [selectedDemande, setSelectedDemande] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isUpdatingValidation, setIsUpdatingValidation] = useState(false) // New state for loading
  const [currentUser, setCurrentUser] = useState(null) // State to hold current user

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < Math.ceil(demandes.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1)
    }
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"))
    setCurrentUser(user)
    fetchDemandes()
  }, [])

  const fetchDemandes = async () => {
    try {
      const [demandesRes, articlesRes] = await Promise.all([
        fetch("http://localhost:8082/api/demandes"),
        fetch("http://localhost:8082/api/articles"),
      ])
      const demandesData = await demandesRes.json()
      const allArticles = await articlesRes.json()

      // Filter demands by currentUser.id if currentUser is an EMPLOYEE
      const filteredByEmployee =
        currentUser && currentUser.role === "EMPLOYEE"
          ? demandesData.filter((demande) => demande.creePar?.id === currentUser.id)
          : demandesData

      const enrichedDemandes = filteredByEmployee.map((demande) => ({
        ...demande,
        article:
          demande.article && demande.article.id
            ? allArticles.find((a) => a.id === demande.article.id) || demande.article
            : null,
      }))
      setDemandes(enrichedDemandes)
    } catch (error) {
      console.error("Erreur lors du chargement des demandes d'achat:", error)
    }
  }

  

  // Function to open details modal
  const handleViewDetails = (demande) => {
    setSelectedDemande(demande)
    setIsDetailsModalOpen(true)
  }

  // Function to update validation status
  const handleUpdateValidation = async (newStatus) => {
    if (!selectedDemande || !currentUser) return // Ensure currentUser is available

    setIsUpdatingValidation(true)
    try {
      const dataToSend = {
        ...selectedDemande,
        validation: newStatus,
        validePar: { id: currentUser.id }, // Set validePar to the current user
      }

      const response = await fetch(`http://localhost:8082/api/demandes/${selectedDemande.id}`, {
        method: "PUT", // Or PATCH, depending on your API
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })
      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de la validation.")
      }
      const updatedDemande = await response.json()
      setSelectedDemande(updatedDemande) // Update the selected demande in modal
      fetchDemandes() // Re-fetch all demands to update the table
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la validation:", error)
      alert("Échec de la mise à jour de la validation: " + error.message)
    } finally {
      setIsUpdatingValidation(false)
    }
  }

  const filteredDemandes = demandes.filter((d) => {
    const searchTerm = search.toLowerCase().trim()
    const matchesSearch =
      !searchTerm ||
      d.titre?.toLowerCase().includes(searchTerm) ||
      d.description?.toLowerCase().includes(searchTerm) ||
      d.statutDA?.toLowerCase().includes(searchTerm) ||
      d.commentaire?.toLowerCase().includes(searchTerm) ||
      d.creePar?.nom?.toLowerCase().includes(searchTerm) ||
      d.creePar?.prenom?.toLowerCase().includes(searchTerm) ||
      d.validePar?.nom?.toLowerCase().includes(searchTerm) ||
      d.validePar?.prenom?.toLowerCase().includes(searchTerm) ||
      d.article?.nom?.toLowerCase().includes(searchTerm) ||
      d.article?.reference?.toLowerCase().includes(searchTerm)

    const matchesValidation =
      validationFilter === "TOUS" ||
      (validationFilter === "V" && d.validation === "V") ||
      (validationFilter === "NV" && d.validation === "NV") ||
      (validationFilter === "PAS ENCORE" && d.validation === "PAS ENCORE")

    return matchesSearch && matchesValidation
  })

  const totalPages = Math.ceil(filteredDemandes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentDemandes = filteredDemandes.slice(startIndex, endIndex)

  const getStatutBadgeColor = (statut) => {
    switch (statut?.toLowerCase()) {
      case "recu":
        return "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200/50 shadow-sm"
      case "en choix technique":
        return "bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700 border border-yellow-200/50 shadow-sm"
      case "en consultation":
        return "bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 border border-purple-200/50 shadow-sm"
      case "en attente de livraison":
        return "bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 border border-orange-200/50 shadow-sm"
      case "livrée partiellement":
        return "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200/50 shadow-sm"
      case "livrée":
        return "bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 border border-teal-200/50 shadow-sm"
      default:
        return "bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border border-gray-200/50 shadow-sm"
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("fr-FR", options)
  }

  const menuItems = [
    { name: "Articles", icon: DocumentTextIcon, path: "/articlesE" },
    { name: "DemandeAchats", icon: ShoppingCartIcon, path: "/demandes-achatE" },
    { name: "Profile", icon: UserCircleIcon, path: "/prof-admin" },
  ]

  return (
    <div className="flex min-h-screen">
      {/* Barre de navigation latérale fixe */}
      <div className="fixed left-0 top-0 bottom-0 z-20">
        <NavbarE />
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
                    <X className="h-6 w-6" />
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
        {/* Contenu de la page DemandeAchat */}
        <div className="min-h-screen ">
          {/* Header Section */}
          <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50 sticky top-0 z-10">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-cyan-500 to-teal-600 p-3 rounded-2xl shadow-lg">
                    <ClipboardList className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      Consultation des Demandes d'Achat
                    </h1>
                    <p className="text-slate-600 mt-1">Consulter et suivre les demandes d'approvisionnement</p>
                  </div>
                </div>
                <button
                  className="group bg-gradient-to-r from-cyan-600 to-teal-700 hover:from-cyan-700 hover:to-teal-800 text-white px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                  onClick={() => navigate("/ajout-demande-achatE")}
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                  Créer une Demande
                </button>
              </div>
            </div>
          </div>
          {/* Search and Filter Section */}
          <div className="bg-white/60 backdrop-blur-sm border-b border-gray-200/50 px-4 sm:px-6 lg:px-8 py-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1 max-w-md w-full">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Rechercher par titre, description, statut..."
                      className="w-full pl-12 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-300/50 rounded-2xl text-gray-900 placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none focus:bg-white/90 transition-all duration-200 shadow-sm hover:shadow-md"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value)
                        setCurrentPage(1)
                      }}
                    />
                  </div>
                </div>
                {/* Validation Filter */}
                <div className="flex items-center gap-2">
                  <label htmlFor="validationFilter" className="text-gray-600 text-sm font-medium">
                    Validation:
                  </label>
                  <select
                    id="validationFilter"
                    value={validationFilter}
                    onChange={(e) => {
                      setValidationFilter(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="px-4 py-2 bg-white/70 backdrop-blur-sm border border-gray-300/50 rounded-xl text-gray-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <option value="TOUS">Tous</option>
                    <option value="V">Validée</option>
                    <option value="NV">Non Validée</option>
                    <option value="PAS ENCORE">Pas encore</option>
                  </select>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="bg-white/70 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200/50 shadow-sm">
                    <span className="text-gray-600">Total: </span>
                    <span className="font-bold text-cyan-600">{filteredDemandes.length}</span>
                    <span className="text-gray-600"> demande(s)</span>
                  </div>
                  <div className="bg-white/70 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200/50 shadow-sm">
                    <span className="text-gray-600">Page </span>
                    <span className="font-bold text-cyan-600">{currentPage}</span>
                    <span className="text-gray-600"> sur </span>
                    <span className="font-bold text-cyan-600">{totalPages || 1}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Table Section */}
          <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
                {/* Table Header */}
                <div className="bg-gradient-to-r from-cyan-600 to-teal-700 px-6 py-4">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                    <ClipboardList className="w-6 h-6" />
                    Liste des demandes d'achat
                  </h2>
                  <p className="text-cyan-100 mt-1">{filteredDemandes.length} demande(s) en cours</p>
                </div>
                <div className="overflow-x-auto md:overflow-x-visible">
                  <table className="w-full table-fixed">
                    <thead className="bg-gradient-to-r from-gray-50 to-cyan-50 border-b border-gray-200/50">
                      <tr>
                        {["Demande", "Quantité", "Statut", "Article", "Actions"].map((th, i) => (
                          <th
                            key={i}
                            className={`px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider ${
                              th === "Demande" ? "w-[28%]" : ""
                            } ${th === "Quantité" ? "w-[12%]" : ""} ${
                              th === "Statut" ? "w-[18%]" : ""
                            } ${th === "Article" ? "w-[28%]" : ""} ${th === "Actions" ? "text-center w-[14%]" : ""}`}
                          >
                            {th}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100/50">
                      {currentDemandes.map((demande) => (
                        <tr
                          key={demande.id}
                          className="hover:bg-gradient-to-r hover:from-cyan-50/50 hover:to-teal-50/50 transition-all duration-200 group h-16"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                                  <span className="text-white font-bold text-lg">
                                    {demande.titre?.charAt(0)?.toUpperCase() || "D"}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 text-lg">{demande.titre}</div>
                                <div className="text-sm text-gray-500">ID: #{demande.id}</div>
                                {/* Description removed from here */}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-lg font-bold text-gray-900">{demande.quantiteDemande}</div>
                            <div className="text-sm text-gray-500">
                              {demande.commentaire && (
                                <span className="text-xs text-gray-500 mt-1 truncate">{demande.commentaire}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wide ${getStatutBadgeColor(
                                demande.statutDA,
                              )}`}
                            >
                              {demande.statutDA}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              {demande.article && (demande.article.nom || demande.article.id) ? (
                                <div className="flex flex-col items-start gap-1 text-sm text-gray-700">
                                  <div className="flex items-center gap-2">
                                    <Package className="w-4 h-4 text-gray-500" />
                                    <span className="font-medium">
                                      {demande.article.nom || `Article ID: ${demande.article.id}`}
                                    </span>
                                  </div>
                                  {demande.article.reference && (
                                    <p className="text-xs text-gray-500">(Réf: {demande.article.reference})</p>
                                  )}
                                </div>
                              ) : (
                                <span className="text-sm text-gray-500">Aucun article</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                className="group/btn bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 p-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-110"
                                onClick={() => handleViewDetails(demande)} // Open modal
                                title="Détails"
                              >
                                <Eye className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-200" />
                              </button>
                              
                            </div>
                          </td>
                        </tr>
                      ))}
                      {/* Lignes vides pour maintenir une hauteur fixe */}
                      {currentDemandes.length > 0 &&
                        currentDemandes.length < itemsPerPage &&
                        Array.from({ length: itemsPerPage - currentDemandes.length }).map((_, index) => (
                          <tr key={`empty-${index}`} className="h-16">
                            <td className="px-6 py-4" colSpan="5"></td> {/* colSpan ajusté à 5 */}
                          </tr>
                        ))}
                      {filteredDemandes.length === 0 && (
                        <tr>
                          <td colSpan="5" className="px-6 py-16 text-center">
                            {" "}
                            {/* colSpan ajusté à 5 */}
                            <div className="flex flex-col items-center gap-6">
                              <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-3xl shadow-lg">
                                <Search className="w-16 h-16 text-gray-400" />
                              </div>
                              <div>
                                <p className="text-xl font-bold text-gray-900 mb-2">Aucune demande d'achat trouvée</p>
                                <p className="text-gray-500">
                                  Essayez de modifier votre recherche ou créez une nouvelle demande
                                </p>
                              </div>
                              <button
                                onClick={() => navigate("/ajout-demande-achatE")}
                                className="bg-gradient-to-r from-cyan-600 to-teal-700 hover:from-cyan-700 hover:to-teal-800 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                              >
                                <Plus className="w-5 h-5" />
                                Créer la première demande
                              </button>
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
          {filteredDemandes.length > 0 && (
            <div className="bg-white/60 backdrop-blur-sm border-t border-gray-200/50 px-4 sm:px-6 lg:px-8 py-4">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="bg-white/70 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200/50 shadow-sm text-sm text-gray-600">
                    Affichage <span className="font-bold text-cyan-600">{startIndex + 1}</span> à{" "}
                    <span className="font-bold text-cyan-600">{Math.min(endIndex, filteredDemandes.length)}</span> sur{" "}
                    <span className="font-bold text-cyan-600">{filteredDemandes.length}</span> demandes
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className="group bg-white/70 backdrop-blur-sm border border-gray-300/50 text-gray-700 hover:bg-white/90 hover:border-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
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
                                ? "bg-gradient-to-r from-cyan-600 to-teal-700 text-white shadow-lg"
                                : "bg-white/70 backdrop-blur-sm border border-gray-300/50 text-gray-700 hover:bg-white/90 hover:border-cyan-300"
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
                      className="group bg-white/70 backdrop-blur-sm border border-gray-300/50 text-gray-700 hover:bg-white/90 hover:border-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
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
      {/* Modal for Demande Details */}
      {isDetailsModalOpen && selectedDemande && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl border border-gray-100/50 w-full max-w-2xl p-6 md:p-8 animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsDetailsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
              title="Fermer"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="flex items-center gap-3 text-2xl font-extrabold text-gray-900 mb-6 pb-3 border-b-2 border-blue-200">
              <ClipboardList className="w-7 h-7 text-blue-600" />
              Détails de la Demande d'Achat #{selectedDemande.id}
            </h2>
            {/* General Info Section */}
            <div className="bg-blue-50/30 p-4 rounded-xl mb-4 border border-blue-100 shadow-inner">
              <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" /> Informations Générales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                <DetailItem label="Titre" value={selectedDemande.titre} icon={Tag} />
                <DetailItem label="Quantité Demandée" value={selectedDemande.quantiteDemande} icon={Hash} />
                <DetailItem
                  label="Statut"
                  value={selectedDemande.statutDA}
                  icon={ClipboardCheck}
                  isBadge={true}
                  getStatutBadgeColor={getStatutBadgeColor}
                />
                <DetailItem
                  label="Article Associé"
                  value={selectedDemande.article?.nom || `ID: ${selectedDemande.article?.id}` || "Aucun article"}
                  icon={Package}
                  subValue={selectedDemande.article?.reference ? `(Réf: ${selectedDemande.article.reference})` : ""}
                />
                {/* Validation Field */}
                <DetailItem
                  label="Validation"
                  value={selectedDemande.validation}
                  icon={
                    selectedDemande.validation === "V"
                      ? CheckCircle
                      : selectedDemande.validation === "NV"
                        ? XCircle
                        : Clock
                  }
                  isValidation={true}
                />
              </div>
            </div>
            {/* Conditional Validation Buttons */}
            {selectedDemande.validation === "PAS ENCORE" && (
              <div className="bg-gray-50/30 p-4 rounded-xl mb-4 border border-gray-100 shadow-inner flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => handleUpdateValidation("V")}
                  disabled={isUpdatingValidation}
                  className="group !bg-green-600 hover:bg-green-700 !text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                >
                  <CheckCircle className="w-5 h-5 group-hover:rotate-6 transition-transform duration-200" />
                  <span>{isUpdatingValidation ? "Validation en cours..." : "Valider la demande"}</span>
                </button>
                <button
                  onClick={() => handleUpdateValidation("NV")}
                  disabled={isUpdatingValidation}
                  className="group !bg-red-600 hover:bg-red-700 !text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                >
                  <XCircle className="w-5 h-5 group-hover:-rotate-6 transition-transform duration-200" />
                  <span>{isUpdatingValidation ? "Rejet en cours..." : "Non Valider la demande"}</span>
                </button>
              </div>
            )}
            {/* Description & Comment Section */}
            <div className="bg-green-50/30 p-4 rounded-xl mb-4 border border-green-100 shadow-inner">
              <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" /> Description & Commentaires
              </h3>
              <DetailItem
                label="Description"
                value={selectedDemande.description || "Aucune description fournie."}
                icon={FileText}
                isLongText={true}
              />
              <DetailItem
                label="Commentaire"
                value={selectedDemande.commentaire || "Aucun commentaire."}
                icon={MessageSquare}
                isLongText={true}
              />
            </div>
            {/* Dates Section */}
            <div className="bg-purple-50/30 p-4 rounded-xl mb-4 border border-purple-100 shadow-inner">
              <h3 className="text-lg font-bold text-purple-800 mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" /> Dates Clés
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                <DetailItem label="Date de Création" value={formatDate(selectedDemande.dateCreation)} icon={Calendar} />
                <DetailItem
                  label="Date de Livraison Prévue"
                  value={formatDate(selectedDemande.dateLivraison)}
                  icon={CalendarCheck}
                />
              </div>
            </div>
            {/* Users Section */}
            <div className="bg-yellow-50/30 p-4 rounded-xl mb-4 border border-yellow-100 shadow-inner">
              <h3 className="text-lg font-bold text-yellow-800 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-yellow-600" /> Utilisateurs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                <DetailItem
                  label="Créée par"
                  value={
                    selectedDemande.creePar ? `${selectedDemande.creePar.nom} ${selectedDemande.creePar.prenom}` : "N/A"
                  }
                  icon={User}
                />
                <DetailItem
                  label="Validée par"
                  value={
                    selectedDemande.validePar
                      ? `${selectedDemande.validePar.nom} ${selectedDemande.validePar.prenom}`
                      : "N/A"
                  }
                  icon={UserCheck}
                />
              </div>
            </div>
            <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium shadow-sm hover:shadow-md"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
