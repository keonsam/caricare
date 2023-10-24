import { useState } from 'react';
import AuthLayout from '../../components/AuthLayout/AuthLayout';
import axiosClient from '../../config/axiosClient';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DoctorForm, PatientForm, UserInfoForm } from '../../types/User';
import { LoginResponse } from '../../types/Login';
import styles from './UserInfo.module.css';
import TextField from '../../components/TextField/TextField';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import Button from '../../components/Button/Button';
import { useForm } from 'react-hook-form';

const defaultDoctor = {
  firstName: '',
  lastName: '',
  title: '',
  speciality: '',
  officeName: '',
  officeLocation: '',
};

const defaultPatient = {
  firstName: '',
  lastName: '',
  dob: '',
};

const UserInfo = () => {
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
  const { user, logIn, token } = useAuth();
  const [isDoctor] = useState(user.role === 'doctor');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<UserInfoForm>({
    mode: 'onBlur',
    defaultValues: isDoctor ? defaultDoctor : defaultPatient,
  });

  const onSubmit = async (data: PatientForm | DoctorForm) => {
    try {
      const { data: res } = await axiosClient.post<LoginResponse>(
        `/user/${user.role}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      logIn(res.token);
      navigate('/dashboard');
    } catch (e) {
      // ts-ignore
      console.log(e);
      if (e instanceof Error) setFormError(e?.message || '');
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <p>Welcome, add Personal Information to proceed</p>
        <TextField<UserInfoForm>
          id="firstName"
          label="First Name"
          error={errors.firstName?.message}
          name="firstName"
          register={register}
          placeholder="Enter first name"
          required
          options={{
            required: 'First name is required',
          }}
        />
        <TextField<UserInfoForm>
          id="lastName"
          label="Last Name"
          error={errors.lastName?.message}
          name="lastName"
          register={register}
          placeholder="Enter last name"
          required
          options={{
            required: 'Last name is required',
          }}
        />

        {!isDoctor && (
          <TextField<UserInfoForm>
            id="dob"
            label="Date of Birth"
            error={errors.dob?.message}
            name="dob"
            register={register}
            placeholder="Enter date of birth"
            required={!isDoctor}
            type="date"
            options={{
              required: 'Date of Birth is required',
            }}
          />
        )}

        {isDoctor && (
          <>
            <TextField<UserInfoForm>
              id="title"
              label="Title"
              error={errors.title?.message}
              name="title"
              register={register}
              placeholder="Enter doctor's title"
              required={isDoctor}
              options={{
                required: 'Title is required',
              }}
            />

            <TextField<UserInfoForm>
              id="speciality"
              label="Speciality"
              error={errors.speciality?.message}
              name="speciality"
              register={register}
              placeholder="Enter medical field speciality"
              required={isDoctor}
              options={{
                required: 'Speciality is required',
              }}
            />

            <TextField<UserInfoForm>
              id="officeName"
              label="Office Name"
              error={errors.speciality?.message}
              name="officeName"
              register={register}
              placeholder="Enter doctor's business office name"
              required={isDoctor}
              options={{
                required: 'Office Name is required',
              }}
            />

            <TextField<UserInfoForm>
              id="officeLocation"
              label="Office Location"
              error={errors.speciality?.message}
              name="officeLocation"
              register={register}
              placeholder="Enter doctor's business office location"
              required={isDoctor}
              options={{
                required: 'Office Location is required',
              }}
            />
          </>
        )}
        <ErrorMessage message={formError} />
        <div className={styles.buttonContainer}>
          <Button label="Submit" type="submit" primary disabled={!isValid} />
        </div>
      </form>
    </AuthLayout>
  );
};

export default UserInfo;
