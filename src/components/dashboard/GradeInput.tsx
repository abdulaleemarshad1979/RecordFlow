import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X as CloseIcon } from 'lucide-react';

interface GradeInputProps {
  value: string;
  onChange: (val: string) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export default function GradeInput({ value, onChange, onValidationChange }: GradeInputProps) {
  const [touched, setTouched] = useState(false);

  // Validate grade
  const validateGrade = (val: string): boolean => {
    if (val === '') return false;
    const num = parseFloat(val);
    if (isNaN(num) || num < 0 || num > 10) return false;
    return /^(10(\.0)?|[0-9](\.[0-9])?)$/.test(val);
  };

  const isValueEmpty = value === '';
  const isValid = validateGrade(value);
  const showInvalid = touched && !isValueEmpty && !isValid;
  const showValid = !isValueEmpty && isValid;

  // Let parent component know if the grade is valid
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(isValid);
    }
  }, [value, isValid, onValidationChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    
    // Don't allow spaces or non-numeric characters (except single dot)
    if (rawVal !== '' && !/^[0-9.]*$/.test(rawVal)) {
      return;
    }
    
    // Don't allow multiple decimal points
    if ((rawVal.match(/\./g) || []).length > 1) {
      return;
    }

    onChange(rawVal);
  };

  return (
    <div className="flex flex-col gap-1 w-20 relative">
      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-satoshi select-none">
        Grade
      </label>
      
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={() => setTouched(true)}
          placeholder="0-10"
          className={`w-full h-11 text-center font-satoshi font-semibold text-[15px] text-white rounded-[8px] outline-none transition-all duration-200 border bg-[#0B1120]
            ${
              isValueEmpty
                ? 'border-white/8 focus:border-accent-blue/50 focus:ring-3 focus:ring-accent-blue/10'
                : showValid
                ? 'border-green-500 bg-green-500/[0.04] focus:ring-3 focus:ring-green-500/10'
                : showInvalid
                ? 'border-red-500 bg-red-500/[0.04] focus:ring-3 focus:ring-red-500/10'
                : 'border-white/8'
            }
          `}
        />

        {/* Small icon indicator on the right */}
        <AnimatePresence>
          {showValid && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-green-400 bg-green-500/10 rounded-full p-0.5"
            >
              <Check className="w-3 h-3 stroke-[3px]" />
            </motion.div>
          )}
          {showInvalid && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-red-400 bg-red-500/10 rounded-full p-0.5"
            >
              <CloseIcon className="w-3 h-3 stroke-[3px]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
