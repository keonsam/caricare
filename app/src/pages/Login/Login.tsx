import { useForm } from 'react-hook-form';
import { useState } from 'react';
import TextField from '../../components/TextField/TextField';
import styles from './Login.module.css';
import { RegisterForm } from '../../types/Register';
import { isEmail } from '../../utils/validators';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import Button from '../../components/Button/Button';
import AuthLayout from '../../components/AuthLayout/AuthLayout';
import axiosClient from '../../config/axiosClient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoginResponse } from '../../types/Login';

const Login = () => {
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
  const { logIn } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterForm>({
    mode: 'onBlur',
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsSaving(true);
      const { data: res } = await axiosClient.post<LoginResponse>(
        '/login',
        data,
      );
      logIn(res.token);
      navigate('/appointments');
    } catch (e) {
      // ts-ignore
      console.log(e);
      if (e instanceof Error) setFormError(e?.message || '');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AuthLayout subTitle="Login">
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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
          <Button
            label="Submit"
            type="submit"
            disabled={isSaving || !isValid}
            size="full"
            variant="solid"
            color="primary"
          />
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
