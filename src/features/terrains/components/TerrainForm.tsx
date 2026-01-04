"use client";
import { useState, useRef, useEffect } from "react";
import { terrainService } from "../services/terrainService";

const paysAfrique = [
  "Afrique du Sud", "Algérie", "Angola", "Bénin", "Botswana", "Burkina Faso", "Burundi",
  "Cameroun", "Cap-Vert", "Comores", "Congo", "Côte d'Ivoire", "Djibouti", "Égypte",
  "Érythrée", "Eswatini", "Éthiopie", "Gabon", "Gambie", "Ghana", "Guinée", "Guinée équatoriale",
  "Kenya", "Lesotho", "Libéria", "Libye", "Madagascar", "Malawi", "Mali", "Maroc", "Maurice",
  "Mauritanie", "Mozambique", "Namibie", "Niger", "Nigeria", "Ouganda", "Rwanda", "Sénégal",
  "Seychelles", "Sierra Leone", "Somalie", "Soudan", "Soudan du Sud", "Tanzanie", "Tchad",
  "Togo", "Tunisie", "Zambie", "Zimbabwe"
].sort();

export default function TerrainForm({ initialData, onSuccess, onCancel }: any) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState(initialData || {
    nom: "",
    superficie: "",
    pays: "Cameroun",
    ville: "",
    quartier: ""
  });

  // Gestion du clic extérieur pour fermer la liste
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await terrainService.saveTerrain(formData);
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[32px] p-10 shadow-xl max-w-2xl mx-auto border border-gray-100">
      <h2 className="text-3xl font-black text-[#1A4D2E] text-center mb-8">
        {initialData ? "Modifier le terrain" : "Nouveau Terrain"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Champ Nom */}
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-700 ml-1">Nom du terrain</label>
          <input
            placeholder="Ex: Plantation Ouest"
            className="w-full p-4 border border-gray-200 rounded-2xl bg-[#F9FBFA] outline-none focus:border-[#22C55E] transition-all"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            required
          />
        </div>

        {/* CHAMP RÉINTÉGRÉ : Superficie */}
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-700 ml-1">Superficie (m²)</label>
          <input
            type="number"
            placeholder="Ex: 500"
            className="w-full p-4 border border-gray-200 rounded-2xl bg-[#F9FBFA] outline-none focus:border-[#22C55E] transition-all"
            value={formData.superficie}
            onChange={(e) => setFormData({ ...formData, superficie: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Liste Déroulante Pays (Orientation vers le bas) */}
          <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-bold mb-2 text-gray-700 ml-1">Pays</label>
            <div
              onClick={() => setIsOpen(!isOpen)}
              className={`w-full p-4 border rounded-2xl bg-[#F9FBFA] cursor-pointer flex justify-between items-center transition-all ${isOpen ? 'border-[#22C55E] ring-1 ring-[#22C55E]' : 'border-gray-200'}`}
            >
              <span className="text-gray-700">{formData.pays}</span>
              <svg className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Le menu s'affiche ici, toujours en dessous du bouton */}
            {isOpen && (
              <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl max-h-60 overflow-y-auto top-full left-0">
                {paysAfrique.map((p) => (
                  <div
                    key={p}
                    className="p-4 hover:bg-green-50 cursor-pointer text-gray-700 font-medium border-b border-gray-50 last:border-0"
                    onClick={() => {
                      setFormData({ ...formData, pays: p });
                      setIsOpen(false);
                    }}
                  >
                    {p}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Champ Ville */}
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 ml-1">Ville</label>
            <input
              placeholder="Yaoundé"
              className="w-full p-4 border border-gray-200 rounded-2xl bg-[#F9FBFA] outline-none focus:border-[#22C55E] transition-all"
              value={formData.ville}
              onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Champ Quartier */}
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-700 ml-1">Quartier</label>
          <input
            placeholder="Melen"
            className="w-full p-4 border border-gray-200 rounded-2xl bg-[#F9FBFA] outline-none focus:border-[#22C55E] transition-all"
            value={formData.quartier}
            onChange={(e) => setFormData({ ...formData, quartier: e.target.value })}
            required
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-10">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-[2] py-4 bg-[#22C55E] text-white rounded-2xl font-bold hover:bg-[#16A34A] shadow-lg shadow-green-100 transition-all disabled:opacity-50"
          >
            {loading ? "Chargement..." : initialData ? "Mettre à jour" : "Creer Terrain"}
          </button>
        </div>
      </form>
    </div>
  );
}