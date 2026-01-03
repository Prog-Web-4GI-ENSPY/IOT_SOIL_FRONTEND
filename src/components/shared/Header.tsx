import Image from 'next/image';
import Link from 'next/link';

export default function DashboardHeader() {
  return (
    <header className="w-full bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-6 flex-1">
        <div className="flex items-center gap-2 min-w-fit">
          <Image src="/logo.jpg" alt="Logo" width={28} height={28} className="object-contain" />
          <span className="font-bold text-[#1B831B] text-lg">Smart Agro</span>
        </div>

        <div className="relative w-full max-w-md hidden lg:block">
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="w-full bg-[#E9F0EB] text-gray-600 text-sm py-2 px-4 rounded-lg border-none focus:ring-1 focus:ring-[#22C55E] outline-none transition-all placeholder:text-gray-400"
          />
        </div>
      </div>
      
      <nav className="hidden xl:flex items-center gap-6 text-[13px] font-semibold text-gray-500 mx-4">
        <Link href="/dashboard/farmer" className="hover:text-[#1B831B] transition-colors">Dashboard</Link>
        <Link href="/dashboard/terrains" className="hover:text-[#1B831B] transition-colors">Terrains</Link>
        <Link href="/dashboard/parcelles" className="hover:text-[#1B831B] transition-colors">Parcelles</Link>
        {/* Redirection directe vers la création de capteur */}
        <Link href="/dashboard/capteurs?action=new" className="hover:text-[#1B831B] transition-colors">Capteurs</Link>
        <Link href="/dashboard/profil" className="hover:text-[#1B831B] flex items-center gap-1">
           <span className="w-4 h-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px]">👤</span> Profil
        </Link>
        <Link href="/about" className="hover:text-[#1B831B] transition-colors">About Us</Link>
      </nav>

      <button className="bg-[#22C55E] hover:bg-[#1B831B] text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 ml-4">
        Deconnexion
      </button>
    </header>
  );
}