export type ButtonVariant =
  | "primary"
  | "secondary"
  | "transparent"
  | "neutral"
  | "danger";

export type ButtonProps = {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
  disabled?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
  justifyContent?: string;
  size?: "sm" | "md" | "lg";
  radius?: string;
};
