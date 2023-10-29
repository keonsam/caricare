import { ReactNode } from 'react';
import styles from './Modal.module.css';

type Props = {
  children: ReactNode;
  title: string;
  footer: ReactNode;
  onClose: () => void;
};

const Modal = ({ children, footer, title, onClose }: Props) => {
  return (
    <div className={styles.overlay} role="dialog" onClick={onClose}>
      <div className={styles.content} onClick={e => e.stopPropagation()}>
        <h3 className={styles.title}>{title}</h3>
        <>{children}</>
        <>{footer}</>
      </div>
    </div>
  );
};

export default Modal;
