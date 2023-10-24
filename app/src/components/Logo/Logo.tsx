import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Logo.module.css';
import { faUserNurse } from '@fortawesome/free-solid-svg-icons';

const Logo = () => {
  return (
    <div className={styles.container}>
      <FontAwesomeIcon icon={faUserNurse} className={styles.icon} />
      <h1 className={styles.header}>CariCare</h1>
    </div>
  );
};

export default Logo;
