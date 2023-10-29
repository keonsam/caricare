import { useNavigate, useParams } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout/AuthLayout';
import { useState } from 'react';
import { ConfirmationForm } from '../../types/Confirmation';
import { useForm } from 'react-hook-form';
import axiosClient from '../../config/axiosClient';
import { LoginResponse } from '../../types/Login';
import TextField from '../../components/TextField/TextField';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import Button from '../../components/Button/Button';
import styles from './ConfirmCode.module.css';
import { useAuth } from '../../context/AuthContext';

const ConfirmCode = () => {
  const { id } = useParams();
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
  const { logIn } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ConfirmationForm>({
    mode: 'onBlur',
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (data: ConfirmationForm) => {
    try {
      setIsSaving(true);
      const { data: res } = await axiosClient.post<LoginResponse>(
        '/confirm-code',
        {
          id,
          code: Number(data.code),
        },
      );

      logIn(res.token);
      navigate('/profile');
    } catch (e) {
      // ts-ignore
      console.log(e);
      if (e instanceof Error) setFormError(e?.message || '');
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <AuthLayout subTitle="Confirmation">
      <form onSubmit={handleSubmit(onSubmit)}>
        <p className={styles.confirmText}>
          Please enter the six-digit confirmation code that has been sent to
          your registered email address.
        </p>
        <TextField<ConfirmationForm>
          id="code"
          label="Code"
          error={errors.code?.message}
          name="code"
          register={register}
          placeholder="Enter Confirmation Code"
          required
          options={{
            required: 'Code is required',
            validate: {
              length: v => v.length === 6 || 'Enter 6 digit code',
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

export default ConfirmCode;
