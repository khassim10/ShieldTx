import { useState } from "react";
import { AlertTriangle, CheckCircle2, Copy } from "lucide-react";

const TYPES = ["Phishing SMS", "Faux gain", "Usurpation d'identité", "SIM Swap", "Autre"];
const ZONES = ["Lomé", "Sokodé", "Kara", "Atakpamé", "Kpalimé", "Dapaong", "Autre"];

function genRef() {
  return "REF-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

function Signalement() {
  const [form, setForm] = useState({ numero: "", type: "", zone: "", description: "" });
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState("");
  const [copied, setCopied] = useState(false);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = () => {
    if (!form.numero || !form.type || !form.zone) return;
    setReference(genRef());
    setSubmitted(true);
  };

  const copyRef = () => {
    navigator.clipboard.writeText(reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setSubmitted(false);
    setReference("");
    setCopied(false);
    setForm({ numero: "", type: "", zone: "", description: "" });
  };

  // ── Confirmation ─────────────────────────────────────────────────
  if (submitted)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 sm:px-6">
        <div className="text-center max-w-sm w-full">
          <CheckCircle2 size={64} className="text-emerald-400 mx-auto mb-4" />
          <h2 className="text-3xl font-extrabold text-white mb-2">Signalement envoyé !</h2>
          <p className="text-slate-400 mb-6 text-sm">
            Merci de protéger la communauté togolaise.
          </p>

          {/* Référence */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-4 mb-6 flex items-center justify-between gap-3">
            <div className="text-left">
              <p className="text-xs text-slate-500 mb-0.5">Numéro de référence</p>
              <p className="text-white font-mono font-bold">{reference}</p>
            </div>
            <button
              onClick={copyRef}
              className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800"
            >
              {copied ? <CheckCircle2 size={18} className="text-emerald-400" /> : <Copy size={18} />}
            </button>
          </div>

          <button
            onClick={reset}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-lg transition-all"
          >
            Nouveau signalement
          </button>
        </div>
      </div>
    );

  // ── Formulaire ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 px-4 py-12 sm:px-6 sm:py-16 animate-page-in">
      <div className="mx-auto w-full max-w-xl">

        <div className="flex items-center gap-3 mb-2 justify-center">
          <AlertTriangle className="text-orange-400" size={28} />
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Signaler une <span className="text-orange-400">fraude</span>
          </h1>
        </div>
        <p className="text-slate-400 text-center mb-10 text-sm">
          Protégez votre communauté en signalant un numéro suspect
        </p>

        <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-8 flex flex-col gap-5">

          <Field label="Numéro suspect *">
            <input
              type="text"
              placeholder="Ex : 90 12 34 56"
              value={form.numero}
              onChange={set("numero")}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors font-mono"
            />
          </Field>

          <Field label="Type d'arnaque *">
            <select
              value={form.type}
              onChange={set("type")}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
            >
              <option value="">Sélectionner...</option>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>

          <Field label="Zone *">
            <select
              value={form.zone}
              onChange={set("zone")}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
            >
              <option value="">Sélectionner...</option>
              {ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
            </select>
          </Field>

          <Field label="Description (optionnel)">
            <textarea
              placeholder="Décrivez brièvement ce qui s'est passé..."
              value={form.description}
              onChange={set("description")}
              rows={4}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors resize-none"
            />
          </Field>

          <button
            onClick={handleSubmit}
            disabled={!form.numero || !form.type || !form.zone}
            className="bg-orange-500 hover:bg-orange-600 active:scale-95 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-orange-500/20"
          >
            Envoyer le signalement
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-slate-400 text-sm mb-1.5 block font-medium">{label}</label>
      {children}
    </div>
  );
}

export default Signalement;
