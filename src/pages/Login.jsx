import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ShieldCheck, Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    login({ email, nom: email.split("@")[0] });
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 animate-page-in">
      <div className="max-w-md w-full">
        <div className="flex flex-col items-center mb-8">
          <ShieldCheck className="text-blue-500" size={48} />
          <h1 className="text-3xl font-extrabold text-white mt-2">
            Shield<span className="text-blue-500">Tx</span>
          </h1>
          <p className="text-slate-400 mt-2">Connectez-vous à votre compte</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col gap-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2">
              {error}
            </div>
          )}

          <div>
            <label className="text-slate-400 text-sm mb-1 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-slate-500" size={18} />
              <input
                type="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 text-sm mb-1 block">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-slate-500" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
          >
            Se connecter
          </button>

          <p className="text-center text-slate-400 text-sm">
            Pas encore de compte ?{" "}
            <Link to="/register" className="text-blue-400 hover:underline font-medium">
              Créer un compte
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
