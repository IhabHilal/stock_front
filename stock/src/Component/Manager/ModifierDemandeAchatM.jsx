"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Save, ClipboardCheck, ClipboardList, FileText, Hash, Calendar, Package, User } from "lucide-react"

export default function ModifDemandeAchatM() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    quantiteDemande: "",
    statutDA: "",
    commentaire: "",
    dateCreation: "",
    dateLivraison: "",
    creePar: null,
    validePar: null,
    article: null, // MODIFICATION: Un seul article, pas une liste
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
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

  useEffect(() => {
    if (id) {
      // Charger les listes avant de charger la demande pour avoir les données complètes
      Promise.all([fetchUsers(), fetchArticlesList()]).then(() => {
        fetchDemande() // Appeler fetchDemande après que les listes soient chargées
      })
    }
  }, [id]) // Dépendance à 'id' pour recharger si l'ID change

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

  const fetchDemande = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`http://localhost:8082/api/demandes/${id}`)
      if (!response.ok) {
        throw new Error("Demande d'achat non trouvée")
      }
      const demandeData = await response.json()

      // MODIFICATION: Enrichir l'objet article avec les détails complets
      let enrichedArticle = null
      if (demandeData.article && articles.length > 0) {
        // Tenter de trouver l'article complet dans la liste des articles
        enrichedArticle = articles.find((a) => a.id === demandeData.article.id) || demandeData.article
      } else if (demandeData.article) {
        // Si la liste des articles n'est pas encore chargée ou vide, mais l'ID de l'article est présent,
        // utiliser l'objet partiel reçu du backend.
        enrichedArticle = demandeData.article
      }

      setFormData({
        ...demandeData,
        quantiteDemande: demandeData.quantiteDemande?.toString() || "",
        dateCreation: demandeData.dateCreation || "",
        dateLivraison: demandeData.dateLivraison || "",
        article: enrichedArticle, // Utiliser l'article enrichi
      })
    } catch (error) {
      console.error("Erreur lors du chargement de la demande d'achat:", error)
      setError("Impossible de charger les données de la demande d'achat")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUserChange = (e) => {
    const { name, value } = e.target
    const selectedUser = users.find((user) => user.id === Number(value))
    setFormData((prev) => ({ ...prev, [name]: selectedUser }))
  }

  // MODIFICATION: Gérer la sélection d'un seul article
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
        id: Number.parseInt(id),
        quantiteDemande: Number.parseInt(formData.quantiteDemande),
        dateCreation: formData.dateCreation || new Date().toISOString().split("T")[0],
        dateLivraison: formData.dateLivraison || null,
        creePar: formData.creePar ? { id: formData.creePar.id } : null,
        validePar: formData.validePar ? { id: formData.validePar.id } : null,
        // MODIFICATION: Envoyer l'ID de l'article sélectionné
        article: formData.article ? { id: formData.article.id } : null,
      }

      console.log("Modification de la demande - Données:", dataToSend)

      const response = await fetch(`http://localhost:8082/api/demandes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erreur ${response.status}: ${errorText}`)
      }

      const responseData = await response.json()
      console.log("Demande d'achat modifiée avec succès:", responseData)

      alert("Demande d'achat modifiée avec succès !")
      navigate("/demandes-achatM")
    } catch (error) {
      console.error("Erreur:", error)
      setError(error.message || "Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-100 flex items-center justify-center">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 p-8">
          <div className="flex items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
            <span className="text-lg font-semibold text-gray-700">Chargement des données...</span>
          </div>
        </div>
      </div>
    )
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
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-2xl shadow-lg">
                  <ClipboardCheck className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Modifier la Demande d'Achat
                  </h1>
                  <p className="text-slate-600 mt-1">Modifiez les informations de la demande</p>
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
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-4 py-3">
            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
              <ClipboardCheck className="w-6 h-6" />
              Modification de la demande
            </h2>
            <p className="text-green-100 mt-1">Tous les champs peuvent être modifiés</p>
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
                    <h4 className="font-semibold">Erreur de modification</h4>
                    <p className="mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic Information Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-200">
                  <FileText className="w-5 h-5 text-green-600" />
                  Informations générales
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full ml-2">Modifiable</span>
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
                        className="w-full px-4 py-2 pl-11 bg-white/50 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all duration-200 hover:bg-white/80 shadow-sm"
                        placeholder="Titre de la demande"
                      />
                      <Hash className="absolute left-3 top-3.5 w-5 h-5 text-green-600" />
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
                        className="w-full px-4 py-2 pl-11 bg-white/50 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all duration-200 hover:bg-white/80 shadow-sm"
                        placeholder="1"
                      />
                      <Package className="absolute left-3 top-3.5 w-5 h-5 text-green-600" />
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
                      className="w-full px-4 py-2 pl-11 bg-white/50 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all duration-200 hover:bg-white/80 resize-none shadow-sm"
                      placeholder="Description détaillée de la demande"
                    />
                    <FileText className="absolute left-3 top-3.5 w-5 h-5 text-green-600" />
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
                      className="w-full px-4 py-2 pl-11 bg-white/50 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all duration-200 hover:bg-white/80 resize-none shadow-sm"
                      placeholder="Ajouter des commentaires supplémentaires"
                    />
                    <FileText className="absolute left-3 top-3.5 w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Status and Dates Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-200">
                  <Calendar className="w-5 h-5 text-green-600" />
                  Statut et Dates
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full ml-2">Modifiable</span>
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
                        className="w-full px-4 py-2 pl-11 bg-white/50 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all duration-200 hover:bg-white/80 appearance-none cursor-pointer shadow-sm"
                      >
                        {statutOptions.map((statut) => (
                          <option key={statut} value={statut}>
                            {statut}
                          </option>
                        ))}
                      </select>
                      <ClipboardList className="absolute left-3 top-3.5 w-5 h-5 text-green-600" />
                      <svg
                        className="absolute right-3 top-4 w-4 h-4 text-green-600 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <p className="text-xs text-green-600 mt-1 font-medium">✓ Ce champ peut être modifié</p>
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
                        className="w-full px-4 py-2 pl-11 bg-white/50 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all duration-200 hover:bg-white/80 shadow-sm"
                      />
                      <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-xs text-green-600 mt-1 font-medium">✓ Ce champ peut être modifié</p>
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
                        className="w-full px-4 py-2 pl-11 bg-white/50 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all duration-200 hover:bg-white/80 shadow-sm"
                      />
                      <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-xs text-green-600 mt-1 font-medium">✓ Ce champ peut être modifié</p>
                  </div>
                </div>
              </div>

              {/* Relations Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-200">
                  <User className="w-5 h-5 text-green-600" />
                  Relations
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full ml-2">Modifiable</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="creePar" className="block text-sm font-semibold text-gray-700">
                      Créée par
                    </label>
                    <div className="relative">
                      <select
                        id="creePar"
                        name="creePar"
                        value={formData.creePar?.id || ""}
                        onChange={handleUserChange}
                        className="w-full px-4 py-2 pl-11 bg-white/50 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all duration-200 hover:bg-white/80 appearance-none cursor-pointer shadow-sm"
                      >
                        <option value="">Sélectionner un utilisateur</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.nom} {user.prenom} ({user.role})
                          </option>
                        ))}
                      </select>
                      <User className="absolute left-3 top-3.5 w-5 h-5 text-green-600" />
                      <svg
                        className="absolute right-3 top-4 w-4 h-4 text-green-600 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <p className="text-xs text-green-600 mt-1 font-medium">✓ Ce champ peut être modifié</p>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="validePar" className="block text-sm font-semibold text-gray-700">
                      Validée par
                    </label>
                    <div className="relative">
                      <select
                        id="validePar"
                        name="validePar"
                        value={formData.validePar?.id || ""}
                        onChange={handleUserChange}
                        className="w-full px-4 py-2 pl-11 bg-white/50 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all duration-200 hover:bg-white/80 appearance-none cursor-pointer shadow-sm"
                      >
                        <option value="">Sélectionner un utilisateur</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.nom} {user.prenom} ({user.role})
                          </option>
                        ))}
                      </select>
                      <User className="absolute left-3 top-3.5 w-5 h-5 text-green-600" />
                      <svg
                        className="absolute right-3 top-4 w-4 h-4 text-green-600 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <p className="text-xs text-green-600 mt-1 font-medium">✓ Ce champ peut être modifié</p>
                  </div>
                </div>

                {/* MODIFICATION: Sélection d'un seul article */}
                <div className="space-y-1">
                  <label htmlFor="article" className="block text-sm font-semibold text-gray-700">
                    Article associé
                  </label>
                  <div className="relative">
                    <select
                      id="article"
                      name="article"
                      value={formData.article?.id || ""} // Utiliser l'ID de l'article sélectionné
                      onChange={handleArticleChange}
                      className="w-full px-4 py-2 pl-11 bg-white/50 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all duration-200 hover:bg-white/80 appearance-none cursor-pointer shadow-sm"
                    >
                      <option value="">Sélectionner un article</option>
                      {articles.map((article) => (
                        <option key={article.id} value={article.id}>
                          {article.nom} (Réf: {article.reference})
                        </option>
                      ))}
                    </select>
                    <Package className="absolute left-3 top-3.5 w-5 h-5 text-green-600" />
                    <svg
                      className="absolute right-3 top-4 w-4 h-4 text-green-600 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {formData.article && (
                    <p className="text-xs text-green-600 mt-1 font-medium">
                      Article sélectionné: {formData.article.nom} (Réf: {formData.article.reference})
                    </p>
                  )}
                  <p className="text-xs text-green-600 mt-1 font-medium">✓ Ce champ peut être modifié</p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600 bg-cyan-50 px-4 py-2 rounded-xl border border-cyan-200">
                  <span className="font-semibold text-cyan-700">ID:</span> #{id}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white px-5 py-2.5 rounded-2xl flex items-center gap-3 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                >
                  <Save className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                  <span>{isSubmitting ? "Modification en cours..." : "Modifier la demande"}</span>
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
