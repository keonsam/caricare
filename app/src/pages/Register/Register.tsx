import { useForm } from 'react-hook-form';
import { useState } from 'react';
import TextField from '../../components/TextField/TextField';
import styles from './Register.module.css';
import { RegisterForm, RegisterResponse } from '../../types/Register';
import { isEmail } from '../../utils/validators';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import Button from '../../components/Button/Button';
import AuthLayout from '../../components/AuthLayout/AuthLayout';
import axiosClient from '../../config/axiosClient';
import { useNavigate } from 'react-router-dom';

type AccountTypeProps = {
  active: boolean;
  header: string;
  onClick: () => void;
  text: string;
};
const AccountType = ({ active, header, onClick, text }: AccountTypeProps) => {
  return (
    <button
      className={`${styles.card} ${active && styles.active}`}
      onClick={onClick}
    >
      <h2 className={styles.cardHeader}>{header}</h2>
      <p className={styles.cardText}>{text}</p>
    </button>
  );
};

const Register = () => {
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
    setValue,
  } = useForm<RegisterForm>({
    mode: 'onBlur',
    defaultValues: {
      username: '',
      password: '',
      role: 'patient',
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      const { data: res } = await axiosClient.post<RegisterResponse>(
        '/register',
        data,
      );
      navigate(`/confirmation/${res.confirmationId}`);
    } catch (e) {
      // ts-ignore
      console.log(e);
      if (e instanceof Error) setFormError(e?.message || '');
    }
  };

  const role = getValues('role');

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <p>Account Type:</p>

          <div className={styles.cardContainer}>
            <AccountType
              active={role === 'patient'}
              header="Patient"
              onClick={() => setValue('role', 'patient')}
              text="Schedule Appointment and manage health information"
            />
            <AccountType
              active={role === 'doctor'}
              header="Doctor"
              onClick={() => setValue('role', 'doctor')}
              text="Manage patient and appointments history"
            />
          </div>
        </div>
        <TextField<RegisterForm>
          id="username"
          label="Username"
          error={errors.username?.message}
          name="username"
          register={register}
          placeholder="Enter Email Address"
          required
          options={{
            required: 'Username is required',
            validate: {
              email: v => isEmail(v) || 'A valid email is required.',
            },
          }}
        />

        <TextField<RegisterForm>
          id="password"
          label="Password"
          error={errors.password?.message}
          name="password"
          register={register}
          placeholder="Enter Password"
          required
          type="password"
          options={{
            required: 'Password is required',
            validate: {
              maxLength: v => v.length <= 25 || 'Maximum of 25 characters',
              minLength: v => v.length >= 12 || 'Minimum of 12 characters',
              isDigit: v => /\d/.test(v) || 'Must contain at least 1 number.',
              isSpecial: v =>
                /[^A-Za-z0-9\s]+/.test(v) ||
                'Must contain at least 1 special character.',
            },
          }}
        />

        <ErrorMessage message={formError} />
        <div className={styles.buttonContainer}>
          <Button label="Sign Up" type="submit" primary disabled={!isValid} />
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
