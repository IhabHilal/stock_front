"use client"
import { useState } from "react"
import { useNavigate } from "react-router-dom" // Importez useNavigate
import { Eye, EyeOff, User, Lock, Mail, Phone, MapPin, UserPlus, LogIn, ArrowLeft } from "lucide-react"

// Composants définis en dehors du composant principal pour éviter les re-créations
const InputField = ({ icon, type = "text", placeholder, value, onChange, error, name }) => {
  const IconComponent = icon
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <IconComponent className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
          error ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

const PasswordField = ({ placeholder, value, onChange, error, name, showPassword, setShowPassword }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Lock className="h-5 w-5 text-gray-400" />
    </div>
    <input
      type={showPassword ? "text" : "password"}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
        error ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
      }`}
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute inset-y-0 right-0 pr-3 flex items-center"
    >
      {showPassword ? (
        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
      ) : (
        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
      )}
    </button>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
)

const AuthPages = () => {
  const [currentPage, setCurrentPage] = useState("signin")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate() // Initialisez useNavigate

  // États pour les formulaires
  const [signinData, setSigninData] = useState({
    email: "",
    password: "",
  })
  const [signupData, setSignupData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})

  // Configuration API
  const API_BASE_URL = "http://localhost:8082/api"

  // Validation des champs
  const validateSignin = () => {
    const newErrors = {}
    if (!signinData.email.trim()) {
      newErrors.email = "Email requis"
    } else if (!/\S+@\S+\.\S+/.test(signinData.email)) {
      newErrors.email = "Format email invalide"
    }
    if (!signinData.password.trim()) {
      newErrors.password = "Mot de passe requis"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateSignup = () => {
    const newErrors = {}
    if (!signupData.nom.trim()) newErrors.nom = "Nom requis"
    if (!signupData.prenom.trim()) newErrors.prenom = "Prénom requis"
    if (!signupData.email.trim()) {
      newErrors.email = "Email requis"
    } else if (!/\S+@\S+\.\S+/.test(signupData.email)) {
      newErrors.email = "Format email invalide"
    }
    if (!signupData.password.trim()) {
      newErrors.password = "Mot de passe requis"
    } else if (signupData.password.length < 6) {
      newErrors.password = "Minimum 6 caractères"
    }
    if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Gestion de la connexion avec votre backend Spring Security
  const handleSignin = async () => {
    if (!validateSignin()) return
    setIsLoading(true)
    setErrors({})

    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: signinData.email,
          password: signinData.password,
        }),
      })

      if (response.ok) {
        const user = await response.json()
        // Connexion réussie - stocker les informations utilisateur dans localStorage
        localStorage.setItem("currentUser", JSON.stringify(user))
        alert(`Connexion réussie! Bienvenue ${user.prenom} ${user.nom}`)

        // Redirection basée sur le rôle de l'utilisateur
        if (user.role === "ADMIN") {
          navigate("/dash-admin")
        } else if (user.role === "EMPLOYEE") {
          navigate("/articlesE")
        } else if (user.role === "MANAGER") {
          navigate("/articlesM")
        } else if (user.role === "MAGASINIER") {
          navigate("/articlesMM")
        }else {
          // Fallback pour les rôles non reconnus ou par défaut
          navigate("/")
        }
      } else {
        const errorData = await response.json()
        setErrors({ general: errorData.message || "Email ou mot de passe incorrect." })
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error)
      setErrors({ general: "Erreur de connexion. Vérifiez que le serveur est démarré et accessible." })
    } finally {
      setIsLoading(false)
    }
  }

  // Gestion de l'inscription avec votre backend
  const handleSignup = async () => {
    if (!validateSignup()) return
    setIsLoading(true)
    setErrors({})

    try {
      // Vérifier si l'email existe déjà (cette vérification peut aussi être faite côté serveur)
      const checkResponse = await fetch(`${API_BASE_URL}/utilisateurs`)
      if (checkResponse.ok) {
        const existingUsers = await checkResponse.json()
        const emailExists = existingUsers.some((user) => user.email === signupData.email)
        if (emailExists) {
          setErrors({ email: "Cet email est déjà utilisé" })
          setIsLoading(false)
          return
        }
      }

      // Créer le nouvel utilisateur
      const newUser = {
        nom: signupData.nom.trim(),
        prenom: signupData.prenom.trim(),
        email: signupData.email.trim(),
        telephone: signupData.telephone.trim() || null,
        adresse: signupData.adresse.trim() || null,
        password: signupData.password, // Le mot de passe est envoyé en texte clair, le backend le hachera
        role: "EMPLOYEE", // Par défaut comme demandé
      }

      const response = await fetch(`${API_BASE_URL}/utilisateurs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur lors de la création du compte")
      }

      const createdUser = await response.json()
      // Réinitialiser le formulaire
      setSignupData({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        adresse: "",
        password: "",
        confirmPassword: "",
      })
      setErrors({})
      alert(
        `Compte créé avec succès! Bienvenue ${createdUser.prenom} ${createdUser.nom}. Vous pouvez maintenant vous connecter.`,
      )
      setCurrentPage("signin")
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error)
      setErrors({
        general: error.message || "Erreur lors de la création du compte. Vérifiez que le serveur est démarré.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handlers pour les changements d'inputs - version simplifiée
  const handleSigninChange = (e) => {
    const { name, value } = e.target
    setSigninData((prev) => ({
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

  const handleSignupChange = (e) => {
    const { name, value } = e.target
    setSignupData((prev) => ({
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Sign In Page */}
        {currentPage === "signin" && (
          <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <LogIn className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Se connecter</h2>
              <p className="text-gray-600">Accédez à votre espace personnel</p>
            </div>
            {errors.general && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {errors.general}
              </div>
            )}
            <div className="space-y-6">
              <InputField
                icon={Mail}
                type="email"
                name="email"
                placeholder="Adresse email"
                value={signinData.email}
                onChange={handleSigninChange}
                error={errors.email}
              />
              <PasswordField
                name="password"
                placeholder="Mot de passe"
                value={signinData.password}
                onChange={handleSigninChange}
                error={errors.password}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
              <button
                onClick={handleSignin}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Se connecter</span>
                  </>
                )}
              </button>
            </div>
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Pas encore de compte ?{" "}
                <button
                  onClick={() => {
                    setCurrentPage("signup")
                    setErrors({})
                  }}
                  className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors"
                >
                  Créer un compte
                </button>
              </p>
            </div>
          </div>
        )}
        {/* Sign Up Page */}
        {currentPage === "signup" && (
          <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300">
            <div className="text-center mb-8 relative">
              <button
                onClick={() => {
                  setCurrentPage("signin")
                  setErrors({})
                }}
                className="absolute -top-4 -left-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <UserPlus className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Créer un compte</h2>
              <p className="text-gray-600">Rejoignez notre plateforme</p>
            </div>
            {errors.general && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {errors.general}
              </div>
            )}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  icon={User}
                  name="nom"
                  placeholder="Nom"
                  value={signupData.nom}
                  onChange={handleSignupChange}
                  error={errors.nom}
                />
                <InputField
                  icon={User}
                  name="prenom"
                  placeholder="Prénom"
                  value={signupData.prenom}
                  onChange={handleSignupChange}
                  error={errors.prenom}
                />
              </div>
              <InputField
                icon={Mail}
                type="email"
                name="email"
                placeholder="Adresse email"
                value={signupData.email}
                onChange={handleSignupChange}
                error={errors.email}
              />
              <InputField
                icon={Phone}
                name="telephone"
                placeholder="Téléphone (optionnel)"
                value={signupData.telephone}
                onChange={handleSignupChange}
              />
              <InputField
                icon={MapPin}
                name="adresse"
                placeholder="Adresse (optionnel)"
                value={signupData.adresse}
                onChange={handleSignupChange}
              />
              <PasswordField
                name="password"
                placeholder="Mot de passe"
                value={signupData.password}
                onChange={handleSignupChange}
                error={errors.password}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
              <PasswordField
                name="confirmPassword"
                placeholder="Confirmer le mot de passe"
                value={signupData.confirmPassword}
                onChange={handleSignupChange}
                error={errors.confirmPassword}
                showPassword={showConfirmPassword}
                setShowPassword={setShowConfirmPassword}
              />
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-700">
                  <span className="font-semibold">Note:</span> Votre rôle sera automatiquement défini comme "Employé"
                </p>
              </div>
              <button
                onClick={handleSignup}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 focus:ring-4 focus:ring-purple-300 transition-all duration-200 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Créer mon compte</span>
                  </>
                )}
              </button>
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Déjà un compte ?{" "}
                <button
                  onClick={() => {
                    setCurrentPage("signin")
                    setErrors({})
                  }}
                  className="text-purple-600 hover:text-purple-800 font-semibold hover:underline transition-colors"
                >
                  Se connecter
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthPages
