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
  Building2,
  BadgeCheck,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

const ProfilePage = () => {
  const navigate = useNavigate()
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
      alert("Vous devez être connecté pour accéder à cette page")
      navigate("/auth")
    }
  }, [currentUser, navigate])

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
        role: user.role,
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

  // Fonction pour obtenir la couleur du badge selon le rôle - COULEURS AUTHPAGES
  const getRoleBadge = (role) => {
    const roles = {
      ADMIN: { color: "from-gray-700 to-yellow-600", text: "Administrateur", icon: Shield },
      MANAGER: { color: "from-gray-700 to-yellow-600", text: "Manager", icon: BadgeCheck },
      EMPLOYEE: { color: "from-gray-700 to-yellow-600", text: "Employé", icon: User },
      MAGASINIER: { color: "from-gray-700 to-yellow-600", text: "Magasinier", icon: Building2 },
    }
    return roles[role] || roles.EMPLOYEE
  }

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-amber-50 via-stone-50 to-yellow-100 flex items-center justify-center p-4 fixed inset-0 overflow-auto">
        <div className="text-center bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
          <div className="w-16 h-16 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-700 text-lg font-semibold">Chargement du profil...</p>
          <p className="text-slate-500 text-sm mt-2">Récupération de vos informations</p>
        </div>
      </div>
    )
  }

  const roleBadge = getRoleBadge(user?.role)
  const RoleIcon = roleBadge.icon

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-amber-50 via-stone-50 to-yellow-100 p-4 fixed inset-0 overflow-auto">
      <div className="max-w-5xl mx-auto">
        {/* Header avec navigation */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-slate-600 hover:text-yellow-700 mb-6 transition-all duration-300 group bg-white rounded-xl px-4 py-2 shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-medium">Retour</span>
          </button>

          {/* En-tête du profil avec design professionnel inspiré de l'image */}
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/50 overflow-hidden">
            {/* Banner avec gradient bleu-orange comme dans l'image */}
            <div className="bg-gradient-to-r from-slate-700 via-slate-600 to-orange-500 h-40 relative">
              <div className="absolute inset-0 bg-black/10"></div>
              {/* Motif décoratif subtil */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full opacity-20"></div>
                <div className="absolute bottom-4 left-4 w-24 h-24 bg-white rounded-full opacity-15"></div>
              </div>
            </div>
            
            {/* Contenu du profil avec nom d'utilisateur professionnel */}
            <div className="px-8 pb-8 -mt-20 relative">
              <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                  {/* Avatar professionnel avec cercles décoratifs - COULEURS AUTHPAGES */}
                  <div className="relative">
                    <div className="w-40 h-40 bg-gradient-to-br from-gray-600 via-gray-700 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white relative overflow-hidden">
                      <UserCircle className="w-24 h-24 text-white" />
                      {/* Cercle décoratif interne */}
                      <div className="absolute inset-4 border-2 border-white/30 rounded-full"></div>
                    </div>
                    {/* Badge de rôle repositionné - COULEURS AUTHPAGES */}
                    <div className="absolute -bottom-3 -right-3">
                      <div className={`w-16 h-16 bg-gradient-to-br ${roleBadge.color} rounded-full flex items-center justify-center shadow-lg border-3 border-white`}>
                        <RoleIcon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    {/* Cercle décoratif externe - COULEURS AUTHPAGES */}
                    <div className="absolute -top-2 -left-2 w-44 h-44 border-2 border-yellow-200 rounded-full opacity-50"></div>
                  </div>
                  
                  {/* Informations utilisateur avec design professionnel */}
                  <div className="space-y-4">
                    {/* Nom d'utilisateur avec style professionnel - COULEURS AUTHPAGES */}
                    <div className="bg-gradient-to-r from-gray-50 to-yellow-50 rounded-2xl p-6 shadow-lg border border-slate-200">
                      <div className="text-center sm:text-left">
                        <h1 className="text-4xl font-bold text-slate-800 mb-2 tracking-wide">
                          {user?.prenom} {user?.nom}
                        </h1>
                        <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
                          <div className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${roleBadge.color} text-white rounded-full text-base font-bold shadow-lg`}>
                            <RoleIcon className="w-5 h-5 mr-3" />
                            {roleBadge.text}
                          </div>
                        </div>
                        <div className="flex items-center justify-center sm:justify-start text-slate-600 gap-3">
                          <Building2 className="w-5 h-5 text-yellow-500" />
                          <span className="text-base font-semibold">EXPROM FACILITIES</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bouton d'édition - COULEURS AUTHPAGES */}
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-700 to-yellow-600 text-white rounded-2xl hover:from-gray-800 hover:to-yellow-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 text-lg"
                  >
                    <Edit3 className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-200" />
                    Modifier le profil
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire de profil */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/50 overflow-hidden">
          {/* En-tête de section - COULEURS AUTHPAGES */}
          <div className="bg-gradient-to-r from-gray-100 to-yellow-50 px-8 py-6 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <User className="w-7 h-7 text-yellow-600" />
              Informations personnelles
            </h2>
            <p className="text-slate-600 mt-1 text-sm">Gérez vos informations de compte professionnel</p>
          </div>

          <div className="p-8">
            {/* Alerte d'erreur générale */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-800 mb-1">Erreur de connexion</h3>
                    <p className="text-red-700 text-sm mb-3">{errors.general}</p>
                    <div className="bg-red-100 rounded-lg p-3">
                      <p className="text-red-700 text-xs font-medium flex items-center gap-2">
                        💡 <span>Vérifiez que votre serveur Spring Boot est démarré sur <code className="bg-red-200 px-1 rounded">http://localhost:8082</code></span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Grille des champs avec design amélioré - COULEURS AUTHPAGES */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Nom */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-700 bg-gradient-to-r from-gray-700 to-yellow-600 bg-clip-text text-transparent">
                  NOM DE FAMILLE
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <User className="w-5 h-5 text-yellow-500" />
                  </div>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-300 font-medium ${
                      isEditing
                        ? "border-yellow-300 focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 hover:border-yellow-400 bg-white shadow-lg"
                        : "bg-gradient-to-r from-gray-50 to-yellow-50 border-slate-200 cursor-not-allowed text-slate-700"
                    } ${errors.nom ? "border-red-500 bg-red-50 focus:ring-red-200" : ""}`}
                  />
                  {errors.nom && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.nom}</p>}
                </div>
              </div>

              {/* Prénom */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-700 bg-gradient-to-r from-gray-700 to-yellow-600 bg-clip-text text-transparent">
                  PRÉNOM
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <User className="w-5 h-5 text-yellow-500" />
                  </div>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-300 font-medium ${
                      isEditing
                        ? "border-yellow-300 focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 hover:border-yellow-400 bg-white shadow-lg"
                        : "bg-gradient-to-r from-gray-50 to-yellow-50 border-slate-200 cursor-not-allowed text-slate-700"
                    } ${errors.prenom ? "border-red-500 bg-red-50 focus:ring-red-200" : ""}`}
                  />
                  {errors.prenom && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.prenom}</p>}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-700 bg-gradient-to-r from-gray-700 to-yellow-600 bg-clip-text text-transparent">
                  ADRESSE EMAIL
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Mail className="w-5 h-5 text-yellow-500" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-300 font-medium ${
                      isEditing
                        ? "border-yellow-300 focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 hover:border-yellow-400 bg-white shadow-lg"
                        : "bg-gradient-to-r from-gray-50 to-yellow-50 border-slate-200 cursor-not-allowed text-slate-700"
                    } ${errors.email ? "border-red-500 bg-red-50 focus:ring-red-200" : ""}`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.email}</p>}
                </div>
              </div>

              {/* Téléphone */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-700 bg-gradient-to-r from-gray-700 to-yellow-600 bg-clip-text text-transparent">
                  TÉLÉPHONE
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Phone className="w-5 h-5 text-yellow-500" />
                  </div>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-300 font-medium ${
                      isEditing
                        ? "border-yellow-300 focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 hover:border-yellow-400 bg-white shadow-lg"
                        : "bg-gradient-to-r from-gray-50 to-yellow-50 border-slate-200 cursor-not-allowed text-slate-700"
                    }`}
                  />
                </div>
              </div>

              {/* Adresse */}
              <div className="space-y-3 lg:col-span-2">
                <label className="block text-sm font-bold text-slate-700 bg-gradient-to-r from-gray-700 to-yellow-600 bg-clip-text text-transparent">
                  ADRESSE
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-4">
                    <MapPin className="w-5 h-5 text-yellow-500" />
                  </div>
                  <textarea
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={3}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-300 font-medium resize-none ${
                      isEditing
                        ? "border-yellow-300 focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 hover:border-yellow-400 bg-white shadow-lg"
                        : "bg-gradient-to-r from-gray-50 to-yellow-50 border-slate-200 cursor-not-allowed text-slate-700"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Section mot de passe */}
            {isEditing && (
              <div className="mt-12 pt-8 border-t border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <Lock className="w-6 h-6 text-yellow-600" />
                  Changer le mot de passe
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Mot de passe actuel */}
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700 bg-gradient-to-r from-gray-700 to-yellow-600 bg-clip-text text-transparent">
                      MOT DE PASSE ACTUEL
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <Lock className="w-5 h-5 text-yellow-500" />
                      </div>
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl transition-all duration-300 font-medium border-yellow-300 focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 hover:border-yellow-400 bg-white shadow-lg ${
                          errors.currentPassword ? "border-red-500 bg-red-50 focus:ring-red-200" : ""
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-yellow-600"
                      >
                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                      {errors.currentPassword && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.currentPassword}</p>}
                    </div>
                  </div>

                  {/* Nouveau mot de passe */}
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700 bg-gradient-to-r from-gray-700 to-yellow-600 bg-clip-text text-transparent">
                      NOUVEAU MOT DE PASSE
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <Lock className="w-5 h-5 text-yellow-500" />
                      </div>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl transition-all duration-300 font-medium border-yellow-300 focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 hover:border-yellow-400 bg-white shadow-lg ${
                          errors.newPassword ? "border-red-500 bg-red-50 focus:ring-red-200" : ""
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-yellow-600"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                      {errors.newPassword && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.newPassword}</p>}
                    </div>
                  </div>

                  {/* Confirmer mot de passe */}
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700 bg-gradient-to-r from-gray-700 to-yellow-600 bg-clip-text text-transparent">
                      CONFIRMER LE MOT DE PASSE
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <Lock className="w-5 h-5 text-yellow-500" />
                      </div>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-300 font-medium border-yellow-300 focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 hover:border-yellow-400 bg-white shadow-lg ${
                          errors.confirmPassword ? "border-red-500 bg-red-50 focus:ring-red-200" : ""
                        }`}
                      />
                      {errors.confirmPassword && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Boutons d'action - COULEURS AUTHPAGES */}
            {isEditing && (
              <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-slate-200">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gray-700 to-yellow-600 text-white rounded-xl hover:from-gray-800 hover:to-yellow-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-3" />
                      Sauvegarder les modifications
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex-1 inline-flex items-center justify-center px-8 py-4 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <X className="w-5 h-5 mr-3" />
                  Annuler
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage

