import { ReactNode } from 'react';
import styles from './Button.module.css';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
  classes?: string;
  disabled?: boolean;
  label: string | ReactNode;
  color?: 'primary' | 'secondary' | 'warn' | 'default';
  size?: 'full' | 'medium' | 'small';
  type?: 'submit' | 'button';
  variant?: 'solid' | 'outlined';
  onClick?: () => void;
  icon?: IconDefinition;
};

export const Button = ({
  classes = '',
  disabled = false,
  label,
  size = 'small',
  color = 'default',
  type = 'button',
  variant = 'solid',
  onClick,
  icon,
}: Props) => {
  const classStr = `${styles.button} ${styles[variant]} ${styles[color]} ${
    styles[size]
  }  ${disabled && styles.disabled} ${classes}`;

  return (
    <button
      className={classStr}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && <FontAwesomeIcon icon={icon} className={styles.buttonIcon} />}
      {label}
    </button>
  );
};

export default Button;
