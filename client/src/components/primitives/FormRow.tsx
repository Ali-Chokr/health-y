import React from 'react'
import primitives from '@/styles/primitives.module.css'

type FormRowProps = {
  label: string
  htmlFor?: string
  children: React.ReactNode
  className?: string
}

export function FormRow({ label, htmlFor, children, className = '' }: FormRowProps) {
  return (
    <div className={`${primitives.formGroup} ${className}`.trim()}>
      <label htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  )
}

export default FormRow
