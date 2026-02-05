export type User = {
    id: string;
    email: string;
    name: string;
    role: "ADMIN" | "AGRICULTEUR" | "UTILISATEUR";
    phone?: string;
    isActive: boolean;
    createdAt: string; // ISO date
    updatedAt?: string;

    langue ? : "fr" | "en";
    
    
  };
 
export type Parcelle = {
    id: number;
    nom: string;
    superficie: number;
  
    terrainId: number;
    code: string;
  
    azote: number;
    phosphore: number;
    potassium: number;
  
    humidite: number;
    temperature: number;
    ph: number;
  
    culturePredite: string;
  };
  
export type Prediction = {
    N : number;
    P : number;
    K : number;
    Ph : number;
    Humidity : number;
    Temperature : number

  };

export type Recommendation = {
    response : string;

  };

export type Sensor = {
    id : number;
    parcelleId : number;
    nom : string;
    typeMesure : string;
  }


  // Terrain complet (API / BDD)
export type Terrain = {
    id: number;
    nom: string;
    superficie: number;
  
    pays: string;
    ville: string;
    quartier: string;
  };
export type langue = "fr" | "en";

export type Role = "ADMIN" | "AGRICULTEUR" | "UTILISATEUR";