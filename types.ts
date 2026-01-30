export interface BreedCharacteristics {
  livingSituation: 'Appartement' | 'Rijtjeshuis' | 'Vrijstaand';
  experienceLevel: 'Beginner' | 'Gemiddeld' | 'Expert';
  activityLevel: 'Niet echt actief' | 'Gemiddeld' | 'Actief' | 'Topsport';
  childrenCompatible: 'Nee' | 'Ja';
  allergyFriendly: 'Nee' | 'Ja';
}

export interface DogData {
  breed: string;
  certainty: number;
  estimatedWeight: string;
  estimatedAge: string;
  description: string;
  characteristics: BreedCharacteristics;
  possibleBreeds: Array<{
    breed: string;
    percentage: number;
  }>;
}

export interface ScanResult {
  id: string; // 3 digit string
  timestamp: number;
  imageUrl: string;
  data: DogData;
}

export enum AppView {
  HOME = 'HOME',
  SCANNING = 'SCANNING',
  RESULT = 'RESULT',
  RECALL = 'RECALL',
}