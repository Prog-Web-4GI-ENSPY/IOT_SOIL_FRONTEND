"use client";

import { useState, useEffect } from "react"; 
import { sensorService } from "@/services/sensorService"; 
import { parcelService } from "@/services/parcelService"; 
import { Parcelle,Sensor } from "@/types/user";
export default function CapteursPage() {
  // ==============================
  // STATES
  // ==============================
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [parcelles, setParcelles] = useState<Parcelle[]>([]);
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ==============================
  // LOAD DATA
  // ==============================
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [sData, pData]: [Sensor[], Parcelle[]] = await Promise.all([
          sensorService.getSensors(),
          parcelService.getParcelles(),
        ]);

        setSensors(sData);
        setParcelles(pData);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ==============================
  // HELPERS
  // ==============================
  const getParcelName = (parcelId: number): string => {
    const parcel = parcelles.find((p) => p.id === parcelId);
    return parcel?.nom ?? "N/A";
  };

  // ==============================
  // RENDER
  // ==============================
  if (loading) {
    return <p>Chargement des capteurs...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Liste des capteurs</h1>

      {sensors.length === 0 ? (
        <p>Aucun capteur disponible</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Nom</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Parcelle</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sensors.map((sensor) => (
              <tr key={sensor.id}>
                <td className="border p-2">{sensor.nom}</td>
                <td className="border p-2">{sensor.typeMesure}</td>
                <td className="border p-2">
                  {getParcelName(sensor.parcelleId)}
                </td>
                <td className="border p-2">
                  <button
                    className="text-blue-600 underline"
                    onClick={() => setSelectedSensor(sensor)}
                  >
                    Détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ==============================
          MODAL / DETAILS
         ============================== */}
      {selectedSensor && (
        <div className="mt-6 border p-4 rounded bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">
            Détails du capteur
          </h2>

          <p>
            <strong>Nom :</strong> {selectedSensor.nom}
          </p>
          <p>
            <strong>Type :</strong> {selectedSensor.typeMesure}
          </p>
          <p>
            <strong>Parcelle :</strong>{" "}
            {getParcelName(selectedSensor.parcelleId)}
          </p>

          <button
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            onClick={() => setSelectedSensor(null)}
          >
            Fermer
          </button>
        </div>
      )}
    </div>
  );
}
