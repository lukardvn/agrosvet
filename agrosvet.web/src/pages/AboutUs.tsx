import React from 'react';
import { Sprout } from 'lucide-react';

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

      <p>
        Naša misija je da budemo vaša prva adresa kada planirate setvu, štitite svoje useve ili želite da unapredite prinos modernim đubrivima i alatima.
      </p>
    </div>
  </div>
);
