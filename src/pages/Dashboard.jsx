import { mockNumeros, mockTransactions, mockStats } from "../data/mockData";
import ScoreBadge from "../components/ScoreBadge";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

const PIE_COLORS = ["#8b5cf6", "#6d28d9", "#f97316", "#ef4444"];

function Dashboard() {
  const histogrammeData = mockTransactions.map((t) => ({
    date: new Date(t.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
    "Montant (FCFA)": t.montant,
  }));

  const typesData = Object.values(
    mockNumeros.reduce((acc, n) => {
      if (!n.type_fraude) return acc;
      const key = n.type_fraude.toUpperCase().replace("_", " ");
      acc[key] = acc[key] || { type: key, count: 0 };
      acc[key].count += n.nb_signalements;
      return acc;
    }, {})
  );

  const tooltipStyle = {
    contentStyle: { backgroundColor: "#0f172a", border: "1px solid #1e293b", color: "#fff", borderRadius: "8px" },
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 px-4 py-12 sm:px-6 md:px-8 animate-page-in">
      <div className="mx-auto w-full max-w-5xl">

        {/* Titre */}
        <h1 className="text-4xl font-extrabold text-white mb-1">
          Dashboard <span className="text-blue-400">Analytics</span>
        </h1>
        <p className="text-slate-400 mb-8 text-sm">
          Données de fraude signalées au Togo · {mockStats.montant_total.toLocaleString()} FCFA analysés
        </p>

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Transactions", value: mockStats.total, color: "text-white" },
            { label: "Suspectes",    value: mockStats.suspectes, color: "text-amber-400" },
            { label: "Bloquées",     value: mockStats.bloquees, color: "text-red-400" },
            { label: "Signalements", value: mockNumeros.reduce((s, n) => s + n.nb_signalements, 0), color: "text-blue-400" },
          ].map((k, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <p className={`text-3xl font-extrabold ${k.color}`}>{k.value}</p>
              <p className="text-slate-500 text-xs mt-0.5">{k.label}</p>
            </div>
          ))}
        </div>

        {/* Graphiques */}
        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2">

          <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-white font-bold mb-4 text-sm">Volume des transactions (FCFA)</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={histogrammeData}>
                <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 11 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="Montant (FCFA)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-white font-bold mb-4 text-sm">Répartition par type de fraude</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={typesData}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label={({ type }) => type}
                  labelLine
                >
                  {typesData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tableau */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
          <div className="px-6 py-4 border-b border-slate-800">
            <h2 className="text-white font-bold text-sm">Top numéros dangereux</h2>
          </div>
          <table className="min-w-[640px] w-full text-sm">
            <thead className="bg-slate-800/60 text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">Numéro</th>
                <th className="px-6 py-3 text-left">Type de fraude</th>
                <th className="px-6 py-3 text-left">Zone</th>
                <th className="px-6 py-3 text-left">Signalements</th>
                <th className="px-6 py-3 text-left">Indice de risque</th>
              </tr>
            </thead>
            <tbody>
              {mockNumeros.map((r, i) => (
                <tr key={i} className="border-t border-slate-800 hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 text-white font-mono text-xs">+228 {r.numero}</td>
                  <td className="px-6 py-4 text-slate-300">
                    {r.type_fraude ? r.type_fraude.toUpperCase().replace("_", " ") : "—"}
                  </td>
                  <td className="px-6 py-4 text-slate-400 font-medium">{r.zone || "Lomé"}</td>
                  <td className="px-6 py-4 text-slate-300">{r.nb_signalements}</td>
                  <td className="px-6 py-4">
                    <ScoreBadge score={r.score} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
