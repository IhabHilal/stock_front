import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Utilisateur from './Component/Admin/Utilisateur'
import AjoutUtilisateur from './Component/Admin/AjoutUtilisateur';
import ModifUtilisateur from './Component/Admin/ModifUtilisateur';
import Article from './Component/Admin/Article';
import AjoutArticle from './Component/Admin/AjoutArticle';
import ModifArticle from './Component/Admin/ModifArticle';
import DemandeAchat from './Component/Admin/DemandeAchat';
import AjoutDemandeAchat from './Component/Admin/AjoutDemandeAchat';
import ModifDemandeAchat from './Component/Admin/ModifDemandeAchat'
import AuthPages from './Component/Authentification/AuthPages';
import Dashboard from './Component/Admin/Dashboard';
import Profile from './Component/Admin/Profile';
import Navbar from './Component/Admin/Navbar';
import Erreur from './Component/Admin/Erreur';
import ArticleE from './Component/Employee/ArticleE';
import DemandeAchatE from './Component/Employee/DemandeAchatE';
import AjoutDemandeAchatE from './Component/Employee/AjoutDemandeAchatE';
import ArticleM from './Component/Manager/ArticleM';
import DemandeAchatM from './Component/Manager/DemandeAchatM';
import AjoutDemandeAchatM from './Component/Manager/AjoutDemandeAchatM';
import ModifDemandeAchatM from './Component/Manager/ModifierDemandeAchatM';
import ArticleMM from './Component/Magasinier/ArticleMM';
import DemandeAchatMM from './Component/Magasinier/DemandeAchatMM';
import AjoutDemandeAchatMM from './Component/Magasinier/AjoutDemandeAchatMM';
import AjoutArticleMM from './Component/Magasinier/AjoutArticleMM';
import ModifArticleMM from './Component/Magasinier/ModifierArticleMM';
import NavbarE from './Component/Employee/NavbarE';
import NavbarM from './Component/Manager/NavbarM';
import NavbarMM from './Component/Magasinier/NavbarMM';

// Composant pour protéger les routes
const ProtectedRoute = ({ children, allowedRoles }) => {
  // Récupérer l'utilisateur connecté depuis localStorage
  const getCurrentUser = () => {
    try {
      const userString = localStorage.getItem('currentUser');
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
  };

  const currentUser = getCurrentUser();

  // Si pas d'utilisateur connecté, rediriger vers la page d'authentification
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  // Si des rôles spécifiques sont requis, vérifier si l'utilisateur a le bon rôle
  if (allowedRoles && allowedRoles.length > 0) {
    const hasAccess = allowedRoles.includes(currentUser.role);
    
    if (!hasAccess) {
      // Rediriger vers la page d'erreur si l'utilisateur n'a pas le bon rôle
      return <Navigate to="*" replace />;
    }
  }

  // Si toutes les vérifications passent, afficher le composant
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Route d'authentification - accessible à tous */}
        <Route path="/auth" element={<AuthPages />} />

        {/* Routes ADMIN seulement */}
        <Route path="/utilisateurs" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Utilisateur />
          </ProtectedRoute>
        } />
        
        <Route path="/ajout-utilisateur" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AjoutUtilisateur />
          </ProtectedRoute>
        } />
        
        <Route path="/modif-utilisateur/:id" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ModifUtilisateur />
          </ProtectedRoute>
        } />
        
        <Route path="/articles" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Article />
          </ProtectedRoute>
        } />
        
        <Route path="/ajout-article" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AjoutArticle />
          </ProtectedRoute>
        } />
        
        <Route path="/modif-article/:id" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ModifArticle />
          </ProtectedRoute>
        } />
        
        <Route path="/demandes-achat" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DemandeAchat />
          </ProtectedRoute>
        } />
        
        <Route path="/ajout-demande-achat" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AjoutDemandeAchat />
          </ProtectedRoute>
        } />
        
        <Route path="/modif-demande-achat/:id" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ModifDemandeAchat />
          </ProtectedRoute>
        } />
        
        <Route path="/dash-admin" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/prof-admin" element={<Profile />} />
        
        <Route path="/navbar" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Navbar />
          </ProtectedRoute>
        } />

        {/* Routes EMPLOYEE seulement */}
        <Route path="/articlesE" element={
          <ProtectedRoute allowedRoles={['EMPLOYEE']}>
            <ArticleE />
          </ProtectedRoute>
        } />
        
        <Route path="/demandes-achatE" element={
          <ProtectedRoute allowedRoles={['EMPLOYEE']}>
            <DemandeAchatE />
          </ProtectedRoute>
        } />
        
        <Route path="/ajout-demande-achatE" element={
          <ProtectedRoute allowedRoles={['EMPLOYEE']}>
            <AjoutDemandeAchatE />
          </ProtectedRoute>
        } />
        
        <Route path="/navbarE" element={
          <ProtectedRoute allowedRoles={['EMPLOYEE']}>
            <NavbarE />
          </ProtectedRoute>
        } />

        {/* Routes MANAGER seulement */}
        <Route path="/articlesM" element={
          <ProtectedRoute allowedRoles={['MANAGER']}>
            <ArticleM />
          </ProtectedRoute>
        } />
        
        <Route path="/demandes-achatM" element={
          <ProtectedRoute allowedRoles={['MANAGER']}>
            <DemandeAchatM />
          </ProtectedRoute>
        } />
        
        <Route path="/ajout-demande-achatM" element={
          <ProtectedRoute allowedRoles={['MANAGER']}>
            <AjoutDemandeAchatM />
          </ProtectedRoute>
        } />
        
        <Route path="/modif-demande-achatM/:id" element={
          <ProtectedRoute allowedRoles={['MANAGER']}>
            <ModifDemandeAchatM />
          </ProtectedRoute>
        } />
        
        <Route path="/navbarM" element={
          <ProtectedRoute allowedRoles={['MANAGER']}>
            <NavbarM />
          </ProtectedRoute>
        } />

        {/* Routes MAGASINIER seulement */}
        <Route path="/articlesMM" element={
          <ProtectedRoute allowedRoles={['MAGASINIER']}>
            <ArticleMM />
          </ProtectedRoute>
        } />
        
        <Route path="/demandes-achatMM" element={
          <ProtectedRoute allowedRoles={['MAGASINIER']}>
            <DemandeAchatMM />
          </ProtectedRoute>
        } />
        
        <Route path="/ajout-demande-achatMM" element={
          <ProtectedRoute allowedRoles={['MAGASINIER']}>
            <AjoutDemandeAchatMM />
          </ProtectedRoute>
        } />
        
        <Route path="/ajout-articleMM" element={
          <ProtectedRoute allowedRoles={['MAGASINIER']}>
            <AjoutArticleMM />
          </ProtectedRoute>
        } />
        
        <Route path="/modif-articleMM/:id" element={
          <ProtectedRoute allowedRoles={['MAGASINIER']}>
            <ModifArticleMM />
          </ProtectedRoute>
        } />
        
        <Route path="/navbarMM" element={
          <ProtectedRoute allowedRoles={['MAGASINIER']}>
            <NavbarMM />
          </ProtectedRoute>
        } />

        {/* Route par défaut pour rediriger vers la page d'authentification */}
        <Route path="/" element={<Navigate to="/auth" replace />} />

        {/* Page d'erreur pour les routes non trouvées ou accès refusé */}
        <Route path="*" element={<Erreur />} />
      </Routes>
    </Router>
  )
}

export default App