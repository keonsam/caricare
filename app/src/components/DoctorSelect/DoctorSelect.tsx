import {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';
import styles from './DoctorSelect.module.css';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { useCallback, useEffect, useState } from 'react';
import axiosClient from '../../config/axiosClient';
import { Doctor } from '../../types/User';
import { useAuth } from '../../context/AuthContext';

type DoctorSelectOption = {
  id: string;
  text: string;
};

type Props<T extends FieldValues> = {
  error?: string;
  id: string;
  label: string;
  name: Path<T>;
  options?: RegisterOptions;
  placeholder?: string;
  register: UseFormRegister<T>;
  required?: boolean;
};

export default function DoctorSelect<T extends FieldValues>({
  error,
  label,
  id,
  name,
  options,
  placeholder,
  register,
}: Props<T>) {
  const { token } = useAuth();
  const [doctors, setDoctors] = useState<DoctorSelectOption[]>([]);

  useEffect(() => {
    const getDoctors = async () => {
      try {
        const { data: result } = await axiosClient.get<Doctor[]>('/doctors', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDoctors(
          result.map(({ id, title, firstName, lastName, speciality }) => ({
            id,
            text: `${title} ${firstName} ${lastName} ${speciality}`,
          })),
        );
      } catch (e) {
        // TODO: handle error
        console.log(e);
      }
    };

    if (!doctors.length) {
      getDoctors();
    }
  }, [doctors.length, token]);

  return (
    <div className={styles.textField}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <select
        className={styles.input}
        id={id}
        placeholder={placeholder}
        {...register(name, options)}
      >
        {doctors.length ? (
          doctors.map(({ id, text }) => (
            <option key={id} value={id}>
              {text}
            </option>
          ))
        ) : (
          <option>Loading...</option>
        )}
      </select>
      <ErrorMessage message={error} />
    </div>
  );
}
