import styles from "./Button.module.css";

type Props = {
  disabled?: boolean;
  label: string;
  primary?: boolean;
  size?: "full" | "medium" | "small";
  type?: "submit" | "button";
  onClick?: () => void;
};

export const Button = ({
  disabled = false,
  label,
  size,
  primary,
  type = "button",
  onClick,
}: Props) => {
  return (
    <button
      className={`${styles.button} ${primary ? styles.primary : ""} ${
        size ? styles[size] : ""
      } ${disabled && primary ? styles.disabled: ""}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
