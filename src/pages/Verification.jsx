import { useState } from "react";
import { Search, ShieldCheck, ShieldAlert, ShieldX, ShieldOff } from "lucide-react";
import { verifierNumeroMock } from "../data/mockData";

function Verification() {
  const [numero, setNumero] = useState("");
  const [resultat, setResultat] = useState(null);
  const [loading, setLoading] = useState(false);

  const verifier = () => {
    if (!numero.trim()) return;
    setLoading(true);
    // Simulation d'un appel réseau (800ms)
    setTimeout(() => {
      const data = verifierNumeroMock(numero.trim());
      setResultat(data);
      setLoading(false);
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") verifier();
  };

  const getStatut = (statut, score) => {
    if (statut === "INCONNU" || score === null)
      return {
        label: "INCONNU",
        color: "text-slate-300",
        bg: "bg-slate-500/10 border-slate-500",
        icon: <ShieldOff size={48} className="text-slate-400" />,
        barColor: "bg-slate-500",
        barWidth: "50%",
      };
    if (score >= 70)
      return {
        label: "DANGEREUX",
        color: "text-red-400",
        bg: "bg-red-500/10 border-red-500",
        icon: <ShieldX size={48} className="text-red-500" />,
        barColor: "bg-red-500",
        barWidth: `${score}%`,
      };
    if (score >= 31)
      return {
        label: "SUSPECT",
        color: "text-amber-400",
        bg: "bg-amber-400/10 border-amber-400",
        icon: <ShieldAlert size={48} className="text-amber-400" />,
        barColor: "bg-amber-400",
        barWidth: `${score}%`,
      };
    return {
      label: "FIABLE",
      color: "text-emerald-400",
      bg: "bg-emerald-400/10 border-emerald-400",
      icon: <ShieldCheck size={48} className="text-emerald-400" />,
      barColor: "bg-emerald-400",
      barWidth: `${score}%`,
    };
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 px-4 py-12 sm:px-6 sm:py-16 animate-page-in">
      <div className="mx-auto w-full max-w-xl">

        <h1 className="text-4xl font-extrabold text-white text-center mb-2">
          Vérifier un <span className="text-blue-400">numéro</span>
        </h1>
        <p className="text-slate-400 text-center mb-10 text-sm">
          Entrez un numéro avant d'envoyer de l'argent — indice de risque calculé en temps réel.
        </p>

        {/* Saisie */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Ex : 90 12 34 56"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors font-mono"
          />
          <button
            onClick={verifier}
            disabled={loading || !numero.trim()}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 py-3 font-bold text-white transition-all hover:bg-blue-600 active:scale-95 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
          >
            {loading
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Search size={18} />
            }
            {loading ? "Analyse..." : "Vérifier"}
          </button>
        </div>

        {/* Résultat */}
        {resultat && (() => {
          const s = getStatut(resultat.statut, resultat.score);
          return (
            <div className={`border rounded-2xl p-8 text-center ${s.bg}`}>
              <div className="flex justify-center mb-4">{s.icon}</div>
              <p className={`text-3xl font-extrabold mb-1 ${s.color}`}>{s.label}</p>

              {resultat.score !== null ? (
                <>
                  <p className="text-slate-400 mb-5 text-sm">
                    Indice de risque :{" "}
                    <span className={`font-bold text-xl ${s.color}`}>{resultat.score}/100</span>
                  </p>
                  <div className="w-full bg-slate-800 rounded-full h-2.5 mb-6">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-700 ${s.barColor}`}
                      style={{ width: s.barWidth }}
                    />
                  </div>
                </>
              ) : (
                <p className="text-slate-400 mb-6 text-sm">
                  {resultat.message}
                </p>
              )}

              <div className="grid grid-cols-1 gap-3 text-left sm:grid-cols-2">
                <InfoCard label="Numéro" value={`+228 ${resultat.numero}`} mono />
                <InfoCard label="Signalements" value={resultat.nb_signalements} />
                <InfoCard
                  label="Type d'arnaque"
                  value={resultat.type_fraude
                    ? resultat.type_fraude.toUpperCase().replace("_", " ")
                    : "Aucun signalement"}
                />
                <InfoCard label="Zone" value={resultat.zone} />
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

function InfoCard({ label, value, mono }) {
  return (
    <div className="bg-slate-900 rounded-xl p-4">
      <p className="text-slate-500 text-xs mb-0.5">{label}</p>
      <p className={`text-white font-bold ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

export default Verification;
