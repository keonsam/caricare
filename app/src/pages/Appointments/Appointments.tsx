import { useCallback, useEffect, useState } from 'react';
import Button from '../../components/Button/Button';
import NavLayout from '../../components/NavLayout/NavLayout';
import AppointmentModal from '../../components/AppointmentForm/AppointmentModal';
import styles from './Appointments.module.css';
import {
  faChevronLeft,
  faChevronRight,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import axiosClient from '../../config/axiosClient';
import {
  Appointment,
  Appointments as IAppointments,
} from '../../types/Appointment';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatAppointmentDate } from '../../utils/appointment';
import AppointmentView from '../../components/AppointmentView/AppointmentView';

type AppointmentItemProp = {
  appointment: Appointment;
  isDoctor: boolean;
  isActive: boolean;
  onClick: () => void;
};

const AppointmentItem = ({
  appointment,
  isActive,
  isDoctor,
  onClick,
}: AppointmentItemProp) => {
  const { dateOfAppointment: date, status, doctor, patient } = appointment;
  return (
    <li
      className={`${styles.item} ${isActive && styles.itemActive}`}
      onClick={onClick}
    >
      <div className={styles.itemDetails}>
        {isDoctor ? (
          <p
            className={styles.itemTitle}
          >{`${patient.firstName} ${patient.lastName}`}</p>
        ) : (
          <p
            className={styles.itemTitle}
          >{`${doctor.title} ${doctor.firstName} ${doctor.lastName}`}</p>
        )}
        <p className={styles.itemDate}>{formatAppointmentDate(date)}</p>
      </div>
      <div className={`${styles.status}`}>
        <p className={`${styles.statusText} ${styles[status]}`}>{status}</p>
      </div>
    </li>
  );
};

const Appointments = () => {
  const [id, setId] = useState('');
  const [showAppointModal, setShowAppointModal] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { token, user } = useAuth();
  const isDoctor = user.role === 'doctor';
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedId, setSelectedId] = useState<string>('');
  const [sort, setSort] = useState<'incoming' | 'all'>('incoming');

  const isIncoming = sort === 'incoming';

  const toggleAppointModal = (update?: boolean) => {
    if (update) {
      getAppointments();
    }
    setShowAppointModal(!showAppointModal);
  };

  const handleNewAppointment = () => {
    setId('');
    toggleAppointModal();
  };

  const getAppointments = useCallback(
    async (page = pageNumber, order = sort) => {
      try {
        let query = '';
        if (order === 'all') {
          query = `?pageNumber=${page}`;
        } else {
          const date = new Date().toISOString();
          query = `?pageNumber=${page}&sort=ASC&date=${date}`;
        }
        const { data: result } = await axiosClient.get<IAppointments>(
          `/appointments${query}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (result.data) {
          setAppointments(result.data);
          setTotalPages(Math.ceil(result.total / 5) - 1);
        }
      } catch (e) {
        // TODO: handle error
        console.log(e);
      }
    },
    [token, pageNumber, sort],
  );

  useEffect(() => {
    if (!appointments.length) {
      getAppointments();
    }
  }, [getAppointments, appointments.length]);

  const appointment = appointments.find(({ id }) => id === selectedId);

  return (
    <NavLayout>
      <div className={styles.paper}>
        <div className={styles.appointButton}>
          <h2 className={styles.title}>Appointments</h2>
          <Button
            label="Create"
            onClick={handleNewAppointment}
            size="small"
            variant="solid"
            color="primary"
            icon={faPlus}
          />
        </div>
        {appointments.length ? (
          <div className={styles.list}>
            <div className={styles.listSection}>
              {/* // TODO: controls move to component */}
              <div className={styles.pagination}>
                <div className={styles.pagination1}>
                  <button
                    className={styles.paginationIcon}
                    disabled={pageNumber === 0}
                    onClick={() => {
                      const newPage = pageNumber - 1;
                      setPageNumber(newPage);
                      getAppointments(newPage);
                    }}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>

                  <button
                    className={styles.paginationIcon}
                    disabled={pageNumber === totalPages}
                    onClick={() => {
                      const newPage = pageNumber + 1;
                      setPageNumber(newPage);
                      getAppointments(newPage);
                    }}
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>
                <div className={styles.pagination1}>
                  <button
                    className={`${styles.paginationToggle} ${
                      isIncoming && styles.active
                    }`}
                    onClick={() => {
                      setPageNumber(0);
                      setSort('incoming');
                      getAppointments(0, 'incoming');
                    }}
                  >
                    Incoming
                  </button>

                  <button
                    className={`${styles.paginationToggle} ${
                      !isIncoming && styles.active
                    }`}
                    onClick={() => {
                      setPageNumber(0);
                      setSort('all');
                      getAppointments(0, 'all');
                    }}
                  >
                    All
                  </button>
                  
                </div>
              </div>

              <ul className={styles.ul}>
                {appointments.map(appointment => (
                  <AppointmentItem
                    key={appointment.id}
                    appointment={appointment}
                    isDoctor={isDoctor}
                    isActive={appointment.id === selectedId}
                    onClick={() => setSelectedId(appointment.id)}
                  />
                ))}
              </ul>
            </div>

            <div className={styles.listSection}>
              {appointment && (
                <AppointmentView
                  appointment={appointment}
                  isDoctor={isDoctor}
                  onUpdate={getAppointments}
                />
              )}
            </div>
          </div>
        ) : (
          <p className={styles.noAppointments}>No Appointment</p>
        )}
        {showAppointModal && (
          <AppointmentModal id={id} onClose={toggleAppointModal} />
        )}
      </div>
    </NavLayout>
  );
};

export default Appointments;
