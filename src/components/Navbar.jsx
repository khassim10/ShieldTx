import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, LogOut, Fingerprint, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const publicLinks = [{ path: "/", label: "Accueil" }];
  const protectedLinks = [
    { path: "/verification", label: "Vérifier" },
    { path: "/signalement", label: "Signaler" },
    { path: "/dashboard", label: "Dashboard" },
  ];
  const visibleLinks = user ? [...publicLinks, ...protectedLinks] : publicLinks;

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  const close = () => setOpen(false);

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-5 py-3.5 relative z-40">
      <div className="flex items-center justify-between max-w-6xl mx-auto">

        {/* Logo */}
        <Link to="/" onClick={close} className="flex items-center gap-2 shrink-0">
          <ShieldCheck className="text-blue-500" size={26} />
          <span className="text-lg font-extrabold text-white tracking-tight">
            Shield<span className="text-blue-500">Tx</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-5">
          {visibleLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? "text-blue-400 border-b-2 border-blue-400 pb-0.5"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* ShieldPrint — badge spécial */}
          <Link
            to="/shieldprint"
            className={`flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full border transition-all ${
              isActive("/shieldprint")
                ? "bg-violet-500/20 text-violet-300 border-violet-500/50"
                : "text-violet-400 border-violet-500/25 hover:bg-violet-500/10 hover:border-violet-500/50 hover:text-violet-300"
            }`}
          >
            <Fingerprint size={13} />
            ShieldPrint™
          </Link>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
              <span className="text-xs text-slate-500 font-medium">{user.nom}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors font-medium"
              >
                <LogOut size={14} /> Déconnexion
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-all"
            >
              Connexion
            </Link>
          )}
        </div>

        {/* Hamburger mobile */}
        <button
          className="md:hidden text-slate-400 hover:text-white transition-colors p-1"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900 border-b border-slate-800 px-5 py-5 flex flex-col gap-4 shadow-xl">
          {visibleLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={close}
              className={`text-sm font-medium transition-colors ${
                isActive(link.path) ? "text-blue-400" : "text-slate-400 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <Link
            to="/shieldprint"
            onClick={close}
            className="flex items-center gap-2 text-sm font-bold text-violet-400"
          >
            <Fingerprint size={14} />
            ShieldPrint™
          </Link>

          <div className="pt-4 border-t border-slate-800">
            {user ? (
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{user.nom}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-xs text-red-400 font-medium"
                >
                  <LogOut size={14} /> Déconnexion
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={close}
                className="block text-center bg-blue-500 text-white text-sm font-bold px-4 py-2.5 rounded-lg"
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
