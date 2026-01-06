"use client";

import { useState, useEffect, useRef } from "react";
import DashboardHeader from '@/components/layout/Header';
import DashboardFooter from '@/components/layout/Footer';
import { parcelService } from "@/features/parcels/services/parcelService";
import { recommendationService } from "@/features/recommendations/services/recommendationService";
import { useTranslation } from "@/providers/TranslationProvider";
import { Bot, User, Loader2, Send, Sparkles, AlertCircle, MapPin, ChevronRight } from "lucide-react";

export default function RecommandationsPage() {
  const { t } = useTranslation();
  const [parcelles, setParcelles] = useState<any[]>([]);
  const [selectedParcel, setSelectedParcel] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const loadParcelles = async () => {
      try {
        const data: any = await parcelService.getParcelles();
        setParcelles(data);
      } catch (e) { console.error(e); }
    };
    loadParcelles();
  }, []);

  const handleParcelSelect = async (id: string) => {
    if (!id) { setSelectedParcel(null); setMessages([]); return; }
    const parcel = parcelles.find(p => String(p.id) === String(id));
    if (selectedParcel?.id === parcel?.id) return;

    setSelectedParcel(parcel);
    setMessages([]);

    if (parcel && (parcel.culturePredite || parcel.culture)) {
      setLoading(true);
      try {
        const res: any = await recommendationService.getRecommendations(parcel.id, parcel.culturePredite || parcel.culture);
        setMessages(res);
      } finally { setLoading(false); }
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedParcel) return;

    const userText = inputMessage;
    setInputMessage("");
    setMessages(prev => [...prev, { agent: t('recommandations.user_label'), message: userText, type: "user" }]);
    setIsTyping(true);

    try {
      const response: any = await recommendationService.askQuestion(selectedParcel.id, userText);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <DashboardHeader />

      <div className="flex flex-1">
        {/* SIDEBAR */}
        <aside className="w-80 bg-white border-r border-slate-100 flex flex-col hidden md:flex sticky top-[64px] h-[calc(100vh-64px)]">
          <div className="p-6 border-b border-slate-50">
            <h2 className="text-lg font-black text-slate-900">{t('recommandations.select_parcel')}</h2>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">{parcelles.length} {t('nav.parcelles').toLowerCase()}</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {parcelles.length > 0 ? (
              parcelles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleParcelSelect(p.id)}
                  className={`w-full text-left p-4 rounded-2xl transition-all flex items-center gap-3 group ${selectedParcel?.id === p.id
                    ? "bg-green-50 border-2 border-green-500/20"
                    : "hover:bg-slate-50 border-2 border-transparent"
                    }`}
                >
                  <div className={`p-2 rounded-xl transition-colors ${selectedParcel?.id === p.id ? "bg-green-500 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                    }`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold truncate ${selectedParcel?.id === p.id ? "text-green-700" : "text-slate-700"}`}>
                      {p.nom}
                    </p>
                    {p.culturePredite && (
                      <p className="text-[10px] text-slate-400 font-medium truncate uppercase">
                        {t('recommandations.culture_label')}: {p.culturePredite}
                      </p>
                    )}
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${selectedParcel?.id === p.id ? "text-green-500 translate-x-0" : "text-slate-300 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"}`} />
                </button>
              ))
            ) : (
              <p className="text-center py-10 text-slate-400 text-sm">{t('predictions.no_parcels')}</p>
            )}
          </div>
        </aside>

        {/* MAIN CHAT AREA */}
        <main className="flex-1 flex flex-col p-2 md:p-3 lg:p-4">
          <div className="w-full flex-1 flex flex-col min-h-0">
            {/* Header */}
            <div className="sticky top-[64px] bg-[#F8FAFC] z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 py-2">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <Bot className="text-[#22C55E]" /> {t('recommandations.title')}
                </h1>
                <p className="text-slate-500 font-medium italic">{t('recommandations.subtitle')}</p>
              </div>
              {selectedParcel?.culturePredite && (
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-2xl text-xs font-black uppercase">
                  {t('recommandations.culture_label')} : {selectedParcel.culturePredite}
                </div>
              )}
            </div>

            {/* MOBILE SELECTOR (Fallback) */}
            <div className="md:hidden bg-white rounded-3xl p-4 shadow-sm border border-slate-100 mb-8">
              <select
                onChange={(e) => handleParcelSelect(e.target.value)}
                value={selectedParcel?.id || ""}
                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#22C55E] transition-all"
              >
                <option value="">{t('recommandations.select_parcel_prompt')}</option>
                {parcelles.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
              </select>
            </div>

            {/* Zone de Chat */}
            <div className="flex-1 flex flex-col bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden relative min-h-[600px] mb-4">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {!selectedParcel ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-50">
                    <Sparkles size={48} className="mb-4" />
                    <p className="font-bold text-center px-10">{t('recommandations.start_consultation')}</p>
                  </div>
                ) : !selectedParcel.culturePredite ? (
                  <div className="h-full flex flex-col items-center justify-center text-orange-400 p-10 text-center">
                    <AlertCircle size={48} className="mb-4" />
                    <p className="font-bold">{t('recommandations.no_prediction_error')}</p>
                  </div>
                ) : loading ? (
                  <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-green-500" size={32} /></div>
                ) : (
                  <>
                    {messages.map((msg, idx) => (
                      <div key={idx} className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${msg.type === 'user' ? 'bg-slate-900 text-white' : 'bg-green-100 text-green-600'}`}>
                          {msg.type === 'user' ? <User size={18} /> : <Bot size={18} />}
                        </div>
                        <div className={`p-4 rounded-[24px] max-w-[85%] shadow-sm ${msg.type === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100'}`}>
                          <div className="flex items-center gap-2 mb-1 opacity-60">
                            <span className="text-[10px] font-black uppercase tracking-widest">{msg.agent}</span>
                          </div>
                          <p className="text-sm font-medium leading-relaxed">{msg.message}</p>
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center animate-pulse"><Bot size={18} /></div>
                        <div className="bg-slate-50 p-4 rounded-[24px] rounded-tl-none flex gap-1">
                          <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                          <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </>
                )}
              </div>

              {/* Formulaire d'envoi - rendu collant */}
              <form
                onSubmit={handleSendMessage}
                className="sticky bottom-0 p-4 bg-white border-t border-slate-100 flex gap-3 z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]"
              >
                <input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={!selectedParcel || !selectedParcel.culturePredite}
                  placeholder={t('recommandations.input_placeholder')}
                  className="flex-grow bg-slate-50 px-6 py-4 rounded-2xl outline-none border border-slate-200 focus:border-[#22C55E] focus:bg-white font-medium disabled:opacity-50 transition-all shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-[#22C55E] text-white p-4 rounded-2xl hover:bg-[#1a9e4b] active:scale-95 transition-all disabled:opacity-30 shadow-lg shadow-green-100"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
      <DashboardFooter />
    </div>
  );
}