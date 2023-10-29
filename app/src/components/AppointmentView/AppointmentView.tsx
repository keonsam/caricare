import axiosClient from '../../config/axiosClient';
import { useAuth } from '../../context/AuthContext';
import { Appointment, AppointmentStatus } from '../../types/Appointment';
import {
  formatAppointmentDate,
  getDateOfBirth,
  getDoctorName,
  getPatientName,
} from '../../utils/appointment';
import Button from '../Button/Button';
import styles from './AppointmentView.module.css';

type Props = {
  appointment: Appointment;
  isDoctor: boolean;
  onUpdate: () => void;
};

const AppointmentView = ({ appointment, isDoctor, onUpdate }: Props) => {
  const { id, doctor, patient, status, dateOfAppointment, description } =
    appointment;
  const { token } = useAuth();

  const handleUpdate = async (newStatus: AppointmentStatus) => {
    try {
      await axiosClient.put(
        `/appointments/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      onUpdate();
    } catch (e) {
      // TODO: handle error
      console.log(e);
    }
  };

  const isPending = status === 'pending';
  const isCancelable =
    ['pending', 'confirmed'].includes(status) &&
    new Date(dateOfAppointment) >= new Date();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.headerTitle}>
          {isDoctor ? getPatientName(patient) : getDoctorName(doctor)}
        </p>
        <p className={styles.headerDate}>
          {formatAppointmentDate(dateOfAppointment)}
        </p>
      </div>

      {isDoctor ? (
        <>
          <p className={styles.datePoint}>
            <span className={styles.datePointTitle}>Date of Birth</span>{' '}
            <span className={styles.datePointText}>
              {getDateOfBirth(patient)}
            </span>
          </p>

          <p className={styles.datePoint}>
            <span className={styles.datePointTitle}>Height</span>{' '}
            <span className={styles.datePointText}>{patient.height || ''}</span>
          </p>

          <p className={styles.datePoint}>
            <span className={styles.datePointTitle}>Weight</span>{' '}
            <span className={styles.datePointText}>{patient.weight || ''}</span>
          </p>

          <p className={styles.datePoint}>
            <span className={styles.datePointTitle}>Address</span>{' '}
            <span className={styles.datePointText}>{patient.address}</span>
          </p>
        </>
      ) : (
        <>
          <p className={styles.datePoint}>
            <span className={styles.datePointTitle}>Speciality</span>{' '}
            <span className={styles.datePointText}>{doctor.speciality}</span>
          </p>
          <p className={styles.datePoint}>
            <span className={styles.datePointTitle}>Office Name</span>{' '}
            <span className={styles.datePointText}>{doctor.officeName}</span>
          </p>
          <p className={styles.datePoint}>
            <span className={styles.datePointTitle}>Office Location</span>{' '}
            <span className={styles.datePointText}>
              {doctor.officeLocation}
            </span>
          </p>
        </>
      )}

      {/* TODO: move divider to component */}
      <div className={styles.divider}></div>

      <p className={styles.datePoint}>
        <span className={styles.datePointTitle}>Status</span>{' '}
        <span className={`${styles.datePointText} ${styles[status]}`}>
          {status}
        </span>
      </p>

      <p className={`${styles.datePoint} ${styles.description}`}>
        <span className={styles.datePointTitle}>Description</span>{' '}
        <span className={styles.datePointText}>{description}</span>
      </p>

      <div className={styles.buttonContainer}>
        {isPending && isDoctor && (
          <Button
            label="Accept"
            onClick={() => handleUpdate('confirmed')}
            size="full"
            variant="solid"
            color="primary"
          />
        )}
        {isCancelable && (
          <Button
            label="Cancel"
            onClick={() => handleUpdate('canceled')}
            size="full"
            variant="solid"
            color="warn"
          />
        )}
      </div>
    </div>
  );
};

export default AppointmentView;
