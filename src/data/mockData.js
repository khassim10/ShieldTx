export const mockNumeros = [
  {
    numero: "90123456",
    statut: "DANGEREUX",
    score: 95,
    type_fraude: "phishing",
    nb_signalements: 47,
    zone: "Lomé",
    message: "Ce numéro a été signalé 47 fois pour phishing SMS (faux gains)."
  },
  {
    numero: "91234567",
    statut: "DANGEREUX",
    score: 88,
    type_fraude: "sim_swap",
    nb_signalements: 23,
    zone: "Sokodé",
    message: "Ce numéro a été signalé pour SIM swap et usurpation d'identité."
  },
  {
    numero: "92345678",
    statut: "DANGEREUX",
    score: 76,
    type_fraude: "faux_gain",
    nb_signalements: 15,
    zone: "Kara",
    message: "Ce numéro envoie des SMS de faux gains Mobile Money."
  },
  {
    numero: "93456789",
    statut: "SUSPECT",
    score: 55,
    type_fraude: "usurpation",
    nb_signalements: 6,
    zone: "Atakpamé",
    message: "Ce numéro a été signalé 6 fois. Procédez avec prudence."
  },
  {
    numero: "94567890",
    statut: "SUSPECT",
    score: 42,
    type_fraude: "autre",
    nb_signalements: 3,
    zone: "Dapaong",
    message: "Quelques signalements sur ce numéro. Vérifiez l'identité de l'expéditeur."
  },
  {
    numero: "95678901",
    statut: "FIABLE",
    score: 12,
    type_fraude: null,
    nb_signalements: 0,
    zone: "Kpalimé",
    message: "Aucun signalement pour ce numéro."
  },
  {
    numero: "96789012",
    statut: "FIABLE",
    score: 5,
    type_fraude: null,
    nb_signalements: 0,
    zone: "Aného",
    message: "Aucun signalement pour ce numéro."
  },
  {
    numero: "97890123",
    statut: "FIABLE",
    score: 0,
    type_fraude: null,
    nb_signalements: 0,
    zone: "Bassar",
    message: "Aucun signalement pour ce numéro."
  }
];

// Un numéro inconnu n'est PAS fiable — il est simplement inconnu de notre base.
export function verifierNumeroMock(numero) {
  const trouve = mockNumeros.find((n) => n.numero === numero);
  if (trouve) return trouve;
  return {
    numero,
    statut: "INCONNU",
    score: null,
    type_fraude: null,
    nb_signalements: 0,
    zone: "Inconnue",
    message: "Ce numéro n'est pas dans notre base. Procédez avec prudence."
  };
}

export const mockTransactions = [
  { id: 1, montant: 750000, type: "envoi",    statut: "suspecte", score_risque: 85, niveau_risque: "DANGEREUX", created_at: "2026-06-06T23:15:00" },
  { id: 2, montant: 25000,  type: "reception",statut: "normale",  score_risque: 10, niveau_risque: "FIABLE",    created_at: "2026-06-06T14:30:00" },
  { id: 3, montant: 50000,  type: "envoi",    statut: "normale",  score_risque: 15, niveau_risque: "FIABLE",    created_at: "2026-06-05T10:00:00" },
  { id: 4, montant: 200000, type: "retrait",  statut: "suspecte", score_risque: 45, niveau_risque: "SUSPECT",   created_at: "2026-06-04T02:30:00" },
  { id: 5, montant: 15000,  type: "envoi",    statut: "normale",  score_risque: 5,  niveau_risque: "FIABLE",    created_at: "2026-06-03T09:00:00" },
];

export const mockStats = {
  total: 5,
  suspectes: 2,
  bloquees: 0,
  montant_total: 1040000,
};
