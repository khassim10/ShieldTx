import { useState, useRef } from "react";
import { Fingerprint, RefreshCw, CheckCircle2, XCircle, Lock } from "lucide-react";

const PIN = "1234";
const NB_ENROLLMENTS = 5;

// ─── Gauge SVG animée avec glow ──────────────────────────────────────────────
function ConfidenceGauge({ score, animate }) {
  const r    = 58;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color  = score >= 75 ? "#34d399" : score >= 50 ? "#fbbf24" : "#ef4444";
  const glowId = `glow-${score}`;

  return (
    <div className="relative flex items-center justify-center w-44 h-44">
      <svg className="absolute -rotate-90" width="176" height="176">
        <defs>
          <filter id={glowId}>
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Track */}
        <circle cx="88" cy="88" r={r} fill="none" stroke="#1e293b" strokeWidth="10" />
        {/* Progress */}
        <circle
          cx="88" cy="88" r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={animate ? offset : circ}
          filter={animate && score >= 75 ? `url(#${glowId})` : undefined}
          style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.34,1.4,0.64,1), stroke 0.4s" }}
        />
      </svg>
      <div className="text-center z-10">
        <p className="text-5xl font-black text-white tabular-nums">{animate ? score : "–"}</p>
        <p className="text-xs text-slate-500 font-semibold mt-0.5">/ 100</p>
      </div>
    </div>
  );
}

// ─── Waveform ─────────────────────────────────────────────────────────────────
function Waveform({ bars, maxDwell, color = "violet", label }) {
  const palette = {
    violet:  { bar: "bg-violet-500",  active: "bg-violet-300",  label: "text-violet-400" },
    emerald: { bar: "bg-emerald-500", active: "bg-emerald-300", label: "text-emerald-400" },
    red:     { bar: "bg-red-500",     active: "bg-red-300",     label: "text-red-400" },
    slate:   { bar: "bg-slate-600",   active: "bg-slate-400",   label: "text-slate-500" },
  };
  const c   = palette[color] || palette.violet;
  const max = maxDwell || Math.max(...bars.map((b) => b.dwell || 0), 100);

  return (
    <div>
      {label && (
        <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${c.label}`}>
          {label}
        </p>
      )}
      <div className="flex items-end gap-1.5 h-16">
        {bars.length === 0
          ? [1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-1 shimmer rounded-t-sm" style={{ height: "6px" }} />
            ))
          : bars.slice(0, 4).map((bar, i) => {
              const h = bar.active
                ? 20
                : bar.dwell > 0
                ? Math.max(6, Math.round((bar.dwell / max) * 56))
                : 4;
              return (
                <div key={i} className="flex flex-col items-center gap-0.5 flex-1">
                  <div
                    className={`w-full rounded-t-sm ${
                      bar.active
                        ? `${c.active} animate-pulse`
                        : `${c.bar} animate-bar-grow`
                    }`}
                    style={{ height: `${h}px` }}
                  />
                  <span className="text-[9px] text-slate-700 font-mono">{i + 1}</span>
                </div>
              );
            })}
      </div>
    </div>
  );
}

// ─── Champ PIN ────────────────────────────────────────────────────────────────
function PinInput({ value, onChange, onKeyDown, onKeyUp, onSubmit, buttonLabel, phase }) {
  const filled = value.length;
  return (
    <div className="space-y-3">
      {/* Indicateurs visuels de cases */}
      <div className="flex gap-3 justify-center">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-xl font-mono font-bold transition-all duration-150 ${
              i < filled
                ? "border-violet-500 bg-violet-500/10 text-violet-300"
                : i === filled
                ? "border-violet-400 bg-slate-800 scale-105 shadow-lg shadow-violet-500/20"
                : "border-slate-700 bg-slate-800/50 text-transparent"
            }`}
          >
            {i < filled ? "•" : ""}
          </div>
        ))}
      </div>

      {/* Champ caché pour capturer les frappes */}
      <input
        type="password"
        maxLength={4}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        autoComplete="off"
        className="sr-only"
        id="pin-input"
      />

      <div className="flex gap-2">
        <label
          htmlFor="pin-input"
          className="flex-1 flex items-center justify-center gap-2 border border-dashed border-slate-700 hover:border-violet-500/50 rounded-xl py-3 text-slate-500 text-xs font-medium cursor-pointer transition-colors"
        >
          <Lock size={13} /> Cliquez ici puis tapez <span className="font-mono font-bold text-white">1234</span>
        </label>
        <button
          onClick={onSubmit}
          disabled={value.length < 4}
          className="bg-violet-600 hover:bg-violet-500 active:scale-95 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white font-bold px-5 rounded-xl transition-all text-sm"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────
