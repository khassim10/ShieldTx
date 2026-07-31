import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Mail, Lock, User, Phone } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [form, setForm] = useState({ nom: "", email: "", telephone: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nom || !form.email || !form.telephone || !form.password) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (form.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    login({ email: form.email, nom: form.nom, telephone: form.telephone });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 py-12 animate-page-in">
      <div className="max-w-md w-full">
        <div className="flex flex-col items-center mb-8">
          <ShieldCheck className="text-blue-500" size={48} />
          <h1 className="text-3xl font-extrabold text-white mt-2">
            Shield<span className="text-blue-500">Tx</span>
          </h1>
          <p className="text-slate-400 mt-2">Créez votre compte gratuitement</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col gap-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2">
              {error}
            </div>
          )}

          <div>
            <label className="text-slate-400 text-sm mb-1 block">Prénom *</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-slate-500" size={18} />
              <input
                type="text"
                placeholder="Votre prénom"
                value={form.nom}
                onChange={set("nom")}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 text-sm mb-1 block">Email *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-slate-500" size={18} />
              <input
                type="email"
                placeholder="vous@exemple.com"
                value={form.email}
                onChange={set("email")}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 text-sm mb-1 block">Numéro Togo (+228) *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 text-slate-500" size={18} />
              <input
                type="tel"
                placeholder="90 12 34 56"
                value={form.telephone}
                onChange={set("telephone")}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 transition-colors font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 text-sm mb-1 block">Mot de passe * <span className="text-slate-600">(6 caractères min.)</span></label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-slate-500" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={set("password")}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 text-sm mb-1 block">Confirmer le mot de passe *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-slate-500" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                value={form.confirm}
                onChange={set("confirm")}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-blue-500/20"
          >
            Créer mon compte
          </button>

          <p className="text-center text-slate-400 text-sm">
            Déjà un compte ?{" "}
            <Link to="/login" className="text-blue-400 hover:underline font-medium">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
