import React, { useState } from 'react';
import { Step, AppState, ProductImage } from './types';
import { Stepper } from './components/Stepper';
import { StepReference } from './components/StepReference';
import { StepModel } from './components/StepModel';
import { StepProducts } from './components/StepProducts';
import { StepEnvironment } from './components/StepEnvironment';
import { StepGenerate } from './components/StepGenerate';
import { generateCloneImage } from './services/geminiService';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  
  const [state, setState] = useState<AppState>({
    referenceImage: null,
    referencePreview: null,
    modelMode: 'description',
    modelDescription: '',
    modelImage: null,
    modelPreview: null,
    productImages: [],
    environmentType: 'Studio',
    customEnvironment: '',
    generatedImages: [],
    isGenerating: false,
    generationProgress: 0,
  });

  // Handlers
  const handleReferenceUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setState(prev => ({ ...prev, referenceImage: file, referencePreview: url }));
  };

  const handleModelUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setState(prev => ({ ...prev, modelImage: file, modelPreview: url }));
  };

  const addProduct = (file: File) => {
    if (state.productImages.length >= 9) return;
    const newProduct: ProductImage = {
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file)
    };
    setState(prev => ({ ...prev, productImages: [...prev.productImages, newProduct] }));
  };

  const removeProduct = (id: string) => {
    setState(prev => ({ ...prev, productImages: prev.productImages.filter(p => p.id !== id) }));
  };

  // Validation
  const canProceed = () => {
    if (currentStep === 1) return !!state.referenceImage;
    if (currentStep === 2) return state.modelMode === 'description' ? state.modelDescription.length > 5 : !!state.modelImage;
    if (currentStep === 3) return state.productImages.length > 0;
    if (currentStep === 4) return state.environmentType === 'Custom' ? state.customEnvironment.length > 2 : true;
    return false;
  };

  const handleGenerate = async () => {
    setCurrentStep(5);
    setState(prev => ({ ...prev, isGenerating: true, generatedImages: [], generationProgress: 0 }));

    const envString = state.environmentType === 'Custom' 
      ? state.customEnvironment 
      : state.environmentType;

    try {
      const results: string[] = [];
      const total = state.productImages.length;
      
      const apiKey = process.env.API_KEY || ''; 
      if (!apiKey) {
          alert("API Key missing. Please check your environment configuration.");
          setState(prev => ({ ...prev, isGenerating: false }));
          return;
      }

      // Process sequentially
      for (let i = 0; i < total; i++) {
        const product = state.productImages[i];
        
        try {
          const base64Image = await generateCloneImage({
            apiKey,
            referenceImage: state.referenceImage!,
            modelData: {
              type: state.modelMode,
              value: state.modelMode === 'description' ? state.modelDescription : state.modelImage!,
            },
            productImage: product.file,
            environment: envString,
          });
          results.push(base64Image);
        } catch (err) {
          console.error(`Failed to generate for product ${i}`, err);
        }

        // Update progress
        setState(prev => ({
          ...prev,
          generationProgress: ((i + 1) / total) * 100
        }));
      }
      
      setState(prev => ({
        ...prev,
        generatedImages: results,
        isGenerating: false,
        generationProgress: 100
      }));

    } catch (error: any) {
      console.error("Fatal Generation Error", error);
      alert("Terjadi kesalahan saat generate gambar.");
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans pb-20">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg"></div>
            <span className="font-bold text-xl tracking-tight">PhotoCloner AI</span>
          </div>
          <div className="text-xs text-zinc-500 font-mono">Gemini 2.5 Flash Powered</div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-8">
        <Stepper currentStep={currentStep} />
        
        <div className="mt-12 min-h-[500px]">
          {currentStep === 1 && (
            <StepReference preview={state.referencePreview} onUpload={handleReferenceUpload} />
          )}
          {currentStep === 2 && (
            <StepModel 
              mode={state.modelMode} 
              description={state.modelDescription} 
              preview={state.modelPreview}
              setMode={(m) => setState(prev => ({ ...prev, modelMode: m }))}
              setDescription={(d) => setState(prev => ({ ...prev, modelDescription: d }))}
              onUpload={handleModelUpload}
            />
          )}
          {currentStep === 3 && (
            <StepProducts 
              products={state.productImages}
              addProduct={addProduct}
              removeProduct={removeProduct}
            />
          )}
          {currentStep === 4 && (
            <StepEnvironment 
              selected={state.environmentType}
              customValue={state.customEnvironment}
              onSelect={(t) => setState(prev => ({ ...prev, environmentType: t }))}
              onCustomChange={(v) => setState(prev => ({ ...prev, customEnvironment: v }))}
            />
          )}
          {currentStep === 5 && (
            <StepGenerate 
              isGenerating={state.isGenerating}
              progress={state.generationProgress}
              results={state.generatedImages}
              productCount={state.productImages.length}
              environment={state.environmentType}
              customEnv={state.customEnvironment}
              onReset={() => {
                setCurrentStep(1);
                setState(prev => ({
                    ...prev, 
                    generatedImages: [], 
                    isGenerating: false, 
                    productImages: [],
                    referencePreview: null,
                    referenceImage: null,
                    modelPreview: null,
                    modelImage: null
                }));
              }}
            />
          )}
        </div>
      </main>

      {/* Footer Navigation */}
      {currentStep < 5 && (
        <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 p-4 z-40">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <button
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1) as Step)}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Kembali</span>
            </button>

            {currentStep === 4 ? (
               <button
               onClick={handleGenerate}
               disabled={!canProceed()}
               className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-bold shadow-lg transition-all ${
                 canProceed() 
                   ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transform hover:scale-105' 
                   : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
               }`}
             >
               <span>Generate Kloning (9 Gambar)</span>
               <ArrowRight className="w-5 h-5" />
             </button>
            ) : (
              <button
                onClick={() => setCurrentStep(prev => Math.min(5, prev + 1) as Step)}
                disabled={!canProceed()}
                className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-bold transition-all ${
                  canProceed() 
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/20 shadow-lg' 
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
              >
                <span>Lanjut</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;