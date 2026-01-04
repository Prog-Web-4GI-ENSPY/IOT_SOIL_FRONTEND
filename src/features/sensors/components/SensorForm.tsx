"use client";
import { useState, useEffect } from "react";
import { sensorService } from "../services/sensorService";
import { parcelService } from "@/features/parcels/services/parcelService";

export default function SensorForm({ initialData, onSuccess, onCancel }: any) {
  const [loading, setLoading] = useState(false);
  const [parcellesExistantes, setParcellesExistantes] = useState<any[]>([]);
  const [formData, setFormData] = useState(initialData || {
    nom: "",
    typeMesure: "Humidité du sol (h)",
    parcelleId: ""
  });

  useEffect(() => {
    const loadParcelles = async () => {
      const data: any = await parcelService.getParcelles();
      setParcellesExistantes(data);
    };
    loadParcelles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. APPEL BACKEND (Commenté si vous simulez)
      await sensorService.saveSensor(formData);

      const currentSensors = JSON.parse(localStorage.getItem('smartagro_sensors_list') || '[]');

      const newSensor = {
        ...formData,
        id: Date.now() // On génère un ID pour que la liste puisse l'afficher
      };

      currentSensors.push(newSensor);
      localStorage.setItem('smartagro_sensors_list', JSON.stringify(currentSensors));

      // 2. LOGIQUE DE SIMULATION LOCALSTORAGE (Indispensable pour la mise à jour de la carte)
      const associationsStockees = JSON.parse(localStorage.getItem('simulated_sensors') || '{}');
      const idParcelle = String(formData.parcelleId);

      if (!associationsStockees[idParcelle]) {
        associationsStockees[idParcelle] = [];
      }

      // On ajoute le nom du capteur s'il n'est pas déjà présent
      if (!associationsStockees[idParcelle].includes(formData.nom)) {
        associationsStockees[idParcelle].push(formData.nom);
      }

      localStorage.setItem('simulated_sensors', JSON.stringify(associationsStockees));

      // 3. Succès
      setTimeout(() => {
        setLoading(false);
        onSuccess(); // Retour à la liste ou redirection
      }, 500);

    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
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
            <label className="block text-sm font-bold mb-2 text-gray-700">Type de mesure</label>
            <select
              className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-green-500 outline-none bg-white text-sm font-medium cursor-pointer"
              value={formData.typeMesure}
              onChange={(e) => setFormData({ ...formData, typeMesure: e.target.value })}
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
              value={formData.parcelleId}
              onChange={(e) => setFormData({ ...formData, parcelleId: e.target.value })}
              required
            >
              <option value="">Sélectionner une parcelle</option>
              {parcellesExistantes.map(p => (
                <option key={p.id} value={p.id}>{p.nom}</option>
              ))}
            </select>
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