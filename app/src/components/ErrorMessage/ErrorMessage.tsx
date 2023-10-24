import styles from './ErrorMessage.module.css';
type Props = {
  message?: string;
};

const ErrorMessage = ({ message }: Props) => {
  return <p className={styles.error}>{message}</p>;
};

export default ErrorMessage;
