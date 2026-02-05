"use client";
import { useState, useRef, useEffect } from "react";
import { TerrainsService } from "@/lib/services/TerrainsService";
import { LocalitSService } from "@/lib/services/LocalitSService";
import { TypeTerrain } from "@/lib/models/TypeTerrain";
import { StatutTerrain } from "@/lib/models/StatutTerrain";
import { ChevronDown, MapPin, Ruler, Mountain, Calendar, Info } from "lucide-react";

// Retiré : paysAfrique

export default function TerrainForm({ initialData, onSuccess, onCancel }: any) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [localites, setLocalites] = useState<any[]>([]);

  const [formData, setFormData] = useState(initialData ? {
    nom: initialData.nom,
    superficie: initialData.superficie_totale || initialData.superficie,
    type_terrain: initialData.type_terrain || TypeTerrain.AGRICOLE,
    localite_id: initialData.localite_id || "",
    description: initialData.description || "",
    perimetre: initialData.perimetre || "",
    pente: initialData.pente || "",
    date_acquisition: initialData.date_acquisition ? new Date(initialData.date_acquisition).toISOString().split('T')[0] : "",
    statut: initialData.statut || StatutTerrain.ACTIF
  } : {
    nom: "",
    superficie: "",
    type_terrain: TypeTerrain.AGRICOLE,
    localite_id: "",
    description: "",
    perimetre: "",
    pente: "",
    date_acquisition: "",
    statut: StatutTerrain.ACTIF
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

  useEffect(() => {
    const fetchLocalites = async () => {
      try {
        const data = await LocalitSService.getAllLocalitesApiV1LocalitesLocalitesGet();
        setLocalites(data);
      } catch (error) {
        console.error("Error fetching localites:", error);
      }
    };
    fetchLocalites();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const localiteId = formData.localite_id;
      if (!localiteId) {
        throw new Error("Veuillez sélectionner une localité.");
      }

      const terrainData = {
        nom: formData.nom,
        superficie_totale: Number(formData.superficie),
        type_terrain: formData.type_terrain,
        localite_id: localiteId,
        latitude: 0,
        longitude: 0,
        description: formData.description || null,
        perimetre: formData.perimetre ? Number(formData.perimetre) : null,
        pente: formData.pente ? Number(formData.pente) : null,
        date_acquisition: formData.date_acquisition || null,
      };

      if (initialData?.id) {
        await TerrainsService.updateTerrainApiV1TerrainsTerrainsTerrainIdPut(initialData.id, {
          ...terrainData,
          statut: formData.statut
        });
      } else {
        await TerrainsService.createTerrainApiV1TerrainsTerrainsPost(terrainData);
      }
      onSuccess();
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement:", error);
      alert(error.body?.detail || error.message || "Erreur lors de la sauvegarde.");
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
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 ml-1">Superficie (m²)</label>
            <div className="relative">
              <input
                type="number"
                placeholder="Ex: 500"
                className="w-full p-4 pl-12 border border-gray-200 rounded-2xl bg-[#F9FBFA] outline-none focus:border-[#22C55E] transition-all"
                value={formData.superficie}
                onChange={(e) => setFormData({ ...formData, superficie: e.target.value })}
                required
              />
              <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 ml-1">Périmètre (m)</label>
            <div className="relative">
              <input
                type="number"
                placeholder="Optionnel"
                className="w-full p-4 pl-12 border border-gray-200 rounded-2xl bg-[#F9FBFA] outline-none focus:border-[#22C55E] transition-all"
                value={formData.perimetre}
                onChange={(e) => setFormData({ ...formData, perimetre: e.target.value })}
              />
              <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 rotate-90" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 ml-1">Pente (%)</label>
            <div className="relative">
              <input
                type="number"
                placeholder="Ex: 5"
                className="w-full p-4 pl-12 border border-gray-200 rounded-2xl bg-[#F9FBFA] outline-none focus:border-[#22C55E] transition-all"
                value={formData.pente}
                onChange={(e) => setFormData({ ...formData, pente: e.target.value })}
              />
              <Mountain className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 ml-1">Date d'acquisition</label>
            <div className="relative">
              <input
                type="date"
                className="w-full p-4 pl-12 border border-gray-200 rounded-2xl bg-[#F9FBFA] outline-none focus:border-[#22C55E] transition-all"
                value={formData.date_acquisition}
                onChange={(e) => setFormData({ ...formData, date_acquisition: e.target.value })}
              />
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {initialData && (
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 ml-1">Statut du terrain</label>
            <select
              className="w-full p-4 border border-gray-200 rounded-2xl bg-[#F9FBFA] outline-none focus:border-[#22C55E] transition-all appearance-none cursor-pointer"
              value={formData.statut}
              onChange={(e) => setFormData({ ...formData, statut: e.target.value as StatutTerrain })}
            >
              {Object.values(StatutTerrain).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-bold mb-2 text-gray-700 ml-1">Description</label>
          <div className="relative">
            <textarea
              placeholder="Informations complémentaires sur le terrain..."
              className="w-full p-4 pl-12 border border-gray-200 rounded-2xl bg-[#F9FBFA] outline-none focus:border-[#22C55E] transition-all min-h-[100px]"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <Info className="absolute left-4 top-5 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Choix de la Localité */}
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-700 ml-1">Localité</label>
          <div className="relative">
            <select
              className="w-full p-4 pl-12 border border-gray-200 rounded-2xl bg-[#F9FBFA] outline-none focus:border-[#22C55E] transition-all appearance-none cursor-pointer"
              value={formData.localite_id}
              onChange={(e) => setFormData({ ...formData, localite_id: e.target.value })}
              required
            >
              <option value="">Sélectionner une localité</option>
              {localites.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.pays} - {l.ville} ({l.quartier})
                </option>
              ))}
            </select>
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
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