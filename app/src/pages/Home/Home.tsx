import { Link } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout/AuthLayout';
import styles from './Home.module.css';

const Home = () => {
  return (
    <AuthLayout>
      
      <div className={styles.links}>
        <Link to="/register">Sign up</Link>
        <Link to="/login">Login</Link>
      </div>
    </AuthLayout>
  );
};

export default Home;
