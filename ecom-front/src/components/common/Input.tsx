import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className = '', ...props }: InputProps) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-(--ctp-subtext1) mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2 rounded-lg bg-(--ctp-surface0) border border-(--ctp-surface2) text-(--ctp-text) placeholder-(--ctp-overlay0) focus:outline-none focus:ring-2 focus:ring-(--ctp-mauve) focus:border-transparent transition-all ${
          error ? 'border-(--ctp-red)' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-(--ctp-red)">{error}</p>}
    </div>
  );
};
