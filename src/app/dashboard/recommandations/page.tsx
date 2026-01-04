"use client";

import { useState, useEffect, useRef } from "react";
import DashboardHeader from '@/components/layout/Header';
import DashboardFooter from '@/components/layout/Footer';
import { parcelService } from "@/features/parcels/services/parcelService";
import { recommendationService } from "@/features/recommendations/services/recommendationService";
import { Bot, CloudSun, Bug, UserCheck, Loader2, Send, Sparkles, User, AlertCircle } from "lucide-react";

export default function RecommandationsPage() {
  const [parcelles, setParcelles] = useState<any[]>([]);
  const [selectedParcel, setSelectedParcel] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll automatique vers le dernier message
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
    setMessages(prev => [...prev, { agent: "Moi", message: userText, type: "user" }]);
    setIsTyping(true);

    try {
      // --- LOGIQUE RÉELLE (À DÉCOMMENTER LORSQUE LE BACKEND EST PRÊT) ---
      /* const response = await recommendationService.askQuestion(selectedParcel.id, userText);
      setMessages(prev => [...prev, response]);
      */

      // --- SIMULATION ---
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

      <main className="flex-grow p-4 md:p-8 lg:p-12 max-w-4xl mx-auto w-full">
        {/* Header avec Statut */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Bot className="text-[#22C55E]" /> Chat Expert IA
            </h1>
            <p className="text-slate-500 font-medium italic">Posez vos questions sur vos cultures en temps réel.</p>
          </div>
          {selectedParcel?.culturePredite && (
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-2xl text-xs font-black uppercase">
              Culture : {selectedParcel.culturePredite}
            </div>
          )}
        </div>

        {/* Sélecteur de Parcelle */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 mb-8">
          <select
            onChange={(e) => handleParcelSelect(e.target.value)}
            className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#22C55E] transition-all"
          >
            <option value="">Sélectionnez une zone pour discuter...</option>
            {parcelles.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
          </select>
        </div>

        {/* Zone de Chat */}
        <div className="flex flex-col h-[550px] bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden relative">
          <div className="flex-grow overflow-y-auto p-6 space-y-6">
            {!selectedParcel ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-50">
                <Sparkles size={48} className="mb-4" />
                <p className="font-bold text-center px-10">Choisissez une parcelle pour commencer la consultation avec nos agents.</p>
              </div>
            ) : !selectedParcel.culturePredite ? (
              <div className="h-full flex flex-col items-center justify-center text-orange-400 p-10 text-center">
                <AlertCircle size={48} className="mb-4" />
                <p className="font-bold">Aucune culture prédite pour cette parcelle. Veuillez passer par l'Assistant IA d'abord.</p>
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

          {/* Formulaire d'envoi */}
          <form onSubmit={handleSendMessage} className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
            <input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={!selectedParcel || !selectedParcel.culturePredite}
              placeholder="Écrivez votre question ici..."
              className="flex-grow bg-white px-6 py-4 rounded-2xl outline-none border border-slate-200 focus:border-[#22C55E] font-medium disabled:opacity-50 shadow-inner"
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
      </main>

      <DashboardFooter />
    </div>
  );
}