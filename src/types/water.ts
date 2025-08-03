export interface WaterFields {
  // Date fields
  "A payer Avant": string;
  "Période de consommation": string;
  
  // Text fields
  "Nom du fichier": string;
  Police: string;
  
  // Number fields
  "Ancien Index": number;
  "Frais assainissement Frais fixes Montant": number;
  "Frais assainissement Frais fixes Prix Unitaire": number;
  "Frais assainissement Frais fixes Quantité Consommée(m3)": number;
  "Frais assainissement Montant": number;
  "Frais assainissement Prix Unitaire": number;
  "Frais assainissement Consommation Quantité Consommée (m3)": number;
  "Frais de déplacement Montant (HT)": number;
  "Frais de déplacement TVA": number;
  "Frais de déplacement Montant (TTC)": number;
  "Frais de déplacement Qté cons.(m3)": number;
  "Frais de déplacement Qté P.U": number;
  "Frais fixes Montant (HT)": number;
  "Frais fixes Montant (TTC)": number;
  "Frais fixes Qté cons.(m3)": number;
  "Frais fixes Qté P.U": number;
  "Frais fixes TVA": number;
  "Frais Pollution Montant": number;
  "Frais Pollution Prix Unitaire": number;
  "Frais Pollution Quantité Conommée(m3)": number;
  "Nbre d'appartements": number;
  "Nouvel Index": number;
  Prorata: number;
  "Qté cons.(m3)": number;
  "Total des frais de consommation eau et assainissement TTC": number;
  "Total frais assainissement": number;
  "Total frais Cons. eau Montant (HT)": number;
  "Total frais Cons. eau Montant (TTC)": number;
  "Consommation Montant (HT)": number;
  "Consommation Montant (TTC)": number;
  "Consommation P.U": number;
  "Consommation Qté cons.(m3)": number;
  "Consommation TVA": number;
}

export const waterFieldLabels: Record<keyof WaterFields, string> = {
  // Date fields
  "A payer Avant": "À payer Avant",
  "Période de consommation": "Période de consommation",
  
  // Text fields
  "Nom du fichier": "Nom du fichier",
  Police: "Police",
  
  // Number fields
  "Ancien Index": "Ancien Index",
  "Frais assainissement Frais fixes Montant": "Frais assainissement - Frais fixes - Montant",
  "Frais assainissement Frais fixes Prix Unitaire": "Frais assainissement - Frais fixes - Prix Unitaire",
  "Frais assainissement Frais fixes Quantité Consommée(m3)": "Frais assainissement - Frais fixes - Quantité Consommée (m3)",
  "Frais assainissement Montant": "Frais assainissement - Montant",
  "Frais assainissement Prix Unitaire": "Frais assainissement - Prix Unitaire",
  "Frais assainissement Consommation Quantité Consommée (m3)": "Frais assainissement - Consommation - Quantité Consommée (m3)",
  "Frais de déplacement Montant (HT)": "Frais de déplacement - Montant (HT)",
  "Frais de déplacement TVA": "Frais de déplacement - TVA",
  "Frais de déplacement Montant (TTC)": "Frais de déplacement - Montant (TTC)",
  "Frais de déplacement Qté cons.(m3)": "Frais de déplacement - Qté cons. (m3)",
  "Frais de déplacement Qté P.U": "Frais de déplacement - Qté P.U",
  "Frais fixes Montant (HT)": "Frais fixes - Montant (HT)",
  "Frais fixes Montant (TTC)": "Frais fixes - Montant (TTC)",
  "Frais fixes Qté cons.(m3)": "Frais fixes - Qté cons. (m3)",
  "Frais fixes Qté P.U": "Frais fixes - Qté P.U",
  "Frais fixes TVA": "Frais fixes - TVA",
  "Frais Pollution Montant": "Frais Pollution - Montant",
  "Frais Pollution Prix Unitaire": "Frais Pollution - Prix Unitaire",
  "Frais Pollution Quantité Conommée(m3)": "Frais Pollution - Quantité Consommée (m3)",
  "Nbre d'appartements": "Nombre d'appartements",
  "Nouvel Index": "Nouvel Index",
  Prorata: "Prorata",
  "Qté cons.(m3)": "Qté cons. (m3)",
  "Total des frais de consommation eau et assainissement TTC": "Total des frais de consommation eau et assainissement TTC",
  "Total frais assainissement": "Total frais assainissement",
  "Total frais Cons. eau Montant (HT)": "Total frais Cons. eau - Montant (HT)",
  "Total frais Cons. eau Montant (TTC)": "Total frais Cons. eau - Montant (TTC)",
  "Consommation Montant (HT)": "Consommation - Montant (HT)",
  "Consommation Montant (TTC)": "Consommation - Montant (TTC)",
  "Consommation P.U": "Consommation - P.U",
  "Consommation Qté cons.(m3)": "Consommation - Qté cons. (m3)",
  "Consommation TVA": "Consommation - TVA"
};
