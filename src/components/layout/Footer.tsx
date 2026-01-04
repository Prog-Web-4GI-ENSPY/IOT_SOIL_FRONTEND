import Link from 'next/link';

export default function DashboardFooter() {
  return (
    <footer className="bg-[#1B831B] text-white pt-12 pb-6 px-8 mt-auto w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div>
          <h3 className="font-bold text-xl mb-6">Smart Agro</h3>
          <p className="text-sm text-green-50/80 leading-relaxed">
            La plateforme intelligente qui combine IoT, IA pour maximiser vos rendements tout en préservant l'environnement.
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-lg text-white">Navigation</h4>
          <ul className="text-sm space-y-3 text-green-50/70">
            <li><Link href="/dashboard/farmer/terrains" className="hover:text-white transition-colors">Mes Terrains</Link></li>
            {/* Accès vers la liste des capteurs */}
            <li><Link href="/dashboard/capteurs" className="hover:text-white transition-colors">Capteur IoT</Link></li>
            <li><Link href="/dashboard/parcelles" className="hover:text-white transition-colors">Mes parcelles</Link></li>
            <li><Link href="/predictions" className="hover:text-white transition-colors">Prediction IA</Link></li>
            <li><Link href="/dashboard/farmer/parcelles" className="hover:text-white transition-colors">Recommandation</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-lg text-white">Support</h4>
          <ul className="text-sm space-y-3 text-green-50/70">
            <li><Link href="#" className="hover:text-white transition-colors">Centre d'aide</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Contact agronome</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Statut du service</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-lg text-white">Restez informe</h4>
          <p className="text-xs text-green-100/70 mb-6 leading-relaxed">
            Alertes météo, conseils culturaux et nouveautés Smart Agro.
          </p>
          
          <div className="flex bg-white rounded-2xl overflow-hidden w-full max-w-[340px] h-[45px]">
            <input 
              type="email" 
              placeholder="Votre email" 
              className="bg-transparent text-gray-700 px-6 outline-none text-[13px] w-2/3 placeholder:text-gray-400 font-medium"            
            />
            <button className="bg-[#22C55E] hover:bg-[#16A34A] text-white flex-1 h-full text-[14px] font-bold transition-all flex items-center justify-center whitespace-nowrap px-6">              
              Subscribe           
            </button>
          </div>
        </div>
      </div>
      
      <div className="border-t border-white/20 pt-6 flex flex-col md:flex-row justify-between items-center text-[11px] text-green-100/60 font-medium">
        <span>© 2025 Smart Agro – Tous droits réservés.</span>
        <div className="flex gap-4">
          <Link href="#" className="hover:text-white transition-colors underline decoration-green-100/30">Conditions d'utilisation</Link>
          <span className="text-white/20">•</span>
          <Link href="#" className="hover:text-white transition-colors underline decoration-green-100/30">Confidentialité</Link>
          <span className="text-white/20">•</span>
          <Link href="#" className="hover:text-white transition-colors underline decoration-green-100/30">Mentions légales</Link>
        </div>
      </div>
    </footer>
  );
}