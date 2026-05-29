import React from 'react'

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, className = '', ...rest }, ref) => {
    const cls = `rounded px-3 py-2 border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${className}`.trim()

    return (
      <select ref={ref} className={cls} {...rest}>
        {children}
      </select>
    )
  }
)

Select.displayName = 'Select'

export default Select
