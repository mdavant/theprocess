

import React from 'react';
// FIX: Import HTMLMotionProps to correctly type the motion component props
import { motion, HTMLMotionProps } from 'framer-motion';

// --- Button ---
// FIX: Extend HTMLMotionProps<'button'> to resolve type conflicts with framer-motion.
interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', children, ...props }, ref) => {
    const baseClasses = "w-full min-h-11 px-4 py-2.5 rounded-lg text-base font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
    
    const variantClasses = {
      primary: 'bg-accent text-white hover:bg-accent-hover',
      secondary: 'bg-secondary text-text-light hover:bg-opacity-80',
      ghost: 'bg-transparent text-accent hover:bg-secondary',
    };

    return (
      <motion.button
        whileTap={{ scale: 0.95 }}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';


// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, icon, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && <label className="block text-sm font-medium text-text mb-1.5">{label}</label>}
                <div className="relative">
                    {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-dark">{icon}</div>}
                    <input
                        type={type}
                        className={`w-full min-h-11 px-3 py-2 bg-primary border border-secondary rounded-lg text-text-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${icon ? 'pl-10' : ''} ${className}`}
                        ref={ref}
                        {...props}
                    />
                </div>
            </div>
        );
    }
);
Input.displayName = 'Input';


// --- Card ---
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={`bg-primary border border-secondary rounded-xl shadow-lg p-4 sm:p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = 'Card';