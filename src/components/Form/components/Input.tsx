'use client'

import { useContext, useState } from 'react'
import { FormContext } from '..'
import styles from './styles.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

interface InputProps {
  type?: 'text' | 'password'
  name: string
  label: string
  placeholder?: string
}

export function Input ({ label, name, placeholder, type = 'text' }: InputProps) {
  const { formValues, setFormValues } = useContext(FormContext)!
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateInput = (value: string, name: string) => {
    let regex;
    if (name === 'favoriteMovie') {
      regex = /^[a-zA-Z0-9 ]*$/;
    } else if (name === 'name') {
      regex = /^[a-zA-Z ]*$/;
    }
    return regex ? regex.test(value) : true;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (validateInput(value, name)) {
      setFormValues(prevValues => ({
        ...prevValues,
        [name]: value
      }));
    }

    if (name === 'email') {
      if (!validateEmail(value)) {
        setErrors({
          ...errors,
          email: 'El correo electrónico no es válido',
        });
      } else {
        const { email, ...rest } = errors;
        setErrors(rest);
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(prevState => !prevState);
  };

  return (
    <div className={styles.inputContainer}>
      <label className={styles.label} htmlFor={name}>
        {label}
      </label>
      <div className={styles.inputWrapper}>
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          id={name}
          name={name}
          value={formValues[name] || ''}
          onChange={handleChange}
          placeholder={placeholder}
        />
        {type === 'password' && (
          <span className={styles.togglePassword} onClick={toggleShowPassword}>
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} style={{ color: "#F28066" }} />
          </span>
        )}
      </div>
      {name === 'email' && errors.email && (
        <span className={styles.error}>{errors.email}</span>
      )}
    </div>
  )
}
