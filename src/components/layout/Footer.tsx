import Link from 'next/link';
import { useTranslation } from '@/providers/TranslationProvider';

export default function DashboardFooter() {
  const { t } = useTranslation();
  return (
    <footer className="bg-[#1B831B] text-white pt-8 pb-4 px-6 mt-auto w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 className="font-bold text-lg mb-4">Smart Agro</h3>
          <p className="text-xs text-green-50/70 leading-relaxed">
            {t('footer.desc')}
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-base text-white">{t('footer.nav_title')}</h4>
          <ul className="text-xs space-y-2 text-green-50/70">
            <li><Link href="/dashboard/farmer/terrains" className="hover:text-white transition-colors">{t('footer.my_terrains')}</Link></li>
            <li><Link href="/dashboard/capteurs" className="hover:text-white transition-colors">{t('footer.iot_sensors')}</Link></li>
            <li><Link href="/dashboard/parcelles" className="hover:text-white transition-colors">{t('footer.my_parcels')}</Link></li>
            <li><Link href="/dashboard/predictions" className="hover:text-white transition-colors">{t('footer.ai_prediction')}</Link></li>
            <li><Link href="/dashboard/farmer/parcelles" className="hover:text-white transition-colors">{t('footer.recommendation')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-base text-white">{t('footer.support_title')}</h4>
          <ul className="text-xs space-y-2 text-green-50/70">
            <li><Link href="#" className="hover:text-white transition-colors">{t('footer.help_center')}</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">{t('footer.documentation')}</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">{t('footer.contact_agronomist')}</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">{t('footer.service_status')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-3 text-base text-white">{t('footer.stay_informed')}</h4>
          <p className="text-[10px] text-green-100/70 mb-4 leading-relaxed">
            {t('footer.newsletter_desc')}
          </p>

          <div className="flex bg-white rounded-xl overflow-hidden w-full max-w-[300px] h-[36px]">
            <input
              type="email"
              placeholder={t('footer.email_placeholder')}
              className="bg-transparent text-gray-700 px-4 outline-none text-[11px] w-2/3 placeholder:text-gray-400 font-medium"
            />
            <button className="bg-[#22C55E] hover:bg-[#16A34A] text-white flex-1 h-full text-[12px] font-bold transition-all flex items-center justify-center whitespace-nowrap px-4">
              {t('footer.subscribe')}
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-4 flex flex-col md:flex-row justify-between items-center text-[10px] text-green-100/50 font-medium">
        <span>{t('footer.rights')}</span>
        <div className="flex gap-3">
          <Link href="#" className="hover:text-white transition-colors underline decoration-green-100/20">{t('footer.terms')}</Link>
          <span className="text-white/10">•</span>
          <Link href="#" className="hover:text-white transition-colors underline decoration-green-100/20">{t('footer.privacy')}</Link>
          <span className="text-white/10">•</span>
          <Link href="#" className="hover:text-white transition-colors underline decoration-green-100/20">{t('footer.legal')}</Link>
        </div>
      </div>
    </footer>
  );
}