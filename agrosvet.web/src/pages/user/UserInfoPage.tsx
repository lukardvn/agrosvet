import { FormEvent, useState } from 'react';
import { Check } from 'lucide-react';
import { useSnackbar } from '../../components/SnackbarProvider';

const storageKey = 'agrosvet-purchase-info';
interface PurchaseInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

const emptyInfo: PurchaseInfo = { fullName: '', email: '', phone: '', address: '', city: '', postalCode: '' };

export const UserInfoPage = () => {
  const snackbar = useSnackbar();
  const [info, setInfo] = useState<PurchaseInfo>(() => {
    try {
      return { ...emptyInfo, ...JSON.parse(localStorage.getItem(storageKey) ?? '{}') };
    } catch {
      return emptyInfo;
    }
  });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    try {
      localStorage.setItem(storageKey, JSON.stringify(info));
      setSaved(true);
      snackbar.success('Podaci za kupovinu sačuvani su na ovom uređaju.');
    } catch {
      snackbar.error('Pregledač nije dozvolio čuvanje podataka na ovom uređaju.');
    }
  };

  const update = (field: keyof typeof info, value: string) => {
    setInfo(current => ({ ...current, [field]: value }));
    setSaved(false);
  };
  const inputClass = 'mt-2 w-full rounded-[3px] border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-agro-700';

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      <h2 className="text-xl font-normal text-agro-950">Podaci za kupovinu</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="text-sm text-slate-600">Ime i prezime<input value={info.fullName} onChange={event => update('fullName', event.target.value)} className={inputClass} /></label>
        <label className="text-sm text-slate-600">Telefon<input value={info.phone} onChange={event => update('phone', event.target.value)} type="tel" className={inputClass} /></label>
        <label className="text-sm text-slate-600">Email<input value={info.email} onChange={event => update('email', event.target.value)} type="email" className={inputClass} /></label>
        <label className="text-sm text-slate-600">Adresa<input value={info.address} onChange={event => update('address', event.target.value)} className={inputClass} /></label>
        <label className="text-sm text-slate-600">Grad<input value={info.city} onChange={event => update('city', event.target.value)} className={inputClass} /></label>
        <label className="text-sm text-slate-600">Poštanski broj<input value={info.postalCode} onChange={event => update('postalCode', event.target.value)} inputMode="numeric" className={inputClass} /></label>
      </div>
      <button className="mt-7 inline-flex items-center gap-2 rounded-[3px] bg-agro-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-agro-800">
        {saved && <Check size={15} />}{saved ? 'Podaci su sačuvani' : 'Sačuvajte podatke'}
      </button>
    </form>
  );
};
