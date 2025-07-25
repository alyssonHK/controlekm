export interface Driver {
  id: string;
  name: string;
}

export interface Vehicle {
  id: string;
  name: string;
}

export interface Plate {
  id: string;
  number: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface Trip {
  id: string;
  driver: string;
  vehicle: string;
  plate: string;
  km: number;
  origin: string;
  destination: string;
  departureTime: string;
  checklist?: ChecklistItem[];
}
