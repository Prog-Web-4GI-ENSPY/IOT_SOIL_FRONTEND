"use client";
import { useState, useEffect } from "react";
import { terrainService } from "@/services/terrainService";
import { parcelService } from "@/services/parcelService";

export default function ParcelForm({ initialData, onSuccess, onCancel }: any) {
  const [loading, setLoading] = useState(false);
  const [terrainsExistants, setTerrainsExistants] = useState<any[]>([]);
  const [parcellesExistantes, setParcellesExistantes] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(initialData || {
    nom: "", superficie: "", terrainId: ""
  });

  useEffect(() => {
    const loadData = async () => {
      const [tData, pData]: any = await Promise.all([
        terrainService.getTerrains(),
        parcelService.getParcelles()
      ]);
      setTerrainsExistants(tData);
      setParcellesExistantes(pData);
    };
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const superficieSaisie = Number(formData.superficie);
    
    // 1. Empecher une superficie négative
    if (superficieSaisie <= 0) {
      setError("La superficie doit être un nombre positif.");
      return;
    }

    // 2. Validation de l'espace disponible sur le terrain
    const terrainSelectionne = terrainsExistants.find(t => String(t.id) === String(formData.terrainId));
    if (terrainSelectionne) {
      const surfaceOccupee = parcellesExistantes
        .filter(p => String(p.terrainId) === String(formData.terrainId) && p.id !== initialData?.id)
        .reduce((acc, p) => acc + Number(p.superficie), 0);
      
      const surfaceDisponible = Number(terrainSelectionne.superficie) - surfaceOccupee;

      if (superficieSaisie > surfaceDisponible) {
        if (surfaceDisponible <= 0) {
          setError("Plus d'espace disponible sur ce terrain. Veuillez sélectionner un autre terrain.");
        } else {
          setError(`Espace insuffisant. Il ne reste que ${surfaceDisponible} m² disponibles sur ce terrain.`);
        }
        return;
      }
    }

    setLoading(true);
    await parcelService.saveParcelle(formData);
    setLoading(false);
    onSuccess();
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg max-w-2xl mx-auto border border-gray-100">
      <h2 className="text-2xl font-bold text-green-800 text-center mb-6">
        {initialData ? "Modifier la parcelle" : "Créer une parcelle"}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-1">Nom</label>
          <input 
            placeholder="Ex: Parcelle Nord" className="w-full p-3 border rounded-xl bg-gray-50 outline-none focus:border-green-500"
            value={formData.nom}
            onChange={(e) => setFormData({...formData, nom: e.target.value})}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Superficie (m²)</label>
          <input 
            type="number" min="1" placeholder="Ex: 50" className="w-full p-3 border rounded-xl bg-gray-50 outline-none focus:border-green-500"
            value={formData.superficie}
            onChange={(e) => setFormData({...formData, superficie: e.target.value})}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Terrain associé</label>
          <select 
            disabled={!!initialData}
            className={`w-full p-3 border rounded-xl ${initialData ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-50'}`}
            value={formData.terrainId}
            onChange={(e) => setFormData({...formData, terrainId: e.target.value})}
            required
          >
            <option value="">Sélectionner un terrain</option>
            {terrainsExistants.map(t => (
              <option key={t.id} value={t.id}>{t.nom} (Total: {t.superficie}m²)</option>
            ))}
          </select>
        </div>

        <div className="flex justify-between mt-8">
          <button type="button" onClick={onCancel} className="px-8 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold">Annuler</button>
          <button type="submit" className="px-10 py-2.5 bg-[#22C55E] text-white rounded-xl font-bold shadow-md">
            {loading ? "Chargement..." : initialData ? "Enregistrer" : "Créer la parcelle"}
          </button>
        </div>
      </form>
    </div>
  );
}