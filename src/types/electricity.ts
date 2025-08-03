export interface ElectricityFields {
  // Boolean fields
  "Est-ce bien une facture d'énergie ?": boolean;
  
  // Empty fields
  codeTVA: string;
  
  // Text fields
  "Langue du document": string;
  Mois: string;
  "Mois de facturation": string;
  "Nature du document": string;
  "Nom du district": string;
  "Nom du fichier": string;
  "Type de facture": string;
  
  // Number fields
  "Avance/Consom.": number;
  Bonification: number;
  "coe. K": number;
  ConsommationJour: number;
  ConsommationNuit: number;
  ConsommationPointe: number;
  ConsommationSoir: number;
  ContributionRTT: number;
  "Depassement Puissance": number;
  "Montant net à payer": number;
  "Montant total en chiffres coupon": number;
  MontantJour: number;
  MontantNuit: number;
  MontantPointe: number;
  MontantSoir: number;
  "N°Facture": string;
  "P.U Jour": number;
  "P.U Nuit": number;
  "P.U Pointe": number;
  "P.U Soir": number;
  Pénalité: number;
  PrimedePuissance: number;
  "Puissance Installée": number;
  PuissanceMaximaleAppeléeJour: number;
  PuissanceMaximaleAppeléePointeHiver: number;
  PuissanceMaximaleAppeléePointeéte: number;
  PuissanceMaximaleAppeléeRéduite: number;
  PuissanceMaximaleAppeléeSoir: number;
  PuissanceSouscriteJour: number;
  PuissanceSouscritePointeHiver: number;
  PuissanceSouscritePointeété: number;
  PuissanceSouscriteRéduite: number;
  PuissanceSouscriteSoir: number;
  Référence: string;
  "Sous Total": number;
  SurtaxeMunicipale: number;
  Total1: number;
  "cos φ": number;
  
  // Amount in letters
  "Montant en lettres": string;
}

export const electricityFieldLabels: Record<keyof ElectricityFields, string> = {
  "Est-ce bien une facture d'énergie ?": "Est-ce bien une facture d'électricité ?",
  codeTVA: "Code TVA",
  "Langue du document": "Langue du document",
  Mois: "Mois",
  "Mois de facturation": "Mois de facturation",
  "Nature du document": "Nature du document",
  "Nom du district": "Nom du district",
  "Nom du fichier": "Nom du fichier",
  "Type de facture": "Type de facture",
  "Avance/Consom.": "Avance/Consom.",
  Bonification: "Bonification",
  "coe. K": "Coef. K",
  ConsommationJour: "Consommation Jour",
  ConsommationNuit: "Consommation Nuit",
  ConsommationPointe: "Consommation Pointe",
  ConsommationSoir: "Consommation Soir",
  ContributionRTT: "Contribution RTT",
  "Depassement Puissance": "Dépassement Puissance",
  "Montant net à payer": "Montant net à payer",
  "Montant total en chiffres coupon": "Montant total en chiffres coupon",
  MontantJour: "Montant Jour",
  MontantNuit: "Montant Nuit",
  MontantPointe: "Montant Pointe",
  MontantSoir: "Montant Soir",
  "N°Facture": "N° Facture",
  "P.U Jour": "P.U Jour",
  "P.U Nuit": "P.U Nuit",
  "P.U Pointe": "P.U Pointe",
  "P.U Soir": "P.U Soir",
  Pénalité: "Pénalité",
  PrimedePuissance: "Prime de Puissance",
  "Puissance Installée": "Puissance Installée",
  PuissanceMaximaleAppeléeJour: "Puissance Maximale Appelée Jour",
  PuissanceMaximaleAppeléePointeHiver: "Puissance Maximale Appelée Pointe Hiver",
  PuissanceMaximaleAppeléePointeéte: "Puissance Maximale Appelée Pointe Été",
  PuissanceMaximaleAppeléeRéduite: "Puissance Maximale Appelée Réduite",
  PuissanceMaximaleAppeléeSoir: "Puissance Maximale Appelée Soir",
  PuissanceSouscriteJour: "Puissance Souscrite Jour",
  PuissanceSouscritePointeHiver: "Puissance Souscrite Pointe Hiver",
  PuissanceSouscritePointeété: "Puissance Souscrite Pointe Été",
  PuissanceSouscriteRéduite: "Puissance Souscrite Réduite",
  PuissanceSouscriteSoir: "Puissance Souscrite Soir",
  Référence: "Référence",
  "Sous Total": "Sous Total",
  SurtaxeMunicipale: "Surtaxe Municipale",
  Total1: "Total 1",
  "cos φ": "cos φ",
  "Montant en lettres": "Montant en lettres"
};
