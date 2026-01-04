"use client";

export default function ParcelCard({ parcel, terrainName, onEdit, onDelete }: any) {
  const stats = {
    azote: parcel.azote || 0,
    phosphore: parcel.phosphore || 0,
    potassium: parcel.potassium || 0,
    humidite: parcel.humidite || 0,
    temperature: parcel.temperature || 0,
    ph: parcel.ph || 0
  };

  const getProgress = (value: number, max: number = 20) => {
    return `${Math.min((value / max) * 100, 100)}%`;
  };

  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="bg-[#1A8D44] p-5 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold leading-tight">{parcel.nom}</h3>
            <p className="text-xs font-medium opacity-90">
              ID : {parcel.code || 'PK-01'} • {parcel.superficie} ha
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold">{terrainName}</p>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Grille NPK et Humidité */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Azote (N)</p>
            <p className="text-sm font-black mb-1">{stats.azote} mg/kg</p>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-[#4CAF50] h-full transition-all duration-700" style={{ width: getProgress(stats.azote) }}></div>
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Phosphore (P)</p>
            <p className="text-sm font-black mb-1">{stats.phosphore} mg/kg</p>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-[#FF9800] h-full transition-all duration-700" style={{ width: getProgress(stats.phosphore) }}></div>
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Potassium (K)</p>
            <p className="text-sm font-black mb-1">{stats.potassium} mg/kg</p>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-[#9C27B0] h-full transition-all duration-700" style={{ width: getProgress(stats.potassium) }}></div>
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Humidité</p>
            <p className="text-sm font-black mb-1">{stats.humidite} %</p>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-[#2196F3] h-full transition-all duration-700" style={{ width: `${Math.min(stats.humidite, 100)}%` }}></div>
            </div>
          </div>
        </div>

        {/* Température et pH */}
        <div className="grid grid-cols-2 gap-4 border-b border-gray-50 pb-4">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase">Température</p>
            <p className="text-lg font-black text-gray-800">{stats.temperature}°C</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase">pH sol</p>
            <p className="text-lg font-black text-gray-800">{stats.ph}</p>
          </div>
        </div>

        {/* SECTION CORRIGÉE : Culture Prédite avec FOND VERT */}
        <div className="bg-[#F1F8F4] p-4 rounded-2xl border border-green-100 flex items-center gap-4">
          <div className="w-1.5 h-12 bg-[#22C55E] rounded-full"></div>
          <div className="flex-grow text-center">
            <p className="text-[10px] font-bold text-[#1A8D44] uppercase tracking-widest mb-1">
              Culture prédite par l'IA
            </p>
            <p className="text-2xl font-black text-[#1A4D2E]">
              {parcel.culturePredite || "Analyse..."}
            </p>
            {parcel.confiance && (
               <p className="text-[10px] font-bold text-green-600/70 italic">
                 Confiance : {parcel.confiance}%
               </p>
            )}
          </div>
        </div>

        {/* Section Capteurs utilisés */}
<div className="pt-2">
  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
    Capteurs utilisés
  </p>
  <div className="flex flex-wrap gap-2">
    {parcel.capteursListe ? (
      parcel.capteursListe.split(',').map((capteur: string, idx: number) => (
        <span 
          key={idx} 
          className="bg-green-50 text-[#1A8D44] text-[10px] font-bold px-3 py-1.5 rounded-full border border-green-100 shadow-sm transition-hover hover:bg-green-100"
        >
          {capteur.trim()}
        </span>
      ))
    ) : (
      <span className="text-xs font-medium text-gray-400 italic">
        Aucun capteur actif
      </span>
    )}
  </div>
</div>
        {/* Actions */}
        <div className="flex justify-center gap-10 pt-4 border-t border-gray-50">
          <button onClick={onEdit} className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">Modifier</button>
          <button onClick={onDelete} className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors">Supprimer</button>
        </div>
      </div>
    </div>
  );
}