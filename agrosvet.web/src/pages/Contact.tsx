import React from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send } from 'lucide-react';

export const Contact: React.FC = () => (
  <div className="bg-white rounded-3xl p-12 shadow-soft border border-gray-100 max-w-4xl mx-auto">
    <div className="text-center mb-12">
      <div className="bg-agro-100 text-agro-600 p-3 rounded-2xl inline-block mb-4">
        <MessageSquare size={32} />
      </div>
      <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Kontakt</h1>
      <p className="text-gray-500 text-lg">Uvek smo tu za vas i vaše gazdinstvo.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="space-y-8">
        <h3 className="text-2xl font-black text-gray-900 tracking-tight">Informacije</h3>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="bg-agro-50 text-agro-600 p-4 rounded-2xl"><Phone size={24} /></div>
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Telefon</div>
              <div className="font-bold text-gray-900">+381 00 000 0000</div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl"><Mail size={24} /></div>
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Email</div>
              <div className="font-bold text-gray-900">info@agrosvet.rs</div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl"><MapPin size={24} /></div>
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Lokacija</div>
              <div className="font-bold text-gray-900">Agrosvet Poljoprivredna Apoteka</div>
              <a href="https://maps.app.goo.gl/mTvci45HF6YFZW1UA" target="_blank" rel="noopener noreferrer" className="text-sm text-agro-600 hover:underline">Otvori u Google Mapama</a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100/50">
        <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-8">Pošaljite poruku</h3>
        <form className="space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block ml-1">Vaše Ime</label>
            <input type="text" className="w-full bg-white border border-gray-100 py-3 px-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-agro-500/10 focus:border-agro-200 transition-all text-sm font-medium" />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block ml-1">Email Adresa</label>
            <input type="email" className="w-full bg-white border border-gray-100 py-3 px-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-agro-500/10 focus:border-agro-200 transition-all text-sm font-medium" />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block ml-1">Poruka</label>
            <textarea rows={4} className="w-full bg-white border border-gray-100 py-3 px-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-agro-500/10 focus:border-agro-200 transition-all text-sm font-medium resize-none" />
          </div>
          <button className="w-full bg-agro-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-agro-700 shadow-lg shadow-agro-600/20 active:scale-95 transition-all">
            <Send size={16} />
            Pošalji Poruku
          </button>
        </form>
      </div>
    </div>
  </div>
);
