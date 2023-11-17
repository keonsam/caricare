import { useEffect, useState } from 'react';
import axiosClient from '../../config/axiosClient';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  DoctorForm,
  PatientForm,
  UserInfo,
  UserInfoForm,
  isUserPatient,
} from '../../types/User';
import { LoginResponse } from '../../types/Login';
import styles from './Profile.module.css';
import TextField from '../../components/TextField/TextField';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import Button from '../../components/Button/Button';
import { useForm } from 'react-hook-form';
import NavLayout from '../../components/NavLayout/NavLayout';

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
  address: '',
};

// TODO: separate this page to create and edit mode to avoid refresh before navigating
const Profile = () => {
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
  const { user, logIn, token, logOut } = useAuth();
  const isPatient = user.role === 'patient';
  const isEdit = !!user.info.id;
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm<UserInfoForm>({
    mode: 'onBlur',
    defaultValues: !isPatient ? defaultDoctor : defaultPatient,
  });

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const { data: profile } = await axiosClient.get<UserInfo>(
          'users/profile',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setValue('firstName', profile.firstName);
        setValue('lastName', profile.lastName);

        if (!isUserPatient(profile)) {
          setValue('title', profile.title);
          setValue('speciality', profile.speciality);
          setValue('officeName', profile.officeName);
          setValue('officeLocation', profile.officeLocation);
        } else {
          setValue('address', profile.address);
          setValue('dob', profile.dob);
          setValue('height', profile.height);
          setValue('weight', profile.weight);
        }
      } catch (e) {
        console.error(e);
      }
    };
    if (isEdit) {
      getUserInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: PatientForm | DoctorForm) => {
    try {
      setIsSaving(true);
      if (isEdit) {
        // TODO: pending implementation
        return;
      }

      const { data: res } = await axiosClient.post<LoginResponse>(
        '/users/profile',
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
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

  const handleDelete = async () => {
    try {
      await axiosClient.delete('/account', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      logOut();
      navigate('/');
    } catch (e) {
      // ts-ignore
      console.log(e);
    }
  };

  return (
    <NavLayout>
      <div className={styles.profile}>
        <h2 className={styles.title}>{isEdit ? 'Edit' : 'Create'} Profile</h2>
        {!isEdit && (
          <p className={styles.tagLine}>
            Welcome to CariCare! To begin, please provide your{' '}
            {!isPatient ? 'professional' : 'personal'} information so that we
            can get started with setting up your profile.
          </p>
        )}
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
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

          {isPatient && (
            <>
              <TextField<UserInfoForm>
                id="address"
                label="Address"
                error={errors.address?.message}
                name="address"
                register={register}
                placeholder="Enter personal address"
                required={isPatient}
                options={{
                  required: 'Address is required',
                }}
              />

              <TextField<UserInfoForm>
                id="dob"
                label="Date of Birth"
                error={errors.dob?.message}
                name="dob"
                register={register}
                placeholder="Enter date of birth"
                required={isPatient}
                type="date"
                options={{
                  required: 'Date of Birth is required',
                }}
              />

              <TextField<UserInfoForm>
                id="height"
                label="Height"
                error={errors.height?.message}
                name="height"
                register={register}
                placeholder="Enter in inches, 5.9 = 5'9"
                type="number"
              />

              <TextField<UserInfoForm>
                id="weight"
                label="Weight"
                error={errors.weight?.message}
                name="weight"
                register={register}
                placeholder="Enter weight in pounds"
                type="number"
              />
            </>
          )}

          {!isPatient && (
            <>
              <TextField<UserInfoForm>
                id="title"
                label="Title"
                error={errors.title?.message}
                name="title"
                register={register}
                placeholder="Enter doctor's title"
                required={!isPatient}
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
                required={!isPatient}
              />

              <TextField<UserInfoForm>
                id="officeName"
                label="Office Name"
                error={errors.officeName?.message}
                name="officeName"
                register={register}
                placeholder="Enter office name"
                required={!isPatient}
                options={{
                  required: 'Office Name is required',
                }}
              />

              <TextField<UserInfoForm>
                id="officeLocation"
                label="Office Location"
                error={errors.officeLocation?.message}
                name="officeLocation"
                register={register}
                placeholder="Enter office location"
                required={!isPatient}
                options={{
                  required: 'Office Location is required',
                }}
              />
            </>
          )}

          <div className={styles.fullWidth}>
            <ErrorMessage message={formError} />
          </div>
          <div className={styles.buttonContainer}>
            <Button
              label="Submit"
              type="submit"
              disabled={isSaving || isEdit || !isValid}
              size="medium"
              variant="solid"
              color="primary"
            />

            {isEdit && (
              <Button
                label="Delete Account"
                size="medium"
                color="warn"
                onClick={handleDelete}
              />
            )}
          </div>
        </form>
      </div>
    </NavLayout>
  );
};

export default Profile;
