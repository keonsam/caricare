import { Link } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout/AuthLayout';
import styles from './Home.module.css';
import Button from '../../components/Button/Button';

const Home = () => {
  return (
    <AuthLayout subTitle="Welcome">
      <div className={styles.homeLinks}>
        <Link to="/register" className={styles.link}>
          <Button label="Sign up" size="full" />
        </Link>

        <Link to="/login" className={styles.link}>
          <Button
            label="Login"
            variant="outlined"
            color="secondary"
            size="full"
          />
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Home;
