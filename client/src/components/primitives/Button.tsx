import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...rest }, ref) => {
    const base = 'inline-flex items-center rounded font-medium transition-colors'
    const sizes: Record<string, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-6 py-3 text-base',
    }

    const variants: Record<string, string> = {
      primary:
        'bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)] disabled:opacity-60 disabled:cursor-not-allowed',
      secondary:
        'bg-[var(--surface-2)] text-[var(--ink-1)] hover:bg-[#ddd5cc] disabled:opacity-60 disabled:cursor-not-allowed',
    }

    const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`.trim()

    return (
      <button ref={ref} className={cls} {...rest}>
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
