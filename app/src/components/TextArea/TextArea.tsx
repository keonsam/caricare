import ErrorMessage from '../ErrorMessage/ErrorMessage';
import styles from './TextArea.module.css';
import {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';

type Props<T extends FieldValues> = {
  classes?: string;
  label: string;
  required?: boolean;
  id: string;
  name: Path<T>;
  options?: RegisterOptions;
  placeholder?: string;
  register: UseFormRegister<T>;
  phaceholder?: string;
  value?: string;
  error?: string;
};

const TextArea = <T extends FieldValues>({
  classes = '',
  label,
  id,
  required,
  name,
  options,
  error,
  placeholder,
  register,
}: Props<T>) => {
  return (
    <div className={`${styles.textarea} ${classes}`}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={styles.input}
        required={required}
        placeholder={placeholder}
        {...register(name, options)}
        rows={3}
      />
      <ErrorMessage message={error} />{' '}
    </div>
  );
};

export default TextArea;
