"use client";
import { useState, useEffect } from "react";
import { CapteursService } from "@/lib/services/CapteursService";
import { ParcellesService } from "@/lib/services/ParcellesService";
import { TerrainsService } from "@/lib/services/TerrainsService";
import { Calendar, Tag, Activity, Cpu } from "lucide-react";

export default function SensorForm({ initialData, onSuccess, onCancel }: any) {
  const [loading, setLoading] = useState(false);
  const [parcellesExistantes, setParcellesExistantes] = useState<any[]>([]);
  const [formData, setFormData] = useState(initialData ? {
    nom: initialData.nom,
    code: initialData.code || "",
    parcelle_id: initialData.parcelle_id || initialData.parcelleId || "",
    dev_eui: initialData.dev_eui || "",
    date_installation: initialData.date_installation ? new Date(initialData.date_installation).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    date_activation: initialData.date_activation ? new Date(initialData.date_activation).toISOString().split('T')[0] : ""
  } : {
    nom: "",
    code: "pH du sol", // On réutilise le type de mesure comme code
    parcelle_id: "",
    dev_eui: "",
    date_installation: new Date().toISOString().split('T')[0],
    date_activation: ""
  });

  useEffect(() => {
    const loadParcelles = async () => {
      try {
        const terrains = await TerrainsService.getAllTerrainsApiV1TerrainsTerrainsGet();
        const allParcellesPromises = terrains.map(t =>
          ParcellesService.getParcellesByTerrainApiV1ParcellesParcellesTerrainTerrainIdGet(t.id)
        );
        const allParcellesResults = await Promise.all(allParcellesPromises);
        setParcellesExistantes(allParcellesResults.flat());
      } catch (error) {
        console.error("Error loading parcelles for sensor form:", error);
      }
    };
    loadParcelles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (initialData?.id) {
        await CapteursService.updateCapteurApiV1CapteursCapteurIdPut(initialData.id, {
          nom: formData.nom,
          parcelle_id: formData.parcelle_id || null,
          dev_eui: formData.dev_eui || null,
          date_installation: formData.date_installation || null,
          date_activation: formData.date_activation || null,
        });
      } else {
        await CapteursService.createCapteurApiV1CapteursPost({
          nom: formData.nom,
          code: formData.code,
          parcelle_id: formData.parcelle_id || null,
          dev_eui: formData.dev_eui || Math.random().toString(16).slice(2, 18).padStart(16, '0'),
          date_installation: formData.date_installation || new Date().toISOString(),
          date_activation: formData.date_activation || null,
        });
      }

      setLoading(false);
      onSuccess();
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde du capteur:", error);
      alert(error.body?.detail || "Erreur lors de la sauvegarde.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full pt-4">
      {/* ... (Reste de votre design identique) */}
      <h1 className="text-2xl font-bold text-[#1A4D2E] mb-6 text-center">
        {initialData ? "Modifier le capteur" : "Ajouter un nouveau capteur"}
      </h1>

      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 w-full max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">Nom du capteur</label>
            <input
              placeholder="Ex: Capteur Central"
              className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-green-500 outline-none text-sm transition-all"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">Type de mesure (Code)</label>
            <select
              className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-green-500 outline-none bg-white text-sm font-medium cursor-pointer"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
            >
              {/* Vos options identiques */}
              <optgroup label="Mesures Seules">
                <option value="pH du sol">pH du sol</option>
                <option value="Humidité du sol (h)">Humidité (h)</option>
                <option value="Température du sol (T)">Température (T)</option>
                <option value="Azote (N)">Azote (N)</option>
                <option value="Phosphore (P)">Phosphore (P)</option>
                <option value="Potassium (K)">Potassium (K)</option>
              </optgroup>
              <optgroup label="Combinaisons par 2">
                <option value="pH & Humidité">pH & Humidité</option>
                <option value="T/h (Temp/Hum)">Température & Humidité (T/h)</option>
                <option value="N/P">Azote & Phosphore (N/P)</option>
                <option value="P/K">Phosphore & Potassium (P/K)</option>
              </optgroup>
              <optgroup label="Combinaisons par 3 et plus">
                <option value="pH/T/h">pH, Température & Humidité</option>
                <option value="NPK">NPK (Azote, Phosphore, Potassium)</option>
                <option value="NPK + pH">NPK + pH</option>
                <option value="Full Sol">Station Complète (NPK, pH, h, T)</option>
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">Parcelle associée</label>
            <select
              className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-green-500 outline-none bg-white text-sm cursor-pointer"
              value={formData.parcelle_id}
              onChange={(e) => setFormData({ ...formData, parcelle_id: e.target.value })}
              required
            >
              <option value="">Sélectionner une parcelle</option>
              {parcellesExistantes.map(p => (
                <option key={p.id} value={p.id}>{p.nom}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">Date d'installation</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full p-3 pl-10 border-2 border-gray-100 rounded-xl focus:border-green-500 outline-none text-sm transition-all"
                  value={formData.date_installation}
                  onChange={(e) => setFormData({ ...formData, date_installation: e.target.value })}
                  required
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">Date d'activation</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full p-3 pl-10 border-2 border-gray-100 rounded-xl focus:border-green-500 outline-none text-sm transition-all"
                  value={formData.date_activation}
                  onChange={(e) => setFormData({ ...formData, date_activation: e.target.value })}
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">DevEUI LoRaWAN</label>
            <div className="relative">
              <input
                placeholder="Ex: 1234567890ABCDEF"
                className="w-full p-3 pl-10 border-2 border-gray-100 rounded-xl focus:border-green-500 outline-none text-sm transition-all font-mono"
                value={formData.dev_eui}
                onChange={(e) => setFormData({ ...formData, dev_eui: e.target.value })}
                required
                maxLength={16}
              />
              <Cpu className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button" onClick={onCancel}
              className="px-6 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200"
            >
              Annuler
            </button>
            <button
              type="submit" disabled={loading}
              className="px-8 py-2 bg-[#22C55E] text-white rounded-xl font-bold text-sm hover:bg-[#16A34A] shadow-md"
            >
              {loading ? "..." : initialData ? "Enregistrer" : "+ Créer capteur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}