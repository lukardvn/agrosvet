import React from 'react';
import { Truck, Clock, PackageCheck, Banknote } from 'lucide-react';

export const Delivery: React.FC = () => (
  <div className="bg-white rounded-3xl p-12 shadow-soft border border-gray-100 max-w-4xl mx-auto">
    <div className="text-center mb-12">
      <div className="bg-agro-100 text-agro-600 p-3 rounded-2xl inline-block mb-4">
        <Truck size={32} />
      </div>
      <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Dostava</h1>
      <p className="text-gray-500 text-lg">Brzo, sigurno i direktno na vašu kućnu adresu.</p>
    </div>

    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex gap-6 items-start">
          <div className="bg-agro-50 text-agro-600 p-4 rounded-2xl"><Clock size={24} /></div>
          <div>
            <h4 className="font-bold text-xl mb-2">Vreme dostave</h4>
            <p className="text-gray-500 text-sm leading-relaxed">Sve porudžbine poslate do 12:00h šaljemo istog dana. Prosečno vreme isporuke je 24-48h na celoj teritoriji Srbije.</p>
          </div>
        </div>
        <div className="flex gap-6 items-start">
          <div className="bg-earth-50 text-earth-600 p-4 rounded-2xl"><Banknote size={24} /></div>
          <div>
            <h4 className="font-bold text-xl mb-2">Plaćanje</h4>
            <p className="text-gray-500 text-sm leading-relaxed">Plaćanje se vrši pouzećem – gotovinom kuriru prilikom preuzimanja pošiljke.</p>
          </div>
        </div>
      </div>

      <div className="bg-agro-900 text-white p-8 rounded-3xl flex items-center gap-8 shadow-xl shadow-agro-900/20">
        <PackageCheck size={48} className="opacity-40" />
        <div>
          <h4 className="text-xl font-black mb-2 tracking-tight">Besplatna Dostava</h4>
          <p className="opacity-80 text-sm leading-relaxed max-w-lg">Za sve porudžbine preko <span className="font-black">10,000 RSD</span> dostava je potpuno besplatna bilo gde u Srbiji. Za manje iznose, cena dostave zavisi od težine paketa i obračunava se po cenovniku kurirske službe.</p>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200">
        <h4 className="font-bold mb-4">Važna Napomena</h4>
        <p className="text-gray-600 text-sm">Prilikom prijema, proverite stanje pošiljke. Ukoliko uočite bilo kakva oštećenja, molimo vas da odmah obavestite kurira i kontaktirate našu službu podrške.</p>
      </div>
    </div>
  </div>
);
