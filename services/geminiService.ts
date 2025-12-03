import { GoogleGenAI } from "@google/genai";

// Helper to convert File to Base64 and ensure supported format (JPEG)
const processFile = async (file: File): Promise<{ mimeType: string; data: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }
        // Draw image to canvas
        ctx.drawImage(img, 0, 0);
        
        // Always convert to JPEG to ensure compatibility (handles AVIF, etc.)
        const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        const base64 = jpegDataUrl.split(',')[1];
        
        resolve({
          mimeType: 'image/jpeg',
          data: base64
        });
      };
      img.onerror = (err) => reject(new Error("Failed to load image for processing."));
    };
    reader.onerror = (error) => reject(error);
  });
};

interface GenerateCloneParams {
  apiKey: string;
  referenceImage: File;
  modelData: {
    type: 'description' | 'image';
    value: string | File;
  };
  productImage: File;
  environment: string;
}

export const generateCloneImage = async (params: GenerateCloneParams): Promise<string> => {
  const { apiKey, referenceImage, modelData, productImage, environment } = params;

  // IMPORTANT: Create new instance per call to ensure fresh config/key usage if needed
  const ai = new GoogleGenAI({ apiKey });

  // Process images to ensure they are in a supported format (JPEG)
  const refImageProcessed = await processFile(referenceImage);
  const prodImageProcessed = await processFile(productImage);

  const parts: any[] = [];

  // 1. Reference Image (The DNA)
  parts.push({
    text: "REFERENCE_STYLE_IMAGE: Gunakan gambar ini sebagai referensi utama untuk gaya visual, pencahayaan, sudut kamera, dan suasana (Vibe DNA). Hasil akhir HARUS meniru gaya visual gambar ini secara ketat.",
  });
  parts.push({
    inlineData: {
      mimeType: refImageProcessed.mimeType,
      data: refImageProcessed.data,
    },
  });

  // 2. Product Image (The Item to Wear)
  parts.push({
    text: "PRODUCT_IMAGE: Ini adalah produk pakaian/item yang HARUS dipakai oleh model. Pastikan detail produk (warna, motif, bentuk) diaplikasikan secara akurat pada model.",
  });
  parts.push({
    inlineData: {
      mimeType: prodImageProcessed.mimeType,
      data: prodImageProcessed.data,
    },
  });

  // 3. Model Info
  if (modelData.type === 'image' && modelData.value instanceof File) {
    const modelImageProcessed = await processFile(modelData.value);
    parts.push({
      text: "MODEL_REFERENCE: Gunakan wajah dan karakteristik fisik orang dalam gambar ini sebagai model.",
    });
    parts.push({
      inlineData: {
        mimeType: modelImageProcessed.mimeType,
        data: modelImageProcessed.data,
      },
    });
  } else {
    parts.push({
      text: `MODEL_DESCRIPTION: Model adalah ${modelData.value}. Pastikan model terlihat realistis dan sesuai deskripsi.`,
    });
  }

  // 4. Prompt Construction
  const prompt = `
    Bertindaklah sebagai fotografer fashion profesional dan retoucher AI.
    Tugas: Buat foto fashion vertikal (9:16) yang sangat realistis (Photorealistic).
    
    Instruksi Utama:
    1. GAYA VISUAL (DNA): Ambil pencahayaan, color grading, dan mood dari REFERENCE_STYLE_IMAGE.
    2. SUBJEK: Render model berdasarkan MODEL_REFERENCE atau MODEL_DESCRIPTION.
    3. PRODUK: Pakaikan produk dari PRODUCT_IMAGE ke tubuh model secara natural (Virtual Try-On). Kain harus terlihat jatuh secara realistis, mengikuti pose model.
    4. LOKASI: Tempatkan model di lingkungan: "${environment}".
    5. SUDUT: Gunakan sudut pengambilan gambar yang sama dengan REFERENCE_STYLE_IMAGE.
    
    Hasilkan satu gambar berkualitas tinggi, full body atau 3/4 body sesuai referensi, fokus tajam pada produk.
  `;

  parts.push({ text: prompt });

  try {
    // Using gemini-2.5-flash-image for standard tier usage
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: "9:16",
          // imageSize is not supported for gemini-2.5-flash-image
        }
      }
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
    }
    
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};