"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Save,
  ClipboardPlus,
  ClipboardList,
  FileText,
  Hash,
  Calendar,
  Package,
  User,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"

export default function AjoutDemandeAchatM() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null) // Utilisateur connecté

  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    quantiteDemande: "",
    statutDA: "En consultation", // Default status
    validation: "V", // Nouveau champ: toujours "V" et non modifiable
    commentaire: "",
    dateCreation: new Date().toISOString().split("T")[0], // Default to today
    dateLivraison: "",
    creePar: null, // Sera automatiquement défini avec l'utilisateur connecté
    validePar: null, // Sera automatiquement défini avec l'utilisateur connecté
    article: null, // Un seul article
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [users, setUsers] = useState([])
  const [articles, setArticles] = useState([]) // Liste complète des articles

  const statutOptions = [
    "Recu",
    "En choix technique",
    "En consultation",
    "En attente de livraison",
    "Livrée partiellement",
    "Livrée",
  ]

  // La liste des options de validation est toujours là, mais le champ sera désactivé
  const validationOptions = ["PAS ENCORE", "V", "NV"]

  useEffect(() => {
    // Récupérer l'utilisateur connecté depuis localStorage
    const getUserFromLocalStorage = () => {
      try {
        const userData = localStorage.getItem("currentUser")
        if (userData) {
          const user = JSON.parse(userData)
          setCurrentUser(user)
          // Définir automatiquement l'utilisateur connecté comme créateur et validateur
          setFormData((prev) => ({
            ...prev,
            creePar: user,
            validePar: user, // Définir automatiquement l'utilisateur connecté comme validateur
          }))
        } else {
          // Si aucun utilisateur connecté, rediriger vers la page d'authentification
          console.warn("Aucun utilisateur connecté trouvé")
          navigate("/auth")
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur:", error)
        navigate("/auth")
      }
    }

    getUserFromLocalStorage()
    fetchUsers()
    fetchArticlesList()
  }, [navigate])

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:8082/api/utilisateurs")
      const data = await res.json()
      setUsers(data)
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error)
    }
  }

  const fetchArticlesList = async () => {
    try {
      const res = await fetch("http://localhost:8082/api/articles")
      const data = await res.json()
      setArticles(data)
    } catch (error) {
      console.error("Erreur lors du chargement des articles:", error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Gérer la sélection d'un seul article
  const handleArticleChange = (e) => {
    const articleId = Number(e.target.value)
    const selectedArticle = articles.find((a) => a.id === articleId)
    setFormData((prev) => ({ ...prev, article: selectedArticle }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const dataToSend = {
        ...formData,
        quantiteDemande: Number.parseInt(formData.quantiteDemande),
        dateCreation: formData.dateCreation || new Date().toISOString().split("T")[0],
        dateLivraison: formData.dateLivraison || null,
        // S'assurer que l'utilisateur connecté est bien défini comme créateur et validateur
        creePar: formData.creePar ? { id: formData.creePar.id } : null,
        validePar: formData.validePar ? { id: formData.validePar.id } : null, // Utilise l'utilisateur connecté
        article: formData.article ? { id: formData.article.id } : null,
      }

      const response = await fetch("http://localhost:8082/api/demandes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })
      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message || "Erreur lors de la création de la demande d'achat")
      }
      console.log("Demande d'achat créée:", responseData)
      navigate("/demandes-achatM")
    } catch (error) {
      console.error("Erreur détaillée:", error)
      setError(error.message || "Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-100">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/demandes-achatM")}
                className="group flex items-center gap-2 text-slate-600 hover:text-cyan-600 transition-all duration-200 bg-white/60 hover:bg-cyan-50 px-4 py-2 rounded-xl shadow-sm hover:shadow-md border border-gray-200/50"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="font-medium">Retour</span>
              </button>

              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-cyan-500 to-teal-600 p-3 rounded-2xl shadow-lg">
                  <ClipboardPlus className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Créer une Demande d'Achat
                  </h1>
                  <p className="text-slate-600 mt-1">Remplissez les détails de la nouvelle demande</p>
                  {/* Afficher l'utilisateur connecté */}
                  {currentUser && (
                    <p className="text-sm text-cyan-600 mt-1">
                      Créée par: {currentUser.prenom} {currentUser.nom} ({currentUser.role})
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-cyan-600 to-teal-700 px-4 py-3">
            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
              <ClipboardList className="w-6 h-6" />
              Détails de la demande
            </h2>
            <p className="text-cyan-100 mt-1">Remplissez tous les champs requis</p>
          </div>

          <div className="p-4">
            {error && (
              <div className="mb-6 p-6 bg-gradient-to-r from-red-50 to-pink-50 text-red-800 rounded-2xl border border-red-200/50 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="bg-red-100 p-2 rounded-full">
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">Erreur de validation</h4>
                    <p className="mt-1">{error}</p>
                    <p className="mt-2 text-sm text-red-600">Vérifiez que tous les champs sont correctement remplis.</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic Information Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-200">
                  <FileText className="w-5 h-5 text-cyan-600" />
                  Informations générales
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="titre" className="block text-sm font-semibold text-gray-700">
                      Titre <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="titre"
                        name="titre"
                        value={formData.titre}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 pl-11 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all duration-200 hover:bg-white/80"
                        placeholder="Titre de la demande"
                      />
                      <Hash className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="quantiteDemande" className="block text-sm font-semibold text-gray-700">
                      Quantité demandée <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="quantiteDemande"
                        name="quantiteDemande"
                        value={formData.quantiteDemande}
                        onChange={handleChange}
                        required
                        min="1"
                        className="w-full px-4 py-2 pl-11 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all duration-200 hover:bg-white/80"
                        placeholder="1"
                      />
                      <Package className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
                    Description
                  </label>
                  <div className="relative">
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      maxLength="500"
                      rows="3"
                      className="w-full px-4 py-2 pl-11 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all duration-200 hover:bg-white/80 resize-none"
                      placeholder="Description détaillée de la demande"
                    />
                    <FileText className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="commentaire" className="block text-sm font-semibold text-gray-700">
                    Commentaire
                  </label>
                  <div className="relative">
                    <textarea
                      id="commentaire"
                      name="commentaire"
                      value={formData.commentaire}
                      onChange={handleChange}
                      rows="2"
                      className="w-full px-4 py-2 pl-11 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all duration-200 hover:bg-white/80 resize-none"
                      placeholder="Ajouter des commentaires supplémentaires"
                    />
                    <FileText className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Status and Dates Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-200">
                  <Calendar className="w-5 h-5 text-cyan-600" />
                  Statut et Dates
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="statutDA" className="block text-sm font-semibold text-gray-700">
                      Statut <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="statutDA"
                        name="statutDA"
                        value={formData.statutDA}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 pl-11 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all duration-200 hover:bg-white/80 appearance-none cursor-pointer"
                      >
                        {statutOptions.map((statut) => (
                          <option key={statut} value={statut}>
                            {statut}
                          </option>
                        ))}
                      </select>
                      <ClipboardList className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <svg
                        className="absolute right-3 top-4 w-4 h-4 text-gray-400 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="validation" className="block text-sm font-semibold text-gray-700">
                      Validation <span className="text-green-600">(Automatique)</span>
                    </label>
                    <div className="relative">
                      <select
                        id="validation"
                        name="validation"
                        value={formData.validation}
                        onChange={handleChange}
                        disabled 
                        className="w-full px-4 py-2 pl-11 bg-green-50 border border-green-200 rounded-xl text-green-700 font-medium cursor-not-allowed appearance-none"
                      >
                        {validationOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {formData.validation === "V" && (
                        <CheckCircle className="absolute left-3 top-3.5 w-5 h-5 text-green-500" />
                      )}
                      {formData.validation === "NV" && (
                        <XCircle className="absolute left-3 top-3.5 w-5 h-5 text-red-500" />
                      )}
                      {formData.validation === "PAS ENCORE" && (
                        <Clock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      )}
                      <svg
                        className="absolute right-3 top-4 w-4 h-4 text-gray-400 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <p className="text-xs text-green-600">Ce champ est automatiquement défini sur "V" (Validée).</p>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="dateCreation" className="block text-sm font-semibold text-gray-700">
                      Date de création <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="dateCreation"
                        name="dateCreation"
                        value={formData.dateCreation}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 pl-11 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all duration-200 hover:bg-white/80"
                      />
                      <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="dateLivraison" className="block text-sm font-semibold text-gray-700">
                      Date de livraison prévue
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="dateLivraison"
                        name="dateLivraison"
                        value={formData.dateLivraison}
                        onChange={handleChange}
                        className="w-full px-4 py-2 pl-11 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all duration-200 hover:bg-white/80"
                      />
                      <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Relations Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-200">
                  <User className="w-5 h-5 text-cyan-600" />
                  Relations
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Champ créé par - désactivé et pré-rempli */}
                  <div className="space-y-1">
                    <label htmlFor="creePar" className="block text-sm font-semibold text-gray-700">
                      Créée par <span className="text-green-600">(Automatique)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="creePar"
                        value={
                          currentUser
                            ? `${currentUser.prenom} ${currentUser.nom} (${currentUser.role})`
                            : "Utilisateur non connecté"
                        }
                        disabled
                        className="w-full px-4 py-2 pl-11 bg-green-50 border border-green-200 rounded-xl text-green-700 font-medium cursor-not-allowed"
                      />
                      <User className="absolute left-3 top-3.5 w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-xs text-green-600">Cette demande sera automatiquement associée à votre compte</p>
                  </div>

                  {/* Champ validée par - désactivé et pré-rempli */}
                  <div className="space-y-1">
                    <label htmlFor="validePar" className="block text-sm font-semibold text-gray-700">
                      Validée par <span className="text-green-600">(Automatique)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="validePar"
                        value={
                          currentUser
                            ? `${currentUser.prenom} ${currentUser.nom} (${currentUser.role})`
                            : "Utilisateur non connecté"
                        }
                        disabled
                        className="w-full px-4 py-2 pl-11 bg-green-50 border border-green-200 rounded-xl text-green-700 font-medium cursor-not-allowed"
                      />
                      <User className="absolute left-3 top-3.5 w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-xs text-green-600">
                      Cette demande sera automatiquement validée par votre compte
                    </p>
                  </div>
                </div>

                {/* Sélection d'un seul article */}
                <div className="space-y-1">
                  <label htmlFor="article" className="block text-sm font-semibold text-gray-700">
                    Article associé <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="article"
                      name="article"
                      value={formData.article?.id || ""} // Utiliser l'ID de l'article sélectionné
                      onChange={handleArticleChange}
                      required
                      className="w-full px-4 py-2 pl-11 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all duration-200 hover:bg-white/80 appearance-none cursor-pointer"
                    >
                      <option value="">Sélectionner un article</option>
                      {articles.map((article) => (
                        <option key={article.id} value={article.id}>
                          {article.nom} (Réf: {article.reference})
                        </option>
                      ))}
                    </select>
                    <Package className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <svg
                      className="absolute right-3 top-4 w-4 h-4 text-gray-400 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {formData.article && (
                    <p className="text-xs text-gray-500 mt-1">
                      Article sélectionné: {formData.article.nom} (Réf: {formData.article.reference})
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting || !currentUser}
                  className="group relative bg-gradient-to-r from-cyan-600 to-teal-700 hover:from-cyan-700 hover:to-teal-800 text-white px-5 py-2.5 rounded-2xl flex items-center gap-3 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                >
                  <Save className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                  <span>{isSubmitting ? "Création en cours..." : "Créer la demande"}</span>
                  {isSubmitting && <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse" />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
