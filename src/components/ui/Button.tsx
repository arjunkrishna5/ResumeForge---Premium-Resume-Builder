import React from "react";
import { cn } from "../../lib/utils";
import { motion, HTMLMotionProps } from "motion/react";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/20 disabled:opacity-50 disabled:pointer-events-none active:scale-95 cursor-pointer";
    
    const variants = {
      primary: "bg-primary text-white hover:bg-[#4F46E5] hover:shadow-[0_4px_12px_rgba(99,102,241,0.2)] hover:-translate-y-[1px] border-none",
      secondary: "bg-navy text-white hover:bg-navy-light",
      outline: "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-400",
      ghost: "text-slate-600 hover:text-navy hover:bg-slate-100",
      danger: "bg-red-50 text-red-600 hover:bg-red-100",
    };

    const sizes = {
      sm: "py-2 px-4 text-xs",
      md: "py-[10px] px-[20px] text-sm",
      lg: "h-12 px-6 text-base",
    };

    return (
      <motion.button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
