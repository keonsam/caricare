import { ReactNode, useEffect } from 'react';
import styles from './AuthLayout.module.css';
import Logo from '../Logo/Logo';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

type Props = {
  children: ReactNode;
  subTitle: string;
};
const AuthLayout = ({ children, subTitle }: Props) => {
  const { isLogIn, user } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (isLogIn()) {
      if (user.info.id) {
        navigate('/appointment');
      } else {
        navigate('/profile');
      }
    }
  }, [isLogIn, user.info, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.paper}>
        <div className={styles.section}>
          <Logo />
          <h2 className={styles.subTitle}>{subTitle}</h2>
          <div>{children}</div>
        </div>
        <div className={`${styles.section} ${styles.medBackground}`}></div>
      </div>
    </div>
  );
};

export default AuthLayout;
