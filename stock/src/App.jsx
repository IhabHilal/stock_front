
import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


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

function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/utilisateurs" element={<Utilisateur />} />
        <Route path="/ajout-utilisateur" element={<AjoutUtilisateur />} />
        <Route path="/modif-utilisateur/:id" element={<ModifUtilisateur />} />
        <Route path="/articles" element={<Article />} />
        <Route path="/ajout-article" element={<AjoutArticle />} />
        <Route path="/modif-article/:id" element={<ModifArticle />} />

<Route path="/modif-articleMM/:id" element={<ModifArticleMM />} />

        <Route path="/demandes-achat" element={<DemandeAchat />} />
        <Route path="/ajout-demande-achat" element={<AjoutDemandeAchat />} />
        <Route path="/modif-demande-achat/:id" element={<ModifDemandeAchat />} />

        <Route path="/auth" element={<AuthPages />} />

        <Route path="/dash-admin" element={<Dashboard />} />

        <Route path="/prof-admin" element={<Profile />} />

        <Route path="/navbar" element={<Navbar />} />

        <Route path="/modif-demande-achatM/:id" element={<ModifDemandeAchatM />} />

<Route path="/ajout-articleMM" element={<AjoutArticleMM />} />

<Route path="/ajout-demande-achatM" element={<AjoutDemandeAchatM />} />

<Route path="/ajout-demande-achatMM" element={<AjoutDemandeAchatMM />} />

        <Route path="/articlesE" element={<ArticleE />} />

        <Route path="/articlesMM" element={<ArticleMM />} />

        <Route path="/articlesM" element={<ArticleM />} />
        <Route path="/demandes-achatM" element={<DemandeAchatM />} />

        <Route path="/demandes-achatMM" element={<DemandeAchatMM />} />

        <Route path="/ajout-demande-achatE" element={<AjoutDemandeAchatE />} />

        <Route path="/demandes-achatE" element={<DemandeAchatE />} />
        

        <Route path="*" element={<Erreur />} />
      </Routes>
    </Router>
    
  )
}

export default App
