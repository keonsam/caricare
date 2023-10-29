import { useState } from 'react';
import axiosClient from '../../config/axiosClient';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DoctorForm, PatientForm, UserInfoForm } from '../../types/User';
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

const Profile = () => {
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
  const { user, logIn, token, logOut } = useAuth();
  const isDoctor = user.role === 'doctor';
  const isEdit = !!user.info.id;
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<UserInfoForm>({
    mode: 'onBlur',
    defaultValues: isDoctor ? defaultDoctor : defaultPatient,
  });

  const onSubmit = async (data: PatientForm | DoctorForm) => {
    const route = isDoctor ? '/doctors' : '/patients';
    try {
      setIsSaving(true);
      const { data: res } = await axiosClient.post<LoginResponse>(route, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
            {isDoctor ? 'professional' : 'personal'} information so that we can
            get started with setting up your profile.
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

          {!isDoctor && (
            <>
              <TextField<UserInfoForm>
                id="address"
                label="Address"
                error={errors.address?.message}
                name="address"
                register={register}
                placeholder="Enter personal address"
                required={!isDoctor}
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
                required={!isDoctor}
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
              />

              <TextField<UserInfoForm>
                id="officeName"
                label="Office Name"
                error={errors.officeName?.message}
                name="officeName"
                register={register}
                placeholder="Enter office name"
                required={isDoctor}
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
                required={isDoctor}
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
              disabled={isSaving || !isValid}
              size="medium"
              variant="solid"
              color="primary"
            />

            {isEdit && (
              <Button
                label="Delete Account"
                type="submit"
                size="medium"
                variant="outlined"
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