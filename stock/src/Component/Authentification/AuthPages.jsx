"use client"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, User, Lock, Mail, Phone, MapPin, UserPlus, LogIn, ArrowLeft } from "lucide-react"

// Composants définis en dehors du composant principal pour éviter les re-créations
const InputField = ({ icon, type = "text", placeholder, value, onChange, error, name }) => {
  const IconComponent = icon
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <IconComponent className="h-5 w-5 text-slate-400" />
      </div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-slate-50 focus:bg-white ${
          error ? "border-red-500 bg-red-50" : "border-slate-200 hover:border-slate-300"
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

const PasswordField = ({ placeholder, value, onChange, error, name, showPassword, setShowPassword }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Lock className="h-5 w-5 text-slate-400" />
    </div>
    <input
      type={showPassword ? "text" : "password"}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full pl-10 pr-12 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-slate-50 focus:bg-white ${
        error ? "border-red-500 bg-red-50" : "border-slate-200 hover:border-slate-300"
      }`}
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute inset-y-0 right-0 pr-3 flex items-center"
    >
      {showPassword ? (
        <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
      ) : (
        <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
      )}
    </button>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
)

const AuthPages = () => {
  const [currentPage, setCurrentPage] = useState("signin")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

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
        password: signupData.password,
        role: "EMPLOYEE",
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

  // Handlers pour les changements d'inputs
  const handleSigninChange = (e) => {
    const { name, value } = e.target
    setSigninData((prev) => ({
      ...prev,
      [name]: value,
    }))
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
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-amber-50 via-stone-50 to-yellow-100 flex items-center justify-center p-4 fixed inset-0 overflow-auto">
      <div className="w-full max-w-md">
        {/* Sign In Page */}
        {currentPage === "signin" && (
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 transform transition-all duration-300">
            <div className="text-center mb-8">
              {/* Logo professionnel */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <img 
                    src="src/Component/images/exprom.jpeg" 
                    alt="EXPROM Logo" 
                    className="w-32 h-28 object-contain rounded-xl shadow-lg"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-600 via-gray-700 to-yellow-600 bg-clip-text text-transparent mb-1">EXPROM</h1>
                <p className="text-sm text-gray-600 font-semibold">FACILITIES</p>
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Connexion</h2>
              <p className="text-slate-600">Accédez à votre espace de travail</p>
            </div>
            
            {errors.general && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r-lg mb-6">
                <p className="text-sm">{errors.general}</p>
              </div>
            )}
            
            <div className="space-y-5">
              <InputField
                icon={Mail}
                type="email"
                name="email"
                placeholder="Adresse email professionnelle"
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
                className="w-full bg-gradient-to-r from-gray-700 to-yellow-600 text-white py-3.5 px-4 rounded-xl hover:from-gray-800 hover:to-yellow-700 focus:ring-4 focus:ring-gray-200 transition-all duration-200 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg hover:shadow-xl"
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
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500">Nouveau sur EXPROM ?</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setCurrentPage("signup")
                  setErrors({})
                }}
                className="text-gray-700 hover:text-yellow-600 font-semibold hover:underline transition-colors text-sm"
              >
                Créer un compte professionnel
              </button>
            </div>
          </div>
        )}

        {/* Sign Up Page - Version plus compacte */}
        {currentPage === "signup" && (
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-5 transform transition-all duration-300">
            <div className="text-center mb-4 relative">
              <button
                onClick={() => {
                  setCurrentPage("signin")
                  setErrors({})
                }}
                className="absolute -top-1 -left-1 p-1 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-50"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              {/* Logo professionnel */}
              <div className="flex justify-center mb-2">
                <div className="relative">
                  <img 
                    src="src/Component/images/exprom.jpeg" 
                    alt="EXPROM Logo" 
                    className="w-20 h-16 object-contain rounded-lg shadow-md"
                  />
                </div>
              </div>
              
              <div className="mb-2">
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-600 via-gray-700 to-yellow-600 bg-clip-text text-transparent">EXPROM</h1>
                <p className="text-xs text-gray-600 font-semibold">FACILITIES</p>
              </div>
              
              <h2 className="text-lg font-bold text-slate-800">Créer un compte</h2>
              <p className="text-xs text-slate-600">Rejoignez notre plateforme professionnelle</p>
            </div>
            
            {errors.general && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-3 py-2 rounded-r-lg mb-3 text-xs">
                <p>{errors.general}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
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
                placeholder="Email professionnel"
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
                placeholder="Confirmer mot de passe"
                value={signupData.confirmPassword}
                onChange={handleSignupChange}
                error={errors.confirmPassword}
                showPassword={showConfirmPassword}
                setShowPassword={setShowConfirmPassword}
              />
              <div className="bg-blue-50 border-l-4 border-blue-500 p-2 rounded-r-lg">
                <p className="text-xs text-blue-700">
                  <span className="font-semibold">Information:</span> Votre statut sera automatiquement défini comme "Employé"
                </p>
              </div>
              <button
                onClick={handleSignup}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-gray-700 to-yellow-600 text-white py-2 px-4 rounded-xl hover:from-gray-800 hover:to-yellow-700 focus:ring-2 focus:ring-gray-200 transition-all duration-200 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 shadow-md hover:shadow-lg text-sm"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Créer mon compte</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="mt-3 text-center">
              <div className="relative mb-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-slate-500">Vous avez déjà un compte ?</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setCurrentPage("signin")
                  setErrors({})
                }}
                className="text-gray-700 hover:text-yellow-600 font-semibold hover:underline transition-colors text-xs"
              >
                Se connecter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthPages