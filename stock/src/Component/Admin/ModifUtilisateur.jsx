"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Save, UserCheck, User, Mail, Phone, MapPin, Shield, Lock, Eye } from "lucide-react"

export default function ModifUtilisateur() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    adresse: "",
    role: "",
    email: "",
    password: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [availableRoles, setAvailableRoles] = useState([])

  useEffect(() => {
    if (id) {
      fetchUtilisateur()
      fetchAvailableRoles()
    }
  }, [id])

  const fetchAvailableRoles = async () => {
    try {
      const response = await fetch("http://localhost:8082/api/utilisateurs/roles")
      if (response.ok) {
        const roles = await response.json()
        setAvailableRoles(roles)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des rôles:", error)
      // Fallback avec les rôles par défaut
      setAvailableRoles(["ADMIN", "MANAGER", "EMPLOYEE", "MAGASINIER"])
    }
  }

  const fetchUtilisateur = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`http://localhost:8082/api/utilisateurs/${id}`)
      if (!response.ok) {
        throw new Error("Utilisateur non trouvé")
      }
      const userData = await response.json()
      setFormData(userData)
    } catch (error) {
      console.error("Erreur lors du chargement de l'utilisateur:", error)
      setError("Impossible de charger les données de l'utilisateur")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    // Seul le rôle peut être modifié
    if (name === "role") {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Préparer l'objet utilisateur complet avec seulement le rôle modifié
      const fullUpdateData = {
        id: Number.parseInt(id),
        nom: formData.nom,
        prenom: formData.prenom,
        telephone: formData.telephone || "",
        adresse: formData.adresse || "",
        email: formData.email,
        password: formData.password, // Garder le mot de passe existant
        role: formData.role.toUpperCase(), // Seul le rôle est modifié
      }

      console.log("Modification avec PUT - Données complètes:", fullUpdateData)

      const response = await fetch(`http://localhost:8082/api/utilisateurs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fullUpdateData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erreur ${response.status}: ${errorText}`)
      }

      const responseData = await response.json()
      console.log("Rôle modifié avec succès:", responseData)

      alert("Rôle modifié avec succès !")
      navigate("/utilisateurs")
    } catch (error) {
      console.error("Erreur:", error)
      setError(error.message || "Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 p-8">
          <div className="flex items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-lg font-semibold text-gray-700">Chargement des données...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/utilisateurs")}
                className="group flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-all duration-200 bg-white/60 hover:bg-blue-50 px-4 py-2 rounded-xl shadow-sm hover:shadow-md border border-gray-200/50"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="font-medium">Retour</span>
              </button>

              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-2xl shadow-lg">
                  <UserCheck className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Modifier l'Utilisateur
                  </h1>
                  <p className="text-slate-600 mt-1">Modifiez le rôle de l'utilisateur</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-4 py-3">
            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
              <UserCheck className="w-6 h-6" />
              Modification utilisateur
            </h2>
            <p className="text-green-100 mt-1">Seul le rôle peut être modifié</p>
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
              {/* Personal Information Section - Read Only */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-200">
                  <Eye className="w-5 h-5 text-gray-600" />
                  Informations personnelles
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full ml-2">Lecture seule</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">Nom</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.nom || ""}
                        disabled
                        className="w-full px-4 py-2 pl-11 bg-gray-100/70 border border-gray-200 rounded-xl text-gray-600 cursor-not-allowed"
                      />
                      <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">Prénom</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.prenom || ""}
                        disabled
                        className="w-full px-4 py-2 pl-11 bg-gray-100/70 border border-gray-200 rounded-xl text-gray-600 cursor-not-allowed"
                      />
                      <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information Section - Read Only */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-200">
                  <Eye className="w-5 h-5 text-gray-600" />
                  Informations de contact
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full ml-2">Lecture seule</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">Email</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={formData.email || ""}
                        disabled
                        className="w-full px-4 py-2 pl-11 bg-gray-100/70 border border-gray-200 rounded-xl text-gray-600 cursor-not-allowed"
                      />
                      <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">Téléphone</label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={formData.telephone || "Non renseigné"}
                        disabled
                        className="w-full px-4 py-2 pl-11 bg-gray-100/70 border border-gray-200 rounded-xl text-gray-600 cursor-not-allowed"
                      />
                      <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">Adresse</label>
                  <div className="relative">
                    <textarea
                      value={formData.adresse || "Non renseignée"}
                      disabled
                      rows="2"
                      className="w-full px-4 py-2 pl-11 bg-gray-100/70 border border-gray-200 rounded-xl text-gray-600 cursor-not-allowed resize-none"
                    />
                    <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Security Section - Editable Role */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-200">
                  <Shield className="w-5 h-5 text-green-600" />
                  Permissions
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full ml-2">Modifiable</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="role" className="block text-sm font-semibold text-gray-700">
                      Rôle <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="role"
                        name="role"
                        value={formData.role || ""}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 pl-11 bg-white/50 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all duration-200 hover:bg-white/80 appearance-none cursor-pointer shadow-sm"
                      >
                        <option value="">Sélectionner un rôle</option>
                        <option value="admin">Administrateur</option>
                        <option value="manager">Manager</option>
                        <option value="employee">Employé</option>
                        <option value="magasinier">Magasinier</option>
                        {availableRoles.map((role) => (
                          <option key={role} value={role.toLowerCase()}>
                            {role.charAt(0) + role.slice(1).toLowerCase()}
                          </option>
                        ))}
                      </select>
                      <Shield className="absolute left-3 top-3.5 w-5 h-5 text-green-600" />
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
                    <label className="block text-sm font-semibold text-gray-700">Mot de passe</label>
                    <div className="relative">
                      <input
                        type="password"
                        value="••••••••"
                        disabled
                        className="w-full px-4 py-2 pl-11 bg-gray-100/70 border border-gray-200 rounded-xl text-gray-600 cursor-not-allowed"
                      />
                      <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Le mot de passe ne peut pas être modifié ici</p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-xl border border-blue-200">
                  <span className="font-semibold text-blue-700">ID:</span> #{id}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white px-5 py-2.5 rounded-2xl flex items-center gap-3 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                >
                  <Save className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                  <span>{isSubmitting ? "Modification en cours..." : "Modifier le rôle"}</span>
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
