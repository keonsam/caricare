import { ReactNode } from 'react';
import NavBar from '../NavBar/NavBar';
import styles from './NavLayout.module.css';

type Props = {
  children: ReactNode;
};

const NavLayout = ({ children }: Props) => {  
  return (
    <div className={styles.layout}>
      <NavBar />
      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default NavLayout;
