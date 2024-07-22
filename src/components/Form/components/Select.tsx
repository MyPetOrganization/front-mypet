'use client'

import { useContext } from 'react'
import { FormContext } from '..'
import styles from './styles.module.scss'
import { SelectPicker } from 'rsuite'

interface SelectProps {
    name: string
    label: string
    options: { value: string, label: string }[]
    placeholder?: string
}

export function Select({ label, name, options, placeholder }: SelectProps) {
    const { formValues, setFormValues } = useContext(FormContext)!

    const handleChange = (value: string, event: React.ChangeEvent<HTMLInputElement>) => {
        // console.log(event)
        setFormValues(prevValues => ({
            ...prevValues,
            [name]: value
        }))
    }

    return (
        <div className={styles.inputContainer}>
            <label className={styles.label} htmlFor={name}>
                {label}
            </label>

            <SelectPicker 
                id={name}
                name={name}
                label={placeholder}
                searchable={false}
                value={formValues[name] || ''}
                onChange={handleChange}
                data={options}
                style={{
                    border: '.5px solid #878787',
                    fontSize: '14px',
                    borderRadius: '6px',
                    
                }}
            />
        </div>
    )
}
