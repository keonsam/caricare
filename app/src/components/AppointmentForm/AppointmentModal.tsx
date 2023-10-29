import { useForm } from 'react-hook-form';
import Footer from '../Footer/Footer';
import Modal from '../Modal/Modal';
import TextField from '../TextField/TextField';
import { Appointment, AppointmentForm } from '../../types/Appointment';
import { useEffect, useState } from 'react';
import TextArea from '../TextArea/TextArea';
import DoctorSelect from '../DoctorSelect/DoctorSelect';
import axiosClient from '../../config/axiosClient';
import { useAuth } from '../../context/AuthContext';

type Props = {
  appointment?: Appointment;
  id?: string;
  onClose: (update?: boolean) => void;
};

const AppointmentModal = ({ appointment, id, onClose }: Props) => {
  const [isSaving, setIsSaving] = useState(false);
  const { token } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm<AppointmentForm>({
    mode: 'onBlur',
    defaultValues: {
      doctorId: '',
      description: '',
      dateOfAppointment: new Date().toISOString(),
    },
  });

  useEffect(() => {
    if (id && appointment) {
      setValue('doctorId', appointment.doctorId);
      setValue('description', appointment.description);
      setValue('dateOfAppointment', appointment.dateOfAppointment);
    }
  }, [id, appointment, setValue]);

  const onSubmit = async (data: AppointmentForm) => {
    try {
      setIsSaving(true);
      await axiosClient.post('/appointments', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onClose(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal
      title={id === 'edit' ? 'Edit Appointment' : 'Create Appointment'}
      footer={
        <Footer
          disabled={isSaving || !isValid}
          onClose={onClose}
          submitLabel={id === 'edit' ? 'Save' : 'Submit'}
          onSubmit={handleSubmit(onSubmit)}
          closeLabel="Cancel"
        />
      }
      onClose={onClose}
    >
      <form>
        {/* TODO: change to autocomplete */}
        <DoctorSelect<AppointmentForm>
          id="doctorId"
          label="Doctor"
          error={errors.doctorId?.message}
          name="doctorId"
          placeholder="Select A Doctor "
          register={register}
          required
          options={{
            required: 'Select a doctor from dropdown',
          }}
        />

        <TextField<AppointmentForm>
          id="dateOfAppointment"
          label="Date of Appointment"
          error={errors.dateOfAppointment?.message}
          name="dateOfAppointment"
          placeholder="Start of Appointment"
          register={register}
          required
          type="datetime-local"
          options={{
            required: 'Date of Appointment is required',
            validate: {
              minLength: v =>
                new Date(v) >= new Date() || 'Minimum date is now',
            },
          }}
        />

        <TextArea<AppointmentForm>
          id="description"
          label="Description"
          error={errors.description?.message}
          name="description"
          placeholder="Short description to the doctor"
          register={register}
          required
          options={{
            required: 'description is required',
          }}
        />
      </form>
    </Modal>
  );
};

export default AppointmentModal;
