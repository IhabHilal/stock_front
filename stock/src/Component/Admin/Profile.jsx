"use client"

import { useState, useEffect } from "react"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Edit3,
  Save,
  X,
  Eye,
  EyeOff,
  UserCircle,
  Shield,
  ArrowLeft,
  AlertCircle,
} from "lucide-react"
import { useNavigate } from "react-router-dom" // Import useNavigate

const ProfilePage = () => {
  const navigate = useNavigate() // Initialize useNavigate
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [errors, setErrors] = useState({})

  // États pour les données du formulaire
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const API_BASE_URL = "http://localhost:8082/api"

  // Récupérer l'utilisateur connecté depuis le localStorage
  const getCurrentUser = () => {
    try {
      const userStr = localStorage.getItem("currentUser")
      return userStr ? JSON.parse(userStr) : null
    } catch (error) {
      console.error("Erreur lecture localStorage:", error)
      return null
    }
  }

  const [currentUser, setCurrentUser] = useState(getCurrentUser())

  // Charger les données utilisateur au montage du composant
  useEffect(() => {
    if (currentUser) {
      loadUserData()
    } else {
      // Rediriger vers la page de connexion si pas d'utilisateur connecté
      alert("Vous devez être connecté pour accéder à cette page")
      navigate("/auth") // Use navigate for redirection
    }
  }, [currentUser, navigate]) // Add navigate to dependency array

  const loadUserData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/utilisateurs/${currentUser.id}`)
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des données")
      }
      const userData = await response.json()
      setUser(userData)
      setFormData({
        nom: userData.nom || "",
        prenom: userData.prenom || "",
        email: userData.email || "",
        telephone: userData.telephone || "",
        adresse: userData.adresse || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      console.error("Erreur:", error)
      setErrors({
        general:
          "Impossible de charger les données du profil. Vérifiez que le serveur backend est démarré sur le port 8082.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Validation des données
  const validateForm = () => {
    const newErrors = {}

    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis"
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis"

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email invalide"
    }

    // Validation du mot de passe si changement demandé
    if (formData.newPassword.trim()) {
      if (!formData.currentPassword.trim()) {
        newErrors.currentPassword = "Mot de passe actuel requis"
      }
      if (formData.newPassword.length < 6) {
        newErrors.newPassword = "Minimum 6 caractères"
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Les mots de passe ne correspondent pas"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Sauvegarder les modifications
  const handleSave = async () => {
    if (!validateForm()) return

    setIsSaving(true)
    setErrors({})

    try {
      // Vérifier le mot de passe actuel si changement demandé
      if (formData.newPassword.trim() && formData.currentPassword !== user.password) {
        setErrors({ currentPassword: "Mot de passe actuel incorrect" })
        setIsSaving(false)
        return
      }

      // Préparer les données à envoyer
      const updateData = {
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        email: formData.email.trim(),
        telephone: formData.telephone.trim() || null,
        adresse: formData.adresse.trim() || null,
        password: formData.newPassword.trim() || user.password,
        role: user.role, // Garder le rôle existant
      }

      const response = await fetch(`${API_BASE_URL}/utilisateurs/${currentUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour")
      }

      const updatedUser = await response.json()
      setUser(updatedUser)

      // Mettre à jour les données dans le localStorage
      const updatedCurrentUser = {
        ...currentUser,
        nom: updatedUser.nom,
        prenom: updatedUser.prenom,
        email: updatedUser.email,
        telephone: updatedUser.telephone,
        adresse: updatedUser.adresse,
      }
      setCurrentUser(updatedCurrentUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser))

      setIsEditing(false)

      // Réinitialiser les champs de mot de passe
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))

      alert("Profil mis à jour avec succès!")
    } catch (error) {
      console.error("Erreur:", error)
      setErrors({ general: "Erreur lors de la mise à jour du profil. Vérifiez que le serveur backend est démarré." })
    } finally {
      setIsSaving(false)
    }
  }

  // Gestion des changements d'input
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  // Annuler les modifications
  const handleCancel = () => {
    setFormData({
      nom: user.nom || "",
      prenom: user.prenom || "",
      email: user.email || "",
      telephone: user.telephone || "",
      adresse: user.adresse || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setErrors({})
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Chargement du profil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)} // Use navigate(-1) to go back
            className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Retour
          </button>

          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200/50">
            <div className="flex flex-col md:flex-row items-center md:justify-between gap-6">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <UserCircle className="w-14 h-14 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    {user?.prenom} {user?.nom}
                  </h1>
                  <div className="flex items-center mt-2">
                    <Shield className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-gray-600 capitalize bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                      {user?.role?.toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  <Edit3 className="w-5 h-5 mr-2 group-hover:rotate-6 transition-transform duration-200" />
                  Modifier le profil
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Formulaire de profil */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200/50">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200">
            Informations personnelles
          </h2>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl mb-6 shadow-sm">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-red-800">Erreur de connexion</h3>
                  <p className="text-sm text-red-700 mt-1">{errors.general}</p>
                  <p className="text-xs text-red-600 mt-2">
                    💡 Assurez-vous que votre serveur Spring Boot est démarré sur <code>http://localhost:8082</code>
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-all duration-200 ${
                    isEditing
                      ? "border-gray-300 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400"
                      : "bg-gray-50 border-gray-200 cursor-not-allowed text-gray-700"
                  } ${errors.nom ? "border-red-500 bg-red-50" : ""}`}
                />
                {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
              </div>
            </div>
            {/* Prénom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-all duration-200 ${
                    isEditing
                      ? "border-gray-300 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400"
                      : "bg-gray-50 border-gray-200 cursor-not-allowed text-gray-700"
                  } ${errors.prenom ? "border-red-500 bg-red-50" : ""}`}
                />
                {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom}</p>}
              </div>
            </div>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-all duration-200 ${
                    isEditing
                      ? "border-gray-300 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400"
                      : "bg-gray-50 border-gray-200 cursor-not-allowed text-gray-700"
                  } ${errors.email ? "border-red-500 bg-red-50" : ""}`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>
            {/* Téléphone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Optionnel"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-all duration-200 ${
                    isEditing
                      ? "border-gray-300 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400"
                      : "bg-gray-50 border-gray-200 cursor-not-allowed text-gray-700"
                  }`}
                />
              </div>
            </div>
            {/* Adresse */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Optionnel"
                  rows="3"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-all duration-200 resize-none ${
                    isEditing
                      ? "border-gray-300 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400"
                      : "bg-gray-50 border-gray-200 cursor-not-allowed text-gray-700"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Section changement de mot de passe */}
          {isEditing && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Changer le mot de passe</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Laissez vide si vous ne souhaitez pas changer votre mot de passe
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Mot de passe actuel */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe actuel</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 ${
                        errors.currentPassword ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    {errors.currentPassword && <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>}
                  </div>
                </div>
                {/* Nouveau mot de passe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 ${
                        errors.newPassword ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
                  </div>
                </div>
                {/* Confirmer nouveau mot de passe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer nouveau mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 ${
                        errors.confirmPassword ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                      }`}
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Boutons d'action */}
          {isEditing && (
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="group px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95"
              >
                <X className="w-5 h-5 mr-2 inline group-hover:rotate-6 transition-transform duration-200" />
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <Save className="w-5 h-5 mr-2 group-hover:rotate-6 transition-transform duration-200" />
                )}
                <span>Sauvegarder</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
