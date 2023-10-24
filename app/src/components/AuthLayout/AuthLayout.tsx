import { ReactNode } from 'react';
import styles from './AuthLayout.module.css';
import Logo from '../Logo/Logo';

type Props = {
  children: ReactNode;
};
const AuthLayout = ({ children }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.paper}>
        <div className={styles.logoContainer}>
          <Logo />
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
