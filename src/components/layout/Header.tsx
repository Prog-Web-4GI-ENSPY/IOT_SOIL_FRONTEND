import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/providers/TranslationProvider';
import { User, LogOut } from 'lucide-react';

export default function DashboardHeader() {
  const { t } = useTranslation();
  const router = useRouter();

  const handleLogout = () => {
    // Ici on pourrait ajouter la logique de suppression de token si nécessaire
    router.push('/login');
  };

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
            placeholder={t('nav.search')}
            className="w-full bg-[#E9F0EB] text-gray-600 text-sm py-2 px-4 rounded-lg border-none focus:ring-1 focus:ring-[#22C55E] outline-none transition-all placeholder:text-gray-400"
          />
        </div>
      </div>

      <nav className="hidden xl:flex items-center gap-6 text-[13px] font-semibold text-gray-500 mx-4">
        <Link href="/dashboard/farmer" className="hover:text-[#1B831B] transition-colors">{t('nav.dashboard')}</Link>
        <Link href="/dashboard/terrains" className="hover:text-[#1B831B] transition-colors">{t('nav.terrains')}</Link>
        <Link href="/dashboard/parcelles" className="hover:text-[#1B831B] transition-colors">{t('nav.parcelles')}</Link>
        <Link href="/dashboard/capteurs?action=new" className="hover:text-[#1B831B] transition-colors">{t('nav.sensors')}</Link>
        <Link href="/dashboard/profil" className="hover:text-[#1B831B] flex items-center gap-2">
          <User className="w-4 h-4 text-gray-600" />
          {t('nav.profile')}
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="bg-[#22C55E] hover:bg-[#1B831B] text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 ml-2 flex items-center gap-2"
        >
          <LogOut className="w-3.5 h-3.5" />
          {t('nav.logout')}
        </button>
      </div>
    </header>
  );
}