"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  Save,
  PackageCheck,
  Package,
  DollarSign,
  Hash,
  Tag,
  ImageIcon,
  Layers,
  BarChart3,
} from "lucide-react"

export default function ModifArticleMM() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    reference: "",
    nom: "",
    description: "",
    designation: "",
    categorie: "",
    prix_unitaire: "",
    stock: "",
    unite: "",
    etat: "",
    imageUrl: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (id) {
      fetchArticle()
    }
  }, [id])

  const fetchArticle = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`http://localhost:8082/api/articles/${id}`)
      if (!response.ok) {
        throw new Error("Article non trouvé")
      }
      const articleData = await response.json()
      setFormData({
        ...articleData,
        prix_unitaire: articleData.prix_unitaire?.toString() || "",
        stock: articleData.stock?.toString() || "",
      })
    } catch (error) {
      console.error("Erreur lors du chargement de l'article:", error)
      setError("Impossible de charger les données de l'article")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formattedData = {
        ...formData,
        id: Number.parseInt(id),
        prix_unitaire: Number.parseFloat(formData.prix_unitaire),
        stock: Number.parseInt(formData.stock),
      }

      console.log("Modification de l'article - Données:", formattedData)

      const response = await fetch(`http://localhost:8082/api/articles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erreur ${response.status}: ${errorText}`)
      }

      const responseData = await response.json()
      console.log("Article modifié avec succès:", responseData)

      alert("Article modifié avec succès !")
      navigate("/articlesMM")
    } catch (error) {
      console.error("Erreur:", error)
      setError(error.message || "Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 p-8">
          <div className="flex items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            <span className="text-lg font-semibold text-gray-700">Chargement des données...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-100">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/articlesMM")}
                className="group flex items-center gap-2 text-slate-600 hover:text-orange-600 transition-all duration-200 bg-white/60 hover:bg-orange-50 px-4 py-2 rounded-xl shadow-sm hover:shadow-md border border-gray-200/50"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="font-medium">Retour</span>
              </button>

              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-2xl shadow-lg">
                  <PackageCheck className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Modifier l'Article
                  </h1>
                  <p className="text-slate-600 mt-1">Modifiez les informations de l'article</p>
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
              <PackageCheck className="w-6 h-6" />
              Modification article
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
                  <Package className="w-5 h-5 text-green-600" />
                  Informations de base
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full ml-2">Modifiable</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="reference" className="block text-sm font-semibold text-gray-700">
                      Référence <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="reference"
                        name="reference"
                        value={formData.reference}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 pl-11 bg-white/50 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all duration-200 hover:bg-white/80 shadow-sm"
                        placeholder="REF-001"
                      />
                      <Hash className="absolute left-3 top-3.5 w-5 h-5 text-green-600" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="nom" className="block text-sm font-semibold text-gray-700">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="nom"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        required
                        maxLength="100"
                        className="w-full px-4 py-2 pl-11 bg-white/50 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all duration-200 hover:bg-white/80 shadow-sm"
                        placeholder="Nom de l'article"
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
                      maxLength="255"
                      rows="3"
                      className="w-full px-4 py-2 pl-11 bg-white/50 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all duration-200 hover:bg-white/80 resize-none shadow-sm"
                      placeholder="Description détaillée de l'article"
                    />
                    <Layers className="absolute left-3 top-3.5 w-5 h-5 text-green-600" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="designation" className="block text-sm font-semibold text-gray-700">
                    Désignation
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="designation"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      maxLength="100"
                      className="w-full px-4 py-2 pl-11 bg-white/50 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all duration-200 hover:bg-white/80 shadow-sm"
                      placeholder="Désignation commerciale"
                    />
                    <Tag className="absolute left-3 top-3.5 w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Category and Classification Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-200">
                  <Tag className="w-5 h-5 text-green-600" />
                  Catégorie et classification
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full ml-2">Modifiable</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="categorie" className="block text-sm font-semibold text-gray-700">
                      Catégorie <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="categorie"
                        name="categorie"
                        value={formData.categorie}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 pl-11 bg-white/50 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all duration-200 hover:bg-white/80 appearance-none cursor-pointer shadow-sm"
                      >
                        <option value="">Sélectionner une catégorie</option>
                        <option value="electronique">Électronique</option>
                        <option value="alimentaire">Alimentaire</option>
                        <option value="textile">Textile</option>
                        <option value="mobilier">Mobilier</option>
                        <option value="outillage">Outillage</option>
                        <option value="cosmetique">Cosmétique</option>
                        <option value="sport">Sport</option>
                        <option value="autre">Autre</option>
                      </select>
                      <Tag className="absolute left-3 top-3.5 w-5 h-5 text-green-600" />
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
                    <label htmlFor="etat" className="block text-sm font-semibold text-gray-700">
                      État
                    </label>
                    <div className="relative">
                      <select
                        id="etat"
                        name="etat"
                        value={formData.etat}
                        onChange={handleChange}
                        className="w-full px-4 py-2 pl-11 bg-white/50 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all duration-200 hover:bg-white/80 appearance-none cursor-pointer shadow-sm"
                      >
                        <option value="">Sélectionner un état</option>
                        <option value="bien">Bien</option>
                        <option value="moyenne">Moyenne</option>
                        <option value="faible">Faible</option>
                      </select>
                      <BarChart3 className="absolute left-3 top-3.5 w-5 h-5 text-green-600" />
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
              </div>

              {/* Price and Stock Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-200">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Prix et stock
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full ml-2">Modifiable</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="prix_unitaire" className="block text-sm font-semibold text-gray-700">
                      Prix unitaire (€) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="prix_unitaire"
                        name="prix_unitaire"
                        value={formData.prix_unitaire}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 pl-11 bg-white/50 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all duration-200 hover:bg-white/80 shadow-sm"
                        placeholder="0.00"
                      />
                      <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-xs text-green-600 mt-1 font-medium">✓ Ce champ peut être modifié</p>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="stock" className="block text-sm font-semibold text-gray-700">
                      Stock <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                        min="0"
                        className="w-full px-4 py-2 pl-11 bg-white/50 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all duration-200 hover:bg-white/80 shadow-sm"
                        placeholder="0"
                      />
                      <BarChart3 className="absolute left-3 top-3.5 w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-xs text-green-600 mt-1 font-medium">✓ Ce champ peut être modifié</p>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="unite" className="block text-sm font-semibold text-gray-700">
                      Unité
                    </label>
                    <div className="relative">
                      <select
                        id="unite"
                        name="unite"
                        value={formData.unite}
                        onChange={handleChange}
                        className="w-full px-4 py-2 pl-11 bg-white/50 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all duration-200 hover:bg-white/80 appearance-none cursor-pointer shadow-sm"
                      >
                        <option value="">Sélectionner une unité</option>
                        <option value="pièce">Pièce</option>
                        <option value="kg">Kilogramme</option>
                        <option value="g">Gramme</option>
                        <option value="l">Litre</option>
                        <option value="ml">Millilitre</option>
                        <option value="m">Mètre</option>
                        <option value="cm">Centimètre</option>
                        <option value="m²">Mètre carré</option>
                        <option value="m³">Mètre cube</option>
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
                    <p className="text-xs text-green-600 mt-1 font-medium">✓ Ce champ peut être modifié</p>
                  </div>
                </div>
              </div>

              {/* Image Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-200">
                  <ImageIcon className="w-5 h-5 text-green-600" />
                  Image
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full ml-2">Modifiable</span>
                </h3>

                <div className="space-y-1">
                  <label htmlFor="imageUrl" className="block text-sm font-semibold text-gray-700">
                    URL de l'image
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      className="w-full px-4 py-2 pl-11 bg-white/50 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all duration-200 hover:bg-white/80 shadow-sm"
                      placeholder="https://exemple.com/image.jpg"
                    />
                    <ImageIcon className="absolute left-3 top-3.5 w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-xs text-green-600 mt-1 font-medium">✓ Ce champ peut être modifié</p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600 bg-orange-50 px-4 py-2 rounded-xl border border-orange-200">
                  <span className="font-semibold text-orange-700">ID:</span> #{id}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white px-5 py-2.5 rounded-2xl flex items-center gap-3 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                >
                  <Save className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                  <span>{isSubmitting ? "Modification en cours..." : "Modifier l'article"}</span>
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
