import { Link } from "react-router-dom";
import { ShieldCheck, AlertTriangle, Search, BarChart2, Fingerprint, ArrowRight } from "lucide-react";

// Waveform décorative animée — chaque barre oscille à sa propre fréquence
function DecorativeWaveform() {
  const bars = [45, 72, 30, 88, 55, 65, 35, 80, 50, 70, 40, 60];
  const max  = 88;
  return (
    <div className="flex items-end gap-1.5 h-20 px-1">
      {bars.map((v, i) => (
        <div
          key={i}
          className="flex-1 bg-violet-500 rounded-t-md animate-wave-bar"
          style={{
            height: `${Math.round((v / max) * 72)}px`,
            "--dur":   `${1.0 + (i % 5) * 0.22}s`,
            "--delay": `${i * 0.09}s`,
          }}
        />
      ))}
    </div>
  );
}

function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 py-20 sm:py-28 overflow-hidden">

        {/* Gradient mesh */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 left-1/4  w-[500px] h-[500px] bg-blue-600/12  rounded-full blur-3xl" />
          <div className="absolute  top-10 right-1/4 w-[400px] h-[400px] bg-violet-700/8  rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-slate-800/60 blur-2xl" />
        </div>

        <div className="relative animate-page-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <ShieldCheck size={52} className="text-blue-500 drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight">
              Shield<span className="text-blue-500">Tx</span>
            </h1>
          </div>

          <p className="max-w-xl text-lg text-slate-400 sm:text-xl mb-3 leading-relaxed">
            La première plateforme communautaire de détection de fraude
            <span className="text-orange-400 font-semibold"> Mobile Money</span> au Togo.
          </p>
          <p className="text-slate-500 mb-10 max-w-md text-sm leading-relaxed">
            Vérifiez un numéro avant d'envoyer de l'argent. Signalez une arnaque.
            Protégez votre communauté.
          </p>

          <div className="flex gap-4 flex-wrap justify-center">
            <Link
              to="/verification"
              className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
            >
              Vérifier un numéro
            </Link>
            <Link
              to="/signalement"
              className="border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white active:scale-95 font-bold px-8 py-3.5 rounded-xl transition-all"
            >
              Signaler une fraude
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────── */}
      <section className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-5 px-4 py-10 sm:px-6 md:grid-cols-3 md:px-10">
        {[
          { icon: <AlertTriangle className="text-orange-400" size={28} />, value: "128", label: "Numéros signalés", glow: "hover:border-orange-500/40 hover:shadow-orange-500/10" },
          { icon: <Search       className="text-blue-400"   size={28} />, value: "340", label: "Vérifications effectuées", glow: "hover:border-blue-500/40 hover:shadow-blue-500/10" },
          { icon: <BarChart2    className="text-emerald-400" size={28}/>, value: "92%", label: "Taux de détection", glow: "hover:border-emerald-500/40 hover:shadow-emerald-500/10" },
        ].map((stat, i) => (
          <div
            key={i}
            style={{ animationDelay: `${i * 0.08}s` }}
            className={`animate-page-in bg-slate-900 border border-slate-800 rounded-2xl p-7 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${stat.glow}`}
          >
            {stat.icon}
            <p className="text-4xl font-extrabold text-white mt-3">{stat.value}</p>
            <p className="text-slate-400 mt-1 text-sm">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* ── SHIELDPRINT FLAGSHIP ─────────────────────────────────────── */}
      <section className="relative overflow-hidden border-y border-violet-900/30 px-4 py-16 sm:px-6 md:px-10">

        {/* Fond */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-950/50 via-slate-950 to-slate-950" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-80 w-80 rounded-full bg-violet-700/15 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl flex flex-col md:flex-row items-center gap-12">

          {/* Texte */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/25 rounded-full px-4 py-1.5 mb-5">
              <Fingerprint size={13} className="text-violet-400" />
              <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">
                Technologie exclusive
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
              Shield<span className="text-violet-400">Print</span>™
              <br />
              <span className="text-slate-300 font-bold text-2xl sm:text-3xl">
                La biométrie qui vous protège
              </span>
            </h2>

            <p className="text-slate-400 mb-7 text-sm leading-relaxed max-w-md">
              Votre façon de taper votre PIN est aussi unique que votre empreinte
              digitale. ShieldPrint analyse votre rythme de frappe en temps réel
              pour détecter toute usurpation — sans capteur, sans caméra,
              sur n'importe quel téléphone.
            </p>

            <Link
              to="/shieldprint"
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 active:scale-95 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-violet-600/25 hover:shadow-violet-500/40"
            >
              Essayer la démo gratuite
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Carte visuelle avec waveform animée */}
          <div className="flex-1 w-full max-w-xs md:max-w-sm">
            <div className="glow-violet bg-slate-900/90 border border-violet-500/25 rounded-2xl p-6 space-y-5 backdrop-blur-sm">

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse block shrink-0" />
                <p className="text-xs text-violet-400 font-semibold">Empreinte biométrique active</p>
              </div>

              <DecorativeWaveform />

              <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-0.5">Score de confiance</p>
                  <p className="text-3xl font-black text-emerald-400">94%</p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-3 py-2 text-center">
                  <p className="text-xs font-bold text-emerald-400">Identité</p>
                  <p className="text-xs font-bold text-emerald-400">confirmée</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ────────────────────────────────────────── */}
      <section className="px-4 py-16 sm:px-6 md:px-10">
        <h2 className="text-3xl font-bold text-center text-white mb-14">
          Comment ça <span className="text-blue-400">marche ?</span>
        </h2>

        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-4">
          {[
            { step: "01", title: "Vérifiez",      color: "text-blue-400",    border: "border-blue-500/20",    bg: "bg-blue-500/5",    desc: "Entrez un numéro avant d'envoyer — notre algorithme calcule son indice de risque instantanément." },
            { step: "02", title: "Signalez",      color: "text-orange-400",  border: "border-orange-500/20",  bg: "bg-orange-500/5",  desc: "Victime d'une arnaque ? Signalez en 30 secondes pour protéger immédiatement les autres." },
            { step: "03", title: "ShieldPrint™",  color: "text-violet-400",  border: "border-violet-500/20",  bg: "bg-violet-500/5",  desc: "Authentifiez votre identité par votre rythme de frappe — la biométrie la plus accessible au monde." },
            { step: "04", title: "Protégez",      color: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/5", desc: "Chaque action enrichit notre base et rend la communauté togolaise plus sûre." },
          ].map((item, i) => (
            <div
              key={i}
              style={{ animationDelay: `${i * 0.1}s` }}
              className={`animate-page-in flex flex-col items-center text-center p-6 rounded-2xl border ${item.border} ${item.bg} hover:-translate-y-1 transition-transform duration-300`}
            >
              <span className={`text-5xl font-extrabold opacity-25 ${item.color}`}>{item.step}</span>
              <h3 className={`text-base font-bold mt-2 ${item.color}`}>{item.title}</h3>
              <p className="text-slate-400 mt-2 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="text-center py-8 text-slate-700 text-xs border-t border-slate-900">
        ShieldTx — #TCCHackDefend2026 · Tech Campus Clubs · IPNET Institute of Technology
      </footer>
    </div>
  );
}

export default Home;
