export interface MelaPartner {
  id: string;
  name: string;
  slotId: string;
  theme: 'kesari' | 'gulabi' | 'neela';
  plan: 'basic' | 'featured';
  category: 'shop' | 'food' | 'creator';
  greeting: string;
  contactUrl?: string;
  email?: string;
  whatsapp?: string;
  backdrop?: string;
}

export interface Hotspot {
  id: string;
  type: 'food' | 'toy' | 'balloon' | 'ring' | 'ride' | 'well' | 'stage' | 'finale' | 'partner';
  name: string;
  x: number;
  z: number;
  radius: number;
  dialogue?: string;
  partner?: MelaPartner;
}

export interface BagItem {
  id: string;
  name: string;
  icon: string;
  category: 'food' | 'toy' | 'trophy' | 'souvenir';
  obtainedAt: string;
  description: string;
}

export interface MelaStats {
  balloons: number;
  rings: number;
  ride: boolean;
  wellRide: boolean;
  finale: boolean;
  foodCount: number;
  items: BagItem[];
}

export interface BhajanTrack {
  id: string;
  name: string;
  artist: string;
  youtubeId: string;
  duration: number;
}
