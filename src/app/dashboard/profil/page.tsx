"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Camera, CheckCircle2, Globe } from "lucide-react";
import DashboardHeader from '@/components/shared/Header';
import DashboardFooter from '@/components/shared/Footer';
import { authService } from "@/services/authService";

const translations = {
  fr: {
    edit: "Modifier le profil",
    save: "Enregistrer les modifications",
    cancel: "Annuler",
    info: "Mes Informations",
    nom: "Nom complet",
    email: "Adresse Email",
    tel: "Téléphone",
    ferme: "Nom de l'exploitation",
    pass: "Nouveau mot de passe",
    confirmPass: "Confirmer mot de passe",
    success: "Profil mis à jour !",
    langLabel: "Langue"
  },
  en: {
    edit: "Edit Profile",
    save: "Save Changes",
    cancel: "Cancel",
    info: "My Information",
    nom: "Full Name",
    email: "Email Address",
    tel: "Phone",
    ferme: "Farm Name",
    pass: "New Password",
    confirmPass: "Confirm Password",
    success: "Profile updated!",
    langLabel: "Language"
  }
};

export default function ProfilPage() {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [userData, setUserData] = useState({
    nom: "Utilisateur",
    email: "exemple@smartagro.com",
    telephone: "Non renseigné",
    nomExploitation: "Ma Ferme",
    langue: "fr" as "fr" | "en",
    password: "",
    confirmPassword: ""
  });

  // Accès facile aux traductions selon la langue sélectionnée
  const t = translations[userData.langue];

  useEffect(() => {
    const savedLang = localStorage.getItem('app_lang') as "fr" | "en";
    if (savedLang) setUserData(prev => ({ ...prev, langue: savedLang }));
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as "fr" | "en";
    setUserData({ ...userData, langue: newLang });
    localStorage.setItem('app_lang', newLang);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // Envoi des données vers le service (Backend + LocalStorage)
      const result = await authService.updateProfile(userData);
  
      if (result.success) {
        // Sauvegarde spécifique de la langue
        localStorage.setItem('app_lang', userData.langue);
        
        setIsEditing(false);
        setShowSuccess(true);
  
        // On cache le message de succès après 3 secondes
        setTimeout(() => setShowSuccess(false), 3000);
        
        // Optionnel : rafraîchir pour mettre à jour le Header
        // window.location.reload(); 
      }
    } catch (error) {
      alert("Une erreur est survenue lors de l'enregistrement.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fbf8]">
      <DashboardHeader />

      <main className="flex-grow py-12 px-6">
        <div className="max-w-6xl mx-auto">
          
          {showSuccess && (
            <div className="fixed top-24 right-6 bg-[#1A4D2E] text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 z-50 animate-in fade-in slide-in-from-right-5">
              <CheckCircle2 className="text-[#CCFF00]" />
              <span className="font-bold">{t.success}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* COLONNE GAUCHE : AVATAR */}
            <div className="lg:col-span-1">
              <div className="bg-[#1A4D2E] rounded-[32px] p-10 text-center shadow-lg border border-white/10">
                <div className="relative inline-block group">
                <div className="w-24 h-24 rounded-full border-4 border-[#1A4D2E] mx-auto mb-4 flex items-center justify-center text-3xl font-black text-white bg-[#22C55E] shadow-xl">                   {userData.nom.charAt(0)}
                </div>
                  {isEditing && (
                    <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full border-4 border-[#1A4D2E] cursor-pointer shadow-lg">
                      <Camera size={14} className="text-[#1A4D2E]" />
                    </div>
                  )}
                </div>
                <h2 className="text-white text-xl font-bold mb-1">{userData.nom}</h2>
                <p className="text-white/60 text-xs mb-8">{userData.email}</p>
                
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-[#22C55E] text-white py-3 rounded-xl font-bold hover:bg-[#1a9d4a] transition-all shadow-md"
                  >
                    {t.edit}
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button 
                      onClick={handleSave}
                      className="w-full bg-[#22C55E] text-white py-3 rounded-xl font-bold shadow-lg hover:bg-[#1a9d4a] transition-all"
                    >
                      {loading ? "..." : t.save}
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="w-full bg-white/10 text-white py-2 rounded-xl text-sm font-medium hover:bg-white/20 transition-all"
                    >
                      {t.cancel}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* COLONNE DROITE : FORMULAIRE TRADUIT */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-[32px] p-8 lg:p-10 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-[#1A4D2E] text-lg font-black uppercase tracking-tight">
                    {t.info}
                  </h3>
                  
                  {/* SELECT DE LANGUE DÉROULANT (Toujours modifiable) */}
                  <div className="relative flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
                    <select 
                      value={userData.langue}
                      onChange={handleLanguageChange}
                      className="bg-transparent text-xs font-bold text-[#1A4D2E] outline-none cursor-pointer appearance-none pr-4"
                    >
                      <option value="fr">🇫🇷 Français (FR)</option>
                      <option value="en">🇺🇸 English (EN)</option>
                    </select>
                  </div>
                </div>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProfileInput label={t.nom} value={userData.nom} isEditing={isEditing} onChange={(v) => setUserData({...userData, nom: v})} />
                    <ProfileInput label={t.email} value={userData.email} isEditing={isEditing} onChange={(v) => setUserData({...userData, email: v})} />
                    <ProfileInput label={t.tel} value={userData.telephone} isEditing={isEditing} onChange={(v) => setUserData({...userData, telephone: v})} />
                    <ProfileInput label={t.ferme} value={userData.ferme} isEditing={isEditing} onChange={(v) => setUserData({...userData, nomExploitation: v})} />
                  </div>

                  {isEditing && (
                    <div className="pt-6 border-t border-gray-50 space-y-6 animate-in slide-in-from-top-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                        <div className="relative">
                          <ProfileInput label={t.pass} value={userData.password} isEditing={true} type={showPass ? "text" : "password"} onChange={(v) => setUserData({...userData, password: v})} />
                          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-9 text-gray-400">
                            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        <ProfileInput label={t.confirmPass} value={userData.confirmPassword} isEditing={true} type={showPass ? "text" : "password"} onChange={(v) => setUserData({...userData, confirmPassword: v})} />
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>

          </div>
        </div>
      </main>

      <DashboardFooter />
    </div>
  );
}

function ProfileInput({ label, value, isEditing, onChange, type = "text" }: any) {
  return (
    <div className="flex flex-col">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1 ml-1">{label}</label>
      <input 
        type={type}
        disabled={!isEditing}
        className={`w-full p-3 rounded-xl border-2 transition-all text-sm font-bold ${
          isEditing 
          ? 'bg-white border-gray-100 focus:border-[#22C55E] outline-none shadow-sm' 
          : 'bg-transparent border-transparent text-[#1A4D2E]'
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}