function ShieldPrint() {
  const [phase, setPhase]           = useState("enrollment");
  const [enrollments, setEnrollments] = useState([]);
  const [signatureRef, setSignatureRef] = useState(null);
  const [liveBars, setLiveBars]     = useState([]);
  const [lastTestBars, setLastTestBars] = useState([]);
  const [pinValue, setPinValue]     = useState("");
  const [score, setScore]           = useState(0);
  const [gaugeAnimate, setGaugeAnimate] = useState(false);
  const [verdict, setVerdict]       = useState(null);
  const [errorMsg, setErrorMsg]     = useState("");
  const downTimesRef = useRef({});

  const maxDwellRef = signatureRef ? Math.max(...signatureRef, 1) : 200;
  const refBars = signatureRef
    ? signatureRef.map((d) => ({ dwell: d, active: false, key: "" }))
    : [];

  const handleKeyDown = (e) => {
    if (!/[0-9]/.test(e.key)) return;
    downTimesRef.current[e.key] = performance.now();
    setLiveBars((prev) => [...prev, { dwell: 0, active: true, key: e.key }]);
  };

  const handleKeyUp = (e) => {
    if (!/[0-9]/.test(e.key)) return;
    const t0    = downTimesRef.current[e.key];
    const dwell = t0 ? Math.round(performance.now() - t0) : 50;
    setLiveBars((prev) => {
      const rev = [...prev].reverse();
      const lastActive = rev.findIndex((b) => b.key === e.key && b.active);
      if (lastActive === -1) return prev;
      const idx = prev.length - 1 - lastActive;
      return prev.map((b, i) => (i === idx ? { ...b, dwell, active: false } : b));
    });
  };

  const handleChange = (e) =>
    setPinValue(e.target.value.replace(/\D/g, "").slice(0, 4));

  const resetInput = () => {
    setPinValue("");
    setLiveBars([]);
    downTimesRef.current = {};
  };

  const submit = () => {
    if (pinValue !== PIN) {
      setErrorMsg(`Code incorrect — saisissez le code imposé : "${PIN}"`);
      resetInput();
      return;
    }
    setErrorMsg("");
    const completed = liveBars.filter((b) => !b.active);
    const dwells    = completed.slice(0, 4).map((b) => b.dwell || 50);

    if (phase === "enrollment") {
      const next = [...enrollments, dwells];
      setEnrollments(next);
      if (next.length >= NB_ENROLLMENTS) {
        setSignatureRef(calcMoyenne(next));
        setPhase("verification");
      }
    } else {
      setLastTestBars(completed.slice(0, 4));
      const s = compareSignatures(signatureRef, dwells);
      setScore(s);
      setVerdict(s >= 75 ? "match" : "mismatch");
      setPhase("result");
      setTimeout(() => setGaugeAnimate(true), 250);
    }
    resetInput();
  };

  const calcMoyenne = (all) => {
    const len = all[0].length;
    return Array.from({ length: len }, (_, col) =>
      Math.round(all.reduce((sum, row) => sum + (row[col] || 0), 0) / all.length)
    );
  };

  const compareSignatures = (ref, test) => {
    let total = 0;
    for (let i = 0; i < ref.length; i++) {
      const diff = Math.abs(ref[i] - (test[i] || 0));
      total += ref[i] > 0 ? (diff / ref[i]) * 100 : 100;
    }
    return Math.round(Math.max(0, 100 - total / ref.length));
  };

  const resetAll = () => {
    setPhase("enrollment"); setEnrollments([]); setSignatureRef(null);
    setLiveBars([]); setLastTestBars([]); setScore(0);
    setGaugeAnimate(false); setVerdict(null); setErrorMsg("");
    resetInput();
  };

  const retester = () => {
    setPhase("verification"); setGaugeAnimate(false);
    setScore(0); setVerdict(null); resetInput();
  };

  // ── Rendu ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 sm:px-6 overflow-x-hidden">

      {/* Fond subtil */}
      <div className="pointer-events-none fixed inset-0 flex items-start justify-center overflow-hidden">
        <div className="mt-20 h-96 w-96 rounded-full bg-violet-800/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-lg animate-page-in">

        {/* ── En-tête ──────────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/25 rounded-full px-4 py-1.5 mb-5">
            <Fingerprint size={14} className="text-violet-400" />
            <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">
              Biométrie comportementale
            </span>
          </div>
          <h1 className="text-5xl font-extrabold text-white tracking-tight">
            Shield<span className="text-violet-400">Print</span>
            <span className="text-xl text-violet-400/60 align-super">™</span>
          </h1>
          <p className="text-slate-400 mt-3 max-w-sm mx-auto text-sm leading-relaxed">
            Votre rythme de frappe est unique. Notre IA le reconnaît
            et détecte toute tentative d'usurpation en temps réel.
          </p>
        </div>

        {/* ── Erreur inline ───────────────────────────────────────── */}
        {errorMsg && (
          <div className="mb-5 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 text-amber-400 text-sm text-center animate-fade-in">
            {errorMsg}
          </div>
        )}

        {/* ════════ ENRÔLEMENT ════════ */}
        {phase === "enrollment" && (
          <div className="space-y-4">

            {/* Progression */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-slate-300">Phase d'enrôlement</p>
                <span className="text-sm font-black text-violet-400 tabular-nums">
                  {enrollments.length} / {NB_ENROLLMENTS}
                </span>
              </div>
              {/* Indicateurs d'étape */}
              <div className="flex gap-2 mb-3">
                {Array.from({ length: NB_ENROLLMENTS }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                      i < enrollments.length ? "bg-violet-500" : "bg-slate-800"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500">
                Tapez <span className="font-bold text-white font-mono">1234</span>{" "}
                à votre rythme naturel pour créer votre profil biométrique.
              </p>
            </div>

            {/* Waveform live + historique */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <Waveform bars={liveBars.slice(0, 4)} maxDwell={200} color="violet" label="Empreinte en cours" />

              {enrollments.length > 0 && (
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                    Essais enregistrés
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {enrollments.map((e, i) => (
                      <div key={i} className="bg-slate-800/50 rounded-xl p-3">
                        <Waveform
                          bars={e.map((d) => ({ dwell: d, active: false, key: "" }))}
                          maxDwell={Math.max(...e, 1)}
                          color="slate"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Saisie */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <PinInput
                value={pinValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
                onSubmit={submit}
                buttonLabel="Enregistrer"
                phase={phase}
              />
            </div>
          </div>
        )}

        {/* ════════ VÉRIFICATION ════════ */}
        {phase === "verification" && (
          <div className="space-y-4">

            {/* Signature de référence */}
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shrink-0" />
                <p className="text-sm font-bold text-emerald-400">Modèle biométrique entraîné</p>
              </div>
              <Waveform bars={refBars} maxDwell={maxDwellRef} color="emerald" label="Votre signature de référence" />
              <p className="text-[10px] text-slate-700 mt-2 font-mono">
                [{signatureRef?.join(" | ")} ms]
              </p>
            </div>

            {/* Waveform live test */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <Waveform bars={liveBars.slice(0, 4)} maxDwell={maxDwellRef} color="violet" label="Test en cours" />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <p className="text-xs text-slate-500 mb-4">
                Tapez à nouveau <span className="font-bold text-white font-mono">1234</span>{" "}
                pour vérifier votre identité
              </p>
              <PinInput
                value={pinValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
                onSubmit={submit}
                buttonLabel="Analyser"
                phase={phase}
              />
            </div>

            <p className="text-center text-xs text-slate-700 pb-2">
              Astuce : donnez le téléphone à quelqu'un d'autre pour voir le score chuter
            </p>
          </div>
        )}

        {/* ════════ RÉSULTAT ════════ */}
        {phase === "result" && (
          <div className="space-y-4 animate-page-in">

            {/* Verdict */}
            <div className={`rounded-2xl p-8 border text-center ${
              verdict === "match"
                ? "bg-emerald-500/8 border-emerald-500/25"
                : "bg-red-500/8 border-red-500/25"
            }`}>
              <div className="flex justify-center mb-5">
                <ConfidenceGauge score={score} animate={gaugeAnimate} />
              </div>

              <div className="flex items-center justify-center gap-2 mb-2">
                {verdict === "match"
                  ? <CheckCircle2 size={20} className="text-emerald-400" />
                  : <XCircle size={20} className="text-red-400" />
                }
                <h2 className={`text-xl font-extrabold ${
                  verdict === "match" ? "text-emerald-400" : "text-red-400"
                }`}>
                  {verdict === "match" ? "Identité confirmée" : "Profil suspect détecté"}
                </h2>
              </div>

              <p className={`text-xs ${
                verdict === "match" ? "text-emerald-700" : "text-red-700"
              }`}>
                {verdict === "match"
                  ? "Le rythme de frappe correspond à votre profil biométrique."
                  : "Le rythme de frappe est anormal — possible usurpation d'identité."}
              </p>
            </div>

            {/* Comparaison */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                Analyse comparative
              </p>
              <Waveform bars={refBars} maxDwell={maxDwellRef} color="emerald" label="Référence" />
              <div className="border-t border-slate-800 pt-4">
                <Waveform
                  bars={lastTestBars}
                  maxDwell={maxDwellRef}
                  color={verdict === "match" ? "emerald" : "red"}
                  label="Votre dernière saisie"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={retester}
                className="flex-1 border border-slate-700 hover:border-violet-500/60 text-slate-300 hover:text-violet-400 font-bold py-3 rounded-xl transition-all active:scale-95 text-sm"
              >
                Retester
              </button>
              <button
                onClick={resetAll}
                className="flex items-center justify-center gap-2 flex-1 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 font-bold py-3 rounded-xl transition-all text-sm"
              >
                <RefreshCw size={14} /> Recommencer
              </button>
            </div>
          </div>
        )}

        {/* ── Explainer ───────────────────────────────────────────── */}
        <div className="mt-10 bg-slate-900/50 border border-slate-800/50 rounded-2xl p-5">
          <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
            <Fingerprint size={13} className="text-violet-400" />
            Comment fonctionne ShieldPrint™ ?
          </h3>
          <div className="space-y-1.5 text-xs text-slate-500 leading-relaxed">
            {[
              ["Dwell Time", "durée d'appui sur chaque touche, propre à chaque individu."],
              ["Enrôlement",  "5 saisies construisent votre signature biométrique de référence."],
              ["Score",       "l'écart entre la frappe actuelle et la référence détermine la confiance."],
              ["Cas d'usage", "avant chaque transfert Mobile Money important, ShieldPrint confirme que c'est bien vous."],
            ].map(([term, def]) => (
              <p key={term}>
                <span className="text-slate-300 font-semibold">{term} — </span>{def}
              </p>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default ShieldPrint;
