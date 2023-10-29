import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Logo.module.css';
import { faDna,  } from '@fortawesome/free-solid-svg-icons';

const Logo = () => {
  return (
    <div className={styles.logo}>
      <FontAwesomeIcon icon={faDna} className={styles.icon} />
      <h1 className={styles.header}>CariCare</h1>
    </div>
  );
};

export default Logo;
