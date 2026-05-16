import React from 'react';
import { Sprout, ShieldCheck, Heart } from 'lucide-react';

export const AboutUs: React.FC = () => (
  <div className="bg-white rounded-3xl p-12 shadow-soft border border-gray-100 max-w-4xl mx-auto">
    <div className="text-center mb-12">
      <div className="bg-agro-100 text-agro-600 p-3 rounded-2xl inline-block mb-4">
        <Sprout size={32} />
      </div>
      <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">O Nama</h1>
      <p className="text-gray-500 text-lg">Vaš pouzdan partner u poljoprivredi već više od decenije.</p>
    </div>

    <div className="space-y-8 text-gray-700 leading-relaxed text-lg">
      <p>
        <strong>Agrosvet</strong> je porodična poljoprivredna apoteka osnovana sa ciljem da pruži stručnu pomoć i najkvalitetnije proizvode srpskim poljoprivrednicima. Verujemo da uspeh svakog gazdinstva počinje sa pravim savetom i kvalitetnim repromaterijalom.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
        <div className="bg-agro-50 p-6 rounded-2xl flex gap-4">
          <ShieldCheck className="text-agro-600 shrink-0" size={24} />
          <div>
            <h4 className="font-bold mb-1">Kvalitet na prvom mestu</h4>
            <p className="text-sm opacity-80">Svi naši proizvodi su sertifikovani i dolaze od proverenih svetskih i domaćih brendova.</p>
          </div>
        </div>
        <div className="bg-earth-50 p-6 rounded-2xl flex gap-4">
          <Heart className="text-earth-600 shrink-0" size={24} />
          <div>
            <h4 className="font-bold mb-1">Stručni saveti</h4>
            <p className="text-sm opacity-80">Naš tim inženjera zaštite bilja je uvek tu da vam pomogne u rešavanju problema na terenu.</p>
          </div>
        </div>
      </div>

      <p>
        Naša misija je da budemo vaša prva adresa kada planirate setvu, štitite svoje useve ili želite da unapredite prinos modernim đubrivima i alatima.
      </p>
    </div>
  </div>
);
