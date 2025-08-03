export interface GasFields {
  // Date fields
  "Date d'émission": string;
  "Date Limite de Paiement": string;
  "Date prélèvement automatique": string;
  
  // Numeric fields - Identifiants & Références
  "Koncile ID": string;
  "N° FACTURE": string;
  "Numéro de Client": string;
  "Numéro d'ordre": string;
  "Clé de contrôle": string;
  
  // Index & Compteurs
  "RELEVE DES INDEX ANCIEN": number;
  "RELEVE DES INDEX NOUVEAU": number;
  DIFFERENCE: number;
  "FACTEUR DE CORRECTION": number;
  "CONSOMMATION EN NM3": number;
  "Consommation TOTALE en NM3": number;
  "CONSOMMATION EN PLUS OU EN MONS EN NM3": number;
  "CONSOMMATION PRORATA EN NM3": number;
  PCS: number;
  "DEBIT SOUSCRIT": number;
  "DEBIT APPELE": number;
  
  // Montants & Tarification
  "PRIX UNITAIRE HT": number;
  "MONTANT DE CONSOMMATION HT": number;
  "TOTAL EN HT": number;
  "FOND DE TRANSITION ENERGETIQUE": number;
  "REDEVANCE ABON .HT": number;
  "REDEV .DEBIT HORS TAXE": number;
  "REDEV.DEPASS. DEBIT SOUSCRIT": number;
  "LOCATION MATERIEL HT": number;
  "INTERVENTIONS TECHNIQUES": number;
  "FRAIS DE RELANCE HT": number;
  "INTERET DE RETARD HT": number;
  "MONTANT SOUMIS A TVA 7%": number;
  "MONTANT SOUMIS A TVA 19%": number;
  "MONTANT TVA 7%": number;
  "MONTANT TVA 19%": number;
  "AVANCE SUR CONSOMMATION": number;
  "NET A PAYER": number;
  
  // Text fields
  "Nom du fichier": string;
  "Est-ce bien une facture d'énergie ?": string;
  "Nature du document": string;
  "Données contrat": string;
  "COMPTEUR ET CORRECTEUR": string;
  "Nom du fournisseur": string;
  "Adresse du fournisseur": string;
  "Nom du client": string;
  "Adresse du client": string;
  "Référence de paiement": string;
  "Agence de paiement": string;
  "MONTANT EN LETTRES": string;
}

export const gasFieldLabels: Record<keyof GasFields, string> = {
  // Date fields
  "Date d'émission": "Date d'émission",
  "Date Limite de Paiement": "Date Limite de Paiement",
  "Date prélèvement automatique": "Date prélèvement automatique",
  
  // Identifiants & Références
  "Koncile ID": "Koncile ID",
  "N° FACTURE": "N° FACTURE",
  "Numéro de Client": "Numéro de Client",
  "Numéro d'ordre": "Numéro d'ordre",
  "Clé de contrôle": "Clé de contrôle",
  
  // Index & Compteurs
  "RELEVE DES INDEX ANCIEN": "RELEVÉ DES INDEX ANCIEN",
  "RELEVE DES INDEX NOUVEAU": "RELEVÉ DES INDEX NOUVEAU",
  DIFFERENCE: "DIFFÉRENCE",
  "FACTEUR DE CORRECTION": "FACTEUR DE CORRECTION",
  "CONSOMMATION EN NM3": "CONSOMMATION EN NM3",
  "Consommation TOTALE en NM3": "Consommation TOTALE en NM3",
  "CONSOMMATION EN PLUS OU EN MONS EN NM3": "CONSOMMATION EN PLUS OU EN MOINS EN NM3",
  "CONSOMMATION PRORATA EN NM3": "CONSOMMATION PRORATA EN NM3",
  PCS: "PCS",
  "DEBIT SOUSCRIT": "DÉBIT SOUSCRIT",
  "DEBIT APPELE": "DÉBIT APPELÉ",
  
  // Montants & Tarification
  "PRIX UNITAIRE HT": "PRIX UNITAIRE HT",
  "MONTANT DE CONSOMMATION HT": "MONTANT DE CONSOMMATION HT",
  "TOTAL EN HT": "TOTAL EN HT",
  "FOND DE TRANSITION ENERGETIQUE": "FOND DE TRANSITION ÉNERGÉTIQUE",
  "REDEVANCE ABON .HT": "REDEVANCE ABON. HT",
  "REDEV .DEBIT HORS TAXE": "REDEV. DÉBIT HORS TAXE",
  "REDEV.DEPASS. DEBIT SOUSCRIT": "REDEV. DÉPASS. DÉBIT SOUSCRIT",
  "LOCATION MATERIEL HT": "LOCATION MATÉRIEL HT",
  "INTERVENTIONS TECHNIQUES": "INTERVENTIONS TECHNIQUES",
  "FRAIS DE RELANCE HT": "FRAIS DE RELANCE HT",
  "INTERET DE RETARD HT": "INTÉRÊT DE RETARD HT",
  "MONTANT SOUMIS A TVA 7%": "MONTANT SOUMIS À TVA 7%",
  "MONTANT SOUMIS A TVA 19%": "MONTANT SOUMIS À TVA 19%",
  "MONTANT TVA 7%": "MONTANT TVA 7%",
  "MONTANT TVA 19%": "MONTANT TVA 19%",
  "AVANCE SUR CONSOMMATION": "AVANCE SUR CONSOMMATION",
  "NET A PAYER": "NET À PAYER",
  
  // Text fields
  "Nom du fichier": "Nom du fichier",
  "Est-ce bien une facture d'énergie ?": "Est-ce bien une facture d'énergie ?",
  "Nature du document": "Nature du document",
  "Données contrat": "Données contrat",
  "COMPTEUR ET CORRECTEUR": "COMPTEUR ET CORRECTEUR",
  "Nom du fournisseur": "Nom du fournisseur",
  "Adresse du fournisseur": "Adresse du fournisseur",
  "Nom du client": "Nom du client",
  "Adresse du client": "Adresse du client",
  "Référence de paiement": "Référence de paiement",
  "Agence de paiement": "Agence de paiement",
  "MONTANT EN LETTRES": "MONTANT EN LETTRES"
};
