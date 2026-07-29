// Button.jsx
import { Loader2 } from 'lucide-react';

/**
 * Button — Interio97 Design System
 * Variants: primary | secondary | destructive | ghost
 */

const VARIANT_STYLES = {
  primary:
    'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-600 disabled:bg-primary-300',
  secondary:
    'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50 active:bg-neutral-100 disabled:text-neutral-300 disabled:border-neutral-100',
  destructive:
    'bg-error text-white hover:bg-error/90 active:bg-error/90 disabled:bg-error/40',
  ghost:
    'bg-transparent text-neutral-700 hover:bg-neutral-100 active:bg-neutral-100 disabled:text-neutral-300',
};

export default function Button({
  children,
  variant = 'primary',
  icon: Icon,
  iconPosition = 'left',
  isLoading = false,
  disabled = false,
  type = 'button',
  className = '',
  ...props
}) {
  const isDisabled = disabled || isLoading;

  const classes = [
    'inline-flex items-center justify-center gap-2 font-medium text-sm rounded-md py-2 px-4 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed',
    VARIANT_STYLES[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} disabled={isDisabled} aria-busy={isLoading} {...props}>
      {isLoading ? (
        <Loader2 className="animate-spin" size={16} aria-hidden="true" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={16} aria-hidden="true" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={16} aria-hidden="true" />}
        </>
      )}
    </button>
  );
}