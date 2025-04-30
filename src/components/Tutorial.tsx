import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { motion, AnimatePresence } from 'framer-motion';

interface TutorialStep {
  target: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

interface TutorialProps {
  steps: TutorialStep[];
  onComplete: () => void;
}

export const Tutorial: React.FC<TutorialProps> = ({ steps, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  useEffect(() => {
    const targetElement = document.querySelector(steps[currentStep].target);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentStep, steps]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-50 ${isDarkMode ? 'bg-black/50' : 'bg-white/50'}`}
      >
        <div className="relative">
          {/* Contenido del tutorial */}
          <motion.div
            key={currentStep}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`
              p-4 rounded-lg shadow-lg max-w-sm mx-auto mt-4
              ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}
            `}
          >
            <p className="mb-4">{steps[currentStep].content}</p>
            <button
              onClick={handleNext}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {currentStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
            </button>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};