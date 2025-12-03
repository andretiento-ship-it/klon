import React from 'react';
import { Step } from '../types';
import { Check } from 'lucide-react';

interface Props {
  currentStep: Step;
}

export const Stepper: React.FC<Props> = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Referensi' },
    { number: 2, label: 'Model' },
    { number: 3, label: 'Produk' },
    { number: 4, label: 'Lokasi' },
    { number: 5, label: 'Hasil' },
  ];

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-center w-full">
        {steps.map((step, idx) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          const isLast = idx === steps.length - 1;

          return (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    isCompleted
                      ? 'bg-indigo-500 text-white'
                      : isCurrent
                      ? 'bg-indigo-600 ring-4 ring-indigo-500/20 text-white shadow-lg shadow-indigo-500/40'
                      : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : step.number}
                </div>
                <span className={`absolute top-12 text-xs md:text-sm font-medium whitespace-nowrap ${isCurrent ? 'text-indigo-400' : 'text-zinc-600'}`}>
                    {step.label}
                </span>
              </div>
              
              {!isLast && (
                <div className="flex-1 h-0.5 bg-zinc-800 mx-2 md:mx-4 relative min-w-[20px] md:min-w-[60px]">
                  <div 
                    className="absolute inset-0 bg-indigo-500 transition-all duration-500" 
                    style={{ width: isCompleted ? '100%' : '0%' }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
