function ScoreBadge({ score }) {
  if (score === null || score === undefined)
    return (
      <span className="font-bold px-3 py-1 rounded-full text-sm bg-slate-700/40 text-slate-400">
        —
      </span>
    );
  if (score >= 70)
    return (
      <span className="font-bold px-3 py-1 rounded-full text-sm bg-red-500/15 text-red-400">
        {score}/100
      </span>
    );
  if (score >= 31)
    return (
      <span className="font-bold px-3 py-1 rounded-full text-sm bg-amber-400/15 text-amber-400">
        {score}/100
      </span>
    );
  return (
    <span className="font-bold px-3 py-1 rounded-full text-sm bg-emerald-400/15 text-emerald-400">
      {score}/100
    </span>
  );
}

export default ScoreBadge;
