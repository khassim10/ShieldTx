import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-9xl font-extrabold text-slate-800 select-none">404</p>
        <h1 className="text-2xl font-bold text-white mt-2 mb-2">Page introuvable</h1>
        <p className="text-slate-400 mb-8">
          Cette page n'existe pas ou a été déplacée.
        </p>
        <Link
          to="/"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-lg transition-all"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
