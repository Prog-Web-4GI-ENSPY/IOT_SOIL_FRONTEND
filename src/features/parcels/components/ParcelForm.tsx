"use client";
import { useState, useEffect } from "react";
import { TerrainsService } from "@/lib/services/TerrainsService";
import { ParcellesService } from "@/lib/services/ParcellesService";
import { TypeSol } from "@/lib/models/TypeSol";
import { StatutParcelle } from "@/lib/models/StatutParcelle";
import { Info, Calendar, Tag, Activity } from "lucide-react";

export default function ParcelForm({ initialData, onSuccess, onCancel }: any) {
  const [loading, setLoading] = useState(false);
  const [terrainsExistants, setTerrainsExistants] = useState<any[]>([]);
  const [parcellesExistantes, setParcellesExistantes] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(initialData ? {
    nom: initialData.nom,
    superficie: initialData.superficie,
    terrain_id: initialData.terrain_id || initialData.terrainId,
    type_sol: initialData.type_sol || TypeSol.NON_SP_CIFI_,
    code: initialData.code || "",
    description: initialData.description || "",
    culture_actuelle: initialData.culture_actuelle || "",
    date_plantation: initialData.date_plantation ? new Date(initialData.date_plantation).toISOString().split('T')[0] : "",
    statut: initialData.statut || StatutParcelle.ACTIVE
  } : {
    nom: "",
    superficie: "",
    terrain_id: "",
    type_sol: TypeSol.NON_SP_CIFI_,
    code: "",
    description: "",
    culture_actuelle: "",
    date_plantation: "",
    statut: StatutParcelle.ACTIVE
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const terrainsData = await TerrainsService.getAllTerrainsApiV1TerrainsTerrainsGet();
        setTerrainsExistants(terrainsData);

        const allParcellesPromises = terrainsData.map(t =>
          ParcellesService.getParcellesByTerrainApiV1ParcellesParcellesTerrainTerrainIdGet(t.id)
        );
        const allParcellesResults = await Promise.all(allParcellesPromises);
        setParcellesExistantes(allParcellesResults.flat());
      } catch (error) {
        console.error("Error loading form data:", error);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const superficieSaisie = Number(formData.superficie);

    if (superficieSaisie <= 0) {
      setError("La superficie doit être un nombre positif.");
      return;
    }

    const terrainSelectionne = terrainsExistants.find(t => String(t.id) === String(formData.terrain_id));
    if (terrainSelectionne) {
      const surfaceOccupee = parcellesExistantes
        .filter(p => String(p.terrain_id) === String(formData.terrain_id) && p.id !== initialData?.id)
        .reduce((acc, p) => acc + Number(p.superficie), 0);

      const surfaceDisponible = Number(terrainSelectionne.superficie_totale || terrainSelectionne.superficie) - surfaceOccupee;

      if (superficieSaisie > surfaceDisponible) {
        setError(surfaceDisponible <= 0
          ? "Plus d'espace disponible sur ce terrain."
          : `Espace insuffisant. Il ne reste que ${surfaceDisponible} ha disponibles.`);
        return;
      }
    }

    setLoading(true);
    try {
      if (initialData?.id) {
        await ParcellesService.updateParcelleApiV1ParcellesParcellesParcelleIdPut(initialData.id, {
          nom: formData.nom,
          description: formData.description || null,
          statut: formData.statut,
          superficie: Number(formData.superficie),
          culture_actuelle: formData.culture_actuelle || null,
          date_plantation: formData.date_plantation || null,
        });
      } else {
        await ParcellesService.createParcelleApiV1ParcellesParcellesPost({
          nom: formData.nom,
          code: formData.code || null,
          description: formData.description || null,
          terrain_id: formData.terrain_id,
          type_sol: formData.type_sol,
          superficie: Number(formData.superficie),
        });
      }
      onSuccess();
    } catch (err: any) {
      setError(err.body?.detail || "Une erreur est survenue lors de la sauvegarde.");
    } finally {
      setLoading(false);
    }
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1">Nom</label>
            <input
              placeholder="Ex: Parcelle Nord" className="w-full p-3 border rounded-xl bg-gray-50 outline-none focus:border-green-500"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Code (Optionnel)</label>
            <div className="relative">
              <input
                placeholder="Ex: PN-01" className="w-full p-3 pl-10 border rounded-xl bg-gray-50 outline-none focus:border-green-500"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Superficie (m²)</label>
          <input
            type="number" min="1" placeholder="Ex: 50" className="w-full p-3 border rounded-xl bg-gray-50 outline-none focus:border-green-500"
            value={formData.superficie}
            onChange={(e) => setFormData({ ...formData, superficie: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1">Terrain associé</label>
            <select
              disabled={!!initialData}
              className={`w-full p-3 border rounded-xl ${initialData ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-50'}`}
              value={formData.terrain_id}
              onChange={(e) => setFormData({ ...formData, terrain_id: e.target.value })}
              required
            >
              <option value="">Sélectionner un terrain</option>
              {terrainsExistants.map(t => (
                <option key={t.id} value={t.id}>{t.nom}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Type de sol</label>
            <select
              className="w-full p-3 border rounded-xl bg-gray-50 outline-none focus:border-green-500"
              value={formData.type_sol}
              onChange={(e) => setFormData({ ...formData, type_sol: e.target.value as TypeSol })}
              required
            >
              {Object.values(TypeSol).map(ts => (
                <option key={ts} value={ts}>{ts}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Retiré : Irrigation et Source d'eau */}

        {initialData && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-1">Culture actuelle</label>
                <input
                  placeholder="Ex: Maïs" className="w-full p-3 border rounded-xl bg-gray-50 outline-none focus:border-green-500"
                  value={formData.culture_actuelle}
                  onChange={(e) => setFormData({ ...formData, culture_actuelle: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Date de plantation</label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full p-3 pl-10 border rounded-xl bg-gray-50 outline-none focus:border-green-500"
                    value={formData.date_plantation}
                    onChange={(e) => setFormData({ ...formData, date_plantation: e.target.value })}
                  />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Statut de la parcelle</label>
              <div className="relative">
                <select
                  className="w-full p-3 pl-10 border rounded-xl bg-gray-50 outline-none focus:border-green-500 appearance-none"
                  value={formData.statut}
                  onChange={(e) => setFormData({ ...formData, statut: e.target.value as StatutParcelle })}
                >
                  {Object.values(StatutParcelle).map(sp => (
                    <option key={sp} value={sp}>{sp}</option>
                  ))}
                </select>
                <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-bold mb-1 text-gray-700 ml-1">Description</label>
          <div className="relative">
            <textarea
              placeholder="Informations supplémentaires..."
              className="w-full p-3 pl-10 border border-gray-200 rounded-xl bg-[#F9FBFA] outline-none focus:border-[#22C55E] transition-all min-h-[80px]"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <Info className="absolute left-3 top-4 w-4 h-4 text-gray-400" />
          </div>
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