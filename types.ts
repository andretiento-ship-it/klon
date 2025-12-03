export type Step = 1 | 2 | 3 | 4 | 5;

export interface ProductImage {
  id: string;
  file: File;
  previewUrl: string;
}

export type EnvironmentType = 'Studio' | 'Jalanan Kota' | 'Pantai' | 'Cafe' | 'Alam Hutan' | 'Custom';

export interface AppState {
  referenceImage: File | null;
  referencePreview: string | null;
  
  modelMode: 'description' | 'image';
  modelDescription: string;
  modelImage: File | null;
  modelPreview: string | null;
  
  productImages: ProductImage[];
  
  environmentType: EnvironmentType;
  customEnvironment: string;
  
  generatedImages: string[];
  isGenerating: boolean;
  generationProgress: number; // 0 to 100
}

export const ENVIRONMENTS: { type: EnvironmentType; label: string; description: string }[] = [
  { type: 'Studio', label: 'Studio Foto', description: 'Pencahayaan profesional, latar belakang minimalis.' },
  { type: 'Jalanan Kota', label: 'Urban Street', description: 'Suasana kota modern, jalanan beraspal, gedung.' },
  { type: 'Pantai', label: 'Pantai Eksotis', description: 'Pasir putih, laut biru, pencahayaan matahari cerah.' },
  { type: 'Cafe', label: 'Cafe Aesthetic', description: 'Interior hangat, kopi, suasana santai.' },
  { type: 'Alam Hutan', label: 'Alam Terbuka', description: 'Pepohonan hijau, cahaya natural lembut.' },
];
