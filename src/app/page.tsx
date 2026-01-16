"use client";

import Link from 'next/link';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { useTranslation } from '@/providers/TranslationProvider';
import Footer from '@/components/layout/Footer';
import { useLanguageStore } from '@/store/useUserStore';

export default function LandingPage() {
    const { t, isLoading } = useTranslation();

    const team = [
        { name: "Marie Dupont", roleKey: "agronomist", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400" },
        { name: "Lucas Martin", roleKey: "engineer", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400" },
        { name: "Sophie Leroy", roleKey: "product_manager", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400" }
    ];

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col relative">
            {/* Absolute positioned Language Toggle */}
            <div className="absolute top-6 right-6 z-50">
                <LanguageToggle />
            </div>

            <main className="flex-grow">
                {/* SECTION HERO */}
                <section
                    className="relative h-[70vh] flex items-center justify-center bg-cover bg-center"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832')`
                    }}
                >
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/20"></div>

                    <div className="relative z-10 text-center px-6 max-w-4xl">
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                            {t('landing.hero_title')}
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 font-medium leading-relaxed">
                            {t('landing.hero_subtitle')}
                        </p>
                    </div>
                </section>

                {/* SECTION CONTENU */}
                <section className="py-20 bg-[#F1F8F4] px-8">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-3xl font-extrabold text-[#1A4D2E] mb-6">{t('landing.mission_title')}</h2>
                                <p className="text-gray-600 text-lg leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: t('landing.mission_p1') }} />
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    {t('landing.mission_p2')}
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-[40px] shadow-xl border border-green-100">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">🌱</div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">{t('landing.features.sustainability_title')}</h4>
                                            <p className="text-sm text-gray-500">{t('landing.features.sustainability_desc')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">📡</div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">{t('landing.features.iot_title')}</h4>
                                            <p className="text-sm text-gray-500">{t('landing.features.iot_desc')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl">🤖</div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">{t('landing.features.ai_title')}</h4>
                                            <p className="text-sm text-gray-500">{t('landing.features.ai_desc')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION EQUIPE */}
                <section className="py-20 px-8 bg-white">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-4xl font-black text-[#1A4D2E] text-center mb-16">{t('landing.team_title')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {team.map((member, idx) => (
                                <div key={idx} className="bg-white p-8 rounded-[32px] shadow-xl border border-gray-50 text-center transform transition-all hover:-translate-y-2">
                                    <img src={member.img} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-[#e8f5e9]" />
                                    <h3 className="text-2xl font-bold text-gray-800">{member.name}</h3>
                                    <p className="text-[#22C55E] font-bold mt-1">{t(`roles.${member.roleKey}`)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECTION CTA LOGIN */}
                <section className="py-24 px-8 bg-[#F1F8F4] text-center">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-black text-[#1A4D2E] mb-8">
                            {t('landing.cta_title')}
                        </h2>
                        <Link
                            href="/register"
                            className="inline-block bg-[#22C55E] hover:bg-[#1B831B] text-white px-10 py-4 rounded-2xl text-lg font-bold transition-all shadow-xl hover:shadow-green-200 active:scale-95"
                        >
                            {t('nav.login')}
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
