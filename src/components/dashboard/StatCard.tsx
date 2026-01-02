"use client";

interface Stat {
  label: string;
  value: string | number;
}

interface StatCardProps {
  title: string;
  stats?: Stat[];        // Le "?" rend la propriété optionnelle
  description?: string; // Ajout de la description optionnelle
  buttonText: string;
  borderColor: string;
  onButtonClick?: () => void;
}

export default function StatCard({ title, stats = [], description, buttonText, borderColor, onButtonClick }: StatCardProps) {
  return (
    <div className={`bg-white rounded-3xl p-6 shadow-sm border-l-8 ${borderColor} flex flex-col justify-between h-full hover:shadow-md transition-shadow`}>
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-6">{title}</h3>
        
        {/* Si on a une description (ex: Prédiction), on l'affiche */}
        {description && (
          <p className="text-gray-500 text-sm mb-4 leading-relaxed">
            {description}
          </p>
        )}

        {/* On vérifie si stats existe et a des éléments avant de faire le map */}
        <div className="space-y-4">
          {stats && stats.length > 0 && stats.map((stat, index) => (
            <div key={index} className="flex flex-col">
              <span className="text-gray-400 text-sm font-medium">{stat.label}</span>
              <span className="text-2xl font-extrabold text-gray-900">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
      
      <button 
        onClick={onButtonClick}
        className="mt-8 w-full py-3 bg-[#F1F8F4] text-[#22C55E] rounded-2xl font-bold text-sm hover:bg-[#22C55E] hover:text-white transition-all active:scale-95"
      >
        {buttonText}
      </button>
    </div>
  );
}