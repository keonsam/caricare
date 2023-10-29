import { Link, useLocation } from 'react-router-dom';
import Logo from '../Logo/Logo';
import styles from './NavBar.module.css';
// import Button from '../Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  IconDefinition,
  faCalendarDay,
  faGripVertical,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import Button from '../Button/Button';

type NavLinkProps = {
  icon: IconDefinition;
  isActive: boolean;
  link: string;
  text: string;
};

const NavLink = ({ icon, isActive, link, text }: NavLinkProps) => {
  return (
    <Link
      className={`${styles.navLink} ${isActive && styles.active}`}
      to={link}
    >
      <FontAwesomeIcon icon={icon} className={styles.navLinkIcon} />
      {text}
    </Link>
  );
};

const routes = [
  {
    icon: faGripVertical,
    link: '/dashboard',
    text: 'Dashboard',
  },
  {
    icon: faCalendarDay,
    link: '/appointments',
    text: 'Appointments',
  },
  {
    icon: faUser,
    link: '/profile',
    text: 'Profile',
  },
];

const NavBar = () => {
  const { pathname } = useLocation();
  const { logOut } = useAuth();
  // const handleLogOut = () => {};
  return (
    <header className={styles.navBar}>
      <Logo />
      <nav className={styles.nav}>
        {routes.map(({ icon, link, text }) => (
          <NavLink
            key={text}
            icon={icon}
            link={link}
            text={text}
            isActive={pathname.includes(link)}
          />
        ))}
        {/* {user.role === Role.ADMIN && (
          <Link className={styles.navLink} to="/manage-customers">
            Manage
          </Link>
        )} */}
        {/* <Button label="log out" primary size="small" onClick={handleLogOut} /> */}
      </nav>

      <div className={styles.buttonContainer}>
        <Button
          label="Log Out"
          onClick={logOut}
          size="small"
          variant="outlined"
          color="secondary"
        />
      </div>
    </header>
  );
};

export default NavBar;